import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { Modal } from '../components/Modal';
import { useProductStore } from '../stores/productStore';
import { useSupplierStore } from '../stores/supplierStore';
import type { Database } from '../lib/database.types';

type Product = Database['public']['Tables']['products']['Row'];
type Supplier = Database['public']['Tables']['suppliers']['Row'];

interface Location {
  id?: number;
  name: string;
  type: string;
  address: string;
  capacity: number;
  manager: string;
}

export function Products() {
  const { 
    products, 
    loading: productsLoading, 
    error: productsError,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct
  } = useProductStore();

  const {
    suppliers,
    loading: suppliersLoading,
    error: suppliersError,
    fetchSuppliers
  } = useSupplierStore();

  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Partial<Product> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  useEffect(() => {
    fetchProducts();
    fetchSuppliers();
    fetchLocations();
  }, [fetchProducts, fetchSuppliers]);

  const fetchLocations = async () => {
    const { data, error } = await supabase
      .from('locations')
      .select('*');

    if (error) {
      console.error('Error fetching locations:', error);
    } else {
      setLocations(data || []);
    }
  };

  const handleAddProduct = async () => {
    if (!selectedProduct) return;

    const result = await createProduct(selectedProduct as Database['public']['Tables']['products']['Insert']);
    if (result) {
      setIsModalOpen(false);
      setSelectedProduct(null);
    }
  };

  const handleUpdateProduct = async () => {
    if (!selectedProduct?.id) return;

    const result = await updateProduct(
      selectedProduct.id,
      selectedProduct as Database['public']['Tables']['products']['Update']
    );
    if (result) {
      setIsModalOpen(false);
      setSelectedProduct(null);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    const confirmed = window.confirm('Are you sure you want to delete this product?');
    if (!confirmed) return;

    const result = await deleteProduct(id);
    if (result) {
      setSelectedProduct(null);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(products.map(product => product.category)));

  return (
    <div className="space-y-6 p-6 bg-white dark:bg-dark-900 min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Products</h1>
        <button 
          onClick={() => {
            setSelectedProduct({
              sku: '',
              name: '',
              category: '',
              stock: 0,
              price: 0,
              supplier_id: undefined,
              location_id: undefined
            });
            setIsModalOpen(true);
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="app-input pl-10"
            placeholder="Search products..."
          />
        </div>
        <select 
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="block pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-dark-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white dark:bg-dark-800 text-gray-900 dark:text-gray-100"
        >
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      <div className="bg-white dark:bg-dark-800 shadow-sm ring-1 ring-gray-900/5 dark:ring-dark-600/50 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-300 dark:divide-dark-600">
          <thead className="bg-gray-50 dark:bg-dark-700">
            <tr>
              <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">SKU</th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Name</th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Category</th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Stock</th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Price</th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Supplier</th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Location</th>
              <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-dark-600">
            {filteredProducts.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-dark-700">
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-gray-100">{product.sku}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">{product.name}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">{product.category}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">{product.stock}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">${product.price.toFixed(2)}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">{suppliers.find(supplier => supplier.id === product.supplier_id)?.name}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">{locations.find(location => location.id === product.location_id)?.name}</td>
                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => {
                        setSelectedProduct(product);
                        setIsModalOpen(true);
                      }}
                      className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={() => handleDeleteProduct(product.id)}
                      className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={selectedProduct?.id ? 'Edit Product' : 'Add Product'}
        onSubmit={selectedProduct?.id ? handleUpdateProduct : handleAddProduct}
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="sku" className="block text-sm font-medium text-gray-700">SKU</label>
            <input
              type="text"
              id="sku"
              className="app-input"
              value={selectedProduct?.sku || ''}
              onChange={(e) => setSelectedProduct(prev => prev ? {...prev, sku: e.target.value} : null)}
            />
          </div>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              id="name"
              className="app-input"
              value={selectedProduct?.name || ''}
              onChange={(e) => setSelectedProduct(prev => prev ? {...prev, name: e.target.value} : null)}
            />
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
            <select
              id="category"
              value={selectedProduct?.category || ''}
              onChange={(e) => setSelectedProduct(prev => prev ? {...prev, category: e.target.value} : null)}
              className="app-select"
            >
              <option value="">Select Category</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stock</label>
            <input
              type="number"
              id="stock"
              className="app-input"
              value={selectedProduct?.stock || 0}
              onChange={(e) => setSelectedProduct(prev => prev ? {...prev, stock: Number(e.target.value)} : null)}
            />
          </div>
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
            <input
              type="number"
              id="price"
              step="0.01"
              className="app-input"
              value={selectedProduct?.price || 0}
              onChange={(e) => setSelectedProduct(prev => prev ? {...prev, price: Number(e.target.value)} : null)}
            />
          </div>
          <div>
            <label htmlFor="supplier" className="block text-sm font-medium text-gray-700">Supplier</label>
            <select
              id="supplier"
              value={selectedProduct?.supplier_id || ''}
              onChange={(e) => setSelectedProduct(prev => prev ? {...prev, supplier_id: Number(e.target.value)} : null)}
              className="app-select"
            >
              <option value="">Select Supplier</option>
              {suppliers.map(supplier => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
            <select
              id="location"
              value={selectedProduct?.location_id || ''}
              onChange={(e) => setSelectedProduct(prev => prev ? {...prev, location_id: Number(e.target.value)} : null)}
              className="app-select"
            >
              <option value="">Select Location</option>
              {locations.map(location => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Modal>
    </div>
  );
}