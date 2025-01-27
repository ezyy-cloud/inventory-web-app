import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { Modal } from '../components/Modal';
import { useSupplierStore } from '../stores/supplierStore';
import type { Database } from '../lib/database.types';

type Supplier = Database['public']['Tables']['suppliers']['Row'];

export function Suppliers() {
  const {
    suppliers,
    loading,
    error,
    fetchSuppliers,
    createSupplier,
    updateSupplier,
    deleteSupplier
  } = useSupplierStore();

  const [selectedSupplier, setSelectedSupplier] = useState<Partial<Supplier> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  const handleAddSupplier = async () => {
    if (!selectedSupplier) return;

    const result = await createSupplier(selectedSupplier as Database['public']['Tables']['suppliers']['Insert']);
    if (result) {
      setIsModalOpen(false);
      setSelectedSupplier(null);
    }
  };

  const handleUpdateSupplier = async () => {
    if (!selectedSupplier?.id) return;

    const result = await updateSupplier(
      selectedSupplier.id,
      selectedSupplier as Database['public']['Tables']['suppliers']['Update']
    );
    if (result) {
      setIsModalOpen(false);
      setSelectedSupplier(null);
    }
  };

  const handleDeleteSupplier = async (id: number) => {
    const confirmed = window.confirm('Are you sure you want to delete this supplier?');
    if (!confirmed) return;

    const result = await deleteSupplier(id);
    if (result) {
      setSelectedSupplier(null);
    }
  };

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 p-6 bg-white dark:bg-dark-900 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Suppliers</h1>
        <button
          onClick={() => {
            setSelectedSupplier({
              name: '',
              email: '',
              phone: '',
              address: ''
            });
            setIsModalOpen(true);
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Supplier
        </button>
      </div>

      <div className="flex items-center px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-md bg-white dark:bg-dark-800">
        <Search className="h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search suppliers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="ml-2 block w-full text-sm border-0 focus:ring-0 dark:bg-dark-800 dark:text-gray-100"
        />
      </div>

      {loading ? (
        <div className="text-center text-gray-500 dark:text-gray-400">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-300 dark:divide-dark-600">
            <thead>
              <tr>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Name</th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Email</th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Phone</th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Address</th>
                <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-dark-700">
              {filteredSuppliers.map((supplier) => (
                <tr key={supplier.id}>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">{supplier.name}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">{supplier.email}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">{supplier.phone}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">{supplier.address}</td>
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedSupplier(supplier);
                          setIsModalOpen(true);
                        }}
                        className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteSupplier(supplier.id)}
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
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedSupplier(null);
        }}
        title={selectedSupplier?.id ? 'Edit Supplier' : 'Add Supplier'}
        onSubmit={selectedSupplier?.id ? handleUpdateSupplier : handleAddSupplier}
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={selectedSupplier?.name || ''}
              onChange={(e) => setSelectedSupplier(prev => prev ? { ...prev, name: e.target.value } : null)}
              className="app-input"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={selectedSupplier?.email || ''}
              onChange={(e) => setSelectedSupplier(prev => prev ? { ...prev, email: e.target.value } : null)}
              className="app-input"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              value={selectedSupplier?.phone || ''}
              onChange={(e) => setSelectedSupplier(prev => prev ? { ...prev, phone: e.target.value } : null)}
              className="app-input"
            />
          </div>
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Address
            </label>
            <input
              type="text"
              id="address"
              value={selectedSupplier?.address || ''}
              onChange={(e) => setSelectedSupplier(prev => prev ? { ...prev, address: e.target.value } : null)}
              className="app-input"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}