import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Package, TrendingDown, TrendingUp, AlertTriangle, LucideIcon } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface CategoryData {
  name: string;
  value: number;
}

interface DashboardStats {
  totalProducts: number;
  lowStockItems: number;
  monthlySales: number;
  stockValue: number;
}

interface DashboardCardProps {
  title: string;
  value: string;
  trend: string;
  trendUp: boolean;
  icon: LucideIcon;
  alert?: boolean;
  onClick?: () => void;
}

function DashboardCard({ title, value, trend, trendUp, icon: Icon, alert = false, onClick }: DashboardCardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        relative overflow-hidden rounded-lg 
        bg-white dark:bg-dark-800 
        px-4 pb-12 pt-5 
        shadow dark:shadow-dark 
        sm:px-6 sm:pt-6
        ${onClick ? 'cursor-pointer hover:shadow-lg dark:hover:shadow-xl transition-shadow' : ''}
      `}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium 
            ${alert 
              ? 'text-red-600 dark:text-red-400' 
              : 'text-gray-600 dark:text-gray-300'
            }`}
          >
            {title}
          </p>
          <p className="mt-1 text-3xl font-semibold text-gray-900 dark:text-gray-100">
            {value}
          </p>
        </div>
        <Icon 
          className={`h-12 w-12 
            ${alert 
              ? 'text-red-500 dark:text-red-400' 
              : 'text-gray-400 dark:text-gray-500'
            }`} 
        />
      </div>
      <div className="absolute bottom-0 inset-x-0 bg-gray-50 dark:bg-dark-700 px-4 py-4 sm:px-6">
        <div className="text-sm">
          <span 
            className={`font-medium 
              ${trendUp 
                ? 'text-green-600 dark:text-green-400' 
                : 'text-red-600 dark:text-red-400'
              }`}
          >
            {trend}
          </span>
          <span className="text-gray-500 dark:text-gray-400"> from last month</span>
        </div>
      </div>
    </div>
  );
}

export function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    lowStockItems: 0,
    monthlySales: 0,
    stockValue: 0
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // Fetch total products
      const { count: totalProducts } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

      // Fetch low stock items (assuming a threshold of 10)
      const { count: lowStockItems } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .lte('stock_quantity', 10);

      // You would replace these with actual calculations from your database
      const monthlySales = 45678;
      const stockValue = 123456;

      setStats({
        totalProducts: totalProducts || 0,
        lowStockItems: lowStockItems || 0,
        monthlySales,
        stockValue
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  const mockData: CategoryData[] = [
    { name: 'Electronics', value: 400 },
    { name: 'Clothing', value: 300 },
    { name: 'Food', value: 200 },
    { name: 'Books', value: 150 },
    { name: 'Sports', value: 100 },
  ];

  return (
    <div className="space-y-6 bg-white dark:bg-dark-900 min-h-screen p-6">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Dashboard</h1>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Total Products"
          value={stats.totalProducts.toString()}
          trend="+12%"
          trendUp={true}
          icon={Package}
          onClick={() => navigate('/products')}
        />
        <DashboardCard
          title="Low Stock Items"
          value={stats.lowStockItems.toString()}
          trend="+5"
          trendUp={false}
          icon={AlertTriangle}
          alert={true}
          onClick={() => navigate('/products?filter=low-stock')}
        />
        <DashboardCard
          title="Monthly Sales"
          value={`$${stats.monthlySales.toLocaleString()}`}
          trend="+23%"
          trendUp={true}
          icon={TrendingUp}
          onClick={() => navigate('/products?view=sales')}
        />
        <DashboardCard
          title="Stock Value"
          value={`$${stats.stockValue.toLocaleString()}`}
          trend="-2%"
          trendUp={false}
          icon={TrendingDown}
          onClick={() => navigate('/products?view=value')}
        />
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
          Inventory by Category
        </h2>
        <div className="h-96 bg-white dark:bg-dark-800 rounded-lg p-4 shadow dark:shadow-dark">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockData}>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="currentColor" 
                className="text-gray-300 dark:text-dark-600"
              />
              <XAxis 
                dataKey="name" 
                stroke="currentColor" 
                className="text-gray-600 dark:text-gray-300"
              />
              <YAxis 
                stroke="currentColor" 
                className="text-gray-600 dark:text-gray-300"
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgb(31, 41, 55)', 
                  color: 'white',
                  borderRadius: '0.5rem'
                }}
                labelStyle={{ color: 'white' }}
              />
              <Bar dataKey="value" fill="#4F46E5" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}