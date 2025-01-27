import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Truck, 
  MapPin, 
  Users, 
  Settings,
  Moon,
  Sun,
  Boxes
} from 'lucide-react';

interface SidebarProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const navigation = [
  { 
    name: 'Dashboard', 
    path: '/', 
    icon: LayoutDashboard 
  },
  { 
    name: 'Products', 
    path: '/products', 
    icon: Package 
  },
  { 
    name: 'Suppliers', 
    path: '/suppliers', 
    icon: Truck 
  },
  { 
    name: 'Locations', 
    path: '/locations', 
    icon: MapPin 
  },
  { 
    name: 'Users', 
    path: '/users', 
    icon: Users 
  },
  { 
    name: 'Settings', 
    path: '/settings', 
    icon: Settings 
  }
];

export function Sidebar({ isDarkMode, toggleDarkMode }: SidebarProps) {
  const location = useLocation();

  return (
    <div className={`
      hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col
      bg-white dark:bg-dark-800 
      border-r border-gray-200 dark:border-dark-700
      transition-colors duration-300
    `}>
      <div className="flex flex-col h-full">
        {/* Logo and App Name */}
        <div className="flex items-center justify-center h-16 border-b border-gray-200 dark:border-dark-700">
          <Link to="/" className="flex items-center space-x-2">
            <Boxes className="h-8 w-8 text-indigo-600 dark:text-gray-100" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Buzz Inventory
            </h1>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 py-4 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center px-4 py-2 text-sm font-medium 
                ${location.pathname === item.path 
                  ? 'bg-gray-100 dark:bg-dark-700 text-gray-900 dark:text-gray-100' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-700'}
                transition-colors duration-300
              `}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Dark Mode Toggle */}
        <div className="p-4 border-t border-gray-200 dark:border-dark-700">
          <button
            onClick={toggleDarkMode}
            className="
              w-full flex items-center justify-center 
              px-4 py-2 rounded-md 
              bg-gray-100 dark:bg-dark-700 
              text-gray-700 dark:text-gray-300
              hover:bg-gray-200 dark:hover:bg-dark-600
              transition-colors duration-300
            "
          >
            {isDarkMode ? (
              <>
                <Sun className="w-5 h-5 mr-2" />
                Light Mode
              </>
            ) : (
              <>
                <Moon className="w-5 h-5 mr-2" />
                Dark Mode
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}