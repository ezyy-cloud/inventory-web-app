import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { Modal } from '../components/Modal';
import { supabase } from '../lib/supabase';

interface Location {
  id?: number;
  name: string;
  type: string;
  address: string;
  capacity: number;
  manager: string;
}

export function Locations() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  useEffect(() => {
    fetchLocations();
  }, []);

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

  const handleAddLocation = async () => {
    if (!selectedLocation) return;

    const { error } = await supabase
      .from('locations')
      .insert(selectedLocation)
      .select();

    if (error) {
      console.error('Error adding location:', error);
    } else {
      fetchLocations();
      setIsModalOpen(false);
      setSelectedLocation(null);
    }
  };

  const handleUpdateLocation = async () => {
    if (!selectedLocation || !selectedLocation.id) return;

    const { error } = await supabase
      .from('locations')
      .update(selectedLocation)
      .eq('id', selectedLocation.id)
      .select();

    if (error) {
      console.error('Error updating location:', error);
    } else {
      fetchLocations();
      setIsModalOpen(false);
      setSelectedLocation(null);
    }
  };

  const handleDeleteLocation = async (id: number) => {
    const { error } = await supabase
      .from('locations')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting location:', error);
    } else {
      fetchLocations();
    }
  };

  const filteredLocations = locations.filter(location => 
    location.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (typeFilter ? location.type === typeFilter : true)
  );

  const openEditModal = (location: Location) => {
    setSelectedLocation(location);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setSelectedLocation({
      name: '',
      type: '',
      address: '',
      capacity: 0,
      manager: ''
    });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 p-6 bg-white dark:bg-dark-900 min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Locations</h1>
        <button 
          onClick={openAddModal}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Location
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
            placeholder="Search locations..."
          />
        </div>
        <select 
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="block pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-dark-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white dark:bg-dark-800 text-gray-900 dark:text-gray-100"
        >
          <option value="">All Types</option>
          <option value="Warehouse">Warehouse</option>
          <option value="Store">Store</option>
          <option value="Distribution Center">Distribution Center</option>
        </select>
      </div>

      <div className="bg-white dark:bg-dark-800 shadow-sm ring-1 ring-gray-900/5 dark:ring-dark-600/50 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-300 dark:divide-dark-600">
          <thead className="bg-gray-50 dark:bg-dark-700">
            <tr>
              <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Name</th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Type</th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Address</th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Capacity</th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Manager</th>
              <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-dark-600">
            {filteredLocations.map((location) => (
              <tr key={location.id} className="hover:bg-gray-50 dark:hover:bg-dark-700">
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-gray-100">{location.name}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">{location.type}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">{location.address}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">{location.capacity}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">{location.manager}</td>
                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => openEditModal(location)}
                      className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={() => handleDeleteLocation(location.id!)}
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
        title={selectedLocation?.id ? 'Edit Location' : 'Add Location'}
        onSubmit={selectedLocation?.id ? handleUpdateLocation : handleAddLocation}
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
            <input
              type="text"
              id="name"
              className="app-input"
              value={selectedLocation?.name || ''}
              onChange={(e) => setSelectedLocation(prev => prev ? {...prev, name: e.target.value} : null)}
            />
          </div>
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Type</label>
            <select
              id="type"
              value={selectedLocation?.type || ''}
              onChange={(e) => setSelectedLocation(prev => prev ? {...prev, type: e.target.value} : null)}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-dark-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white dark:bg-dark-800 text-gray-900 dark:text-gray-100"
            >
              <option value="">Select Type</option>
              <option value="Warehouse">Warehouse</option>
              <option value="Store">Store</option>
              <option value="Distribution Center">Distribution Center</option>
            </select>
          </div>
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Address</label>
            <input
              type="text"
              id="address"
              className="app-input"
              value={selectedLocation?.address || ''}
              onChange={(e) => setSelectedLocation(prev => prev ? {...prev, address: e.target.value} : null)}
            />
          </div>
          <div>
            <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Capacity</label>
            <input
              type="number"
              id="capacity"
              className="app-input"
              value={selectedLocation?.capacity || 0}
              onChange={(e) => setSelectedLocation(prev => prev ? {...prev, capacity: Number(e.target.value)} : null)}
            />
          </div>
          <div>
            <label htmlFor="manager" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Manager</label>
            <input
              type="text"
              id="manager"
              className="app-input"
              value={selectedLocation?.manager || ''}
              onChange={(e) => setSelectedLocation(prev => prev ? {...prev, manager: e.target.value} : null)}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}