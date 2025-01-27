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

interface User {
  id?: number;
  name: string;
  email: string;
  role: string;
  department: string;
  status: 'Active' | 'Inactive';
  location_id?: number;
  location_name?: string;
}

export function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  useEffect(() => {
    fetchUsers();
    fetchLocations();
  }, []);

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from('users')
      .select('*, locations(name)');

    if (error) {
      console.error('Error fetching users:', error);
    } else {
      const transformedUsers = data?.map(user => ({
        ...user,
        location_name: user.locations?.name
      })) || [];
      setUsers(transformedUsers);
    }
  };

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

  const handleAddUser = async () => {
    if (!selectedUser) return;

    const { error } = await supabase
      .from('users')
      .insert({
        ...selectedUser,
        location_id: selectedUser.location_id
      });

    if (error) {
      console.error('Error adding user:', error);
    } else {
      fetchUsers();
      setIsModalOpen(false);
      setSelectedUser(null);
    }
  };

  const handleUpdateUser = async () => {
    if (!selectedUser || !selectedUser.id) return;

    const { error } = await supabase
      .from('users')
      .update({
        ...selectedUser,
        location_id: selectedUser.location_id
      })
      .eq('id', selectedUser.id);

    if (error) {
      console.error('Error updating user:', error);
    } else {
      fetchUsers();
      setIsModalOpen(false);
      setSelectedUser(null);
    }
  };

  const handleDeleteUser = async (id: number) => {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting user:', error);
    } else {
      fetchUsers();
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (roleFilter ? user.role === roleFilter : true)
  );

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setSelectedUser({
      name: '',
      email: '',
      role: '',
      department: '',
      status: 'Active',
      location_id: undefined
    });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 p-6 bg-white dark:bg-dark-900 min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Users</h1>
        <button 
          onClick={openAddModal}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </div>
          <input
            type="text"
            id="search"
            placeholder="Search users..."
            className="app-input pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="block pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-dark-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white dark:bg-dark-800 text-gray-900 dark:text-gray-100"
        >
          <option value="">All Roles</option>
          <option value="Admin">Admin</option>
          <option value="Manager">Manager</option>
          <option value="User">User</option>
        </select>
      </div>

      <div className="bg-white dark:bg-dark-800 shadow-sm ring-1 ring-gray-900/5 dark:ring-dark-600/50 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-300 dark:divide-dark-600">
          <thead className="bg-gray-50 dark:bg-dark-700">
            <tr>
              <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Name</th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Email</th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Role</th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Department</th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Status</th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Location</th>
              <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-dark-600">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-dark-700">
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-gray-100">{user.name}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">{user.email}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">{user.role}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">{user.department}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">
                  <span className={`
                    px-2 py-1 rounded-full text-xs font-medium 
                    ${user.status === 'Active' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                    }
                  `}>
                    {user.status}
                  </span>
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">{user.location_name || 'N/A'}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => openEditModal(user)}
                      className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={() => handleDeleteUser(user.id!)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
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

      {isModalOpen && (
        <Modal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)}
          title={selectedUser?.id ? 'Edit User' : 'Add User'}
          onSubmit={selectedUser?.id ? handleUpdateUser : handleAddUser}
        >
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
              <input
                type="text"
                id="name"
                className="app-input"
                value={selectedUser?.name || ''}
                onChange={(e) => setSelectedUser(prev => prev ? {...prev, name: e.target.value} : null)}
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
              <input
                type="email"
                id="email"
                className="app-input"
                value={selectedUser?.email || ''}
                onChange={(e) => setSelectedUser(prev => prev ? {...prev, email: e.target.value} : null)}
              />
            </div>
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
              <select
                id="role"
                value={selectedUser?.role || ''}
                onChange={(e) => setSelectedUser(prev => prev ? {...prev, role: e.target.value} : null)}
                className="app-select"
              >
                <option value="">Select Role</option>
                <option value="Admin">Admin</option>
                <option value="User">User</option>
              </select>
            </div>
            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Department</label>
              <input
                type="text"
                id="department"
                className="app-input"
                value={selectedUser?.department || ''}
                onChange={(e) => setSelectedUser(prev => prev ? {...prev, department: e.target.value} : null)}
              />
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
              <select
                id="status"
                value={selectedUser?.status || 'Active'}
                onChange={(e) => setSelectedUser(prev => prev ? {...prev, status: e.target.value as 'Active' | 'Inactive'} : null)}
                className="app-select"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
              <select
                id="location"
                value={selectedUser?.location_id || ''}
                onChange={(e) => setSelectedUser(prev => prev ? {...prev, location_id: Number(e.target.value)} : null)}
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
      )}
    </div>
  );
}
