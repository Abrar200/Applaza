import React, { useState, useMemo, useCallback } from 'react';
import { Search, UserPlus, Download, Edit2, Ban, CheckCircle, Key } from 'lucide-react';
import UserEditModal from './UserEditModal';
import AddUserModal from './AddUserModal';
import { useDebounce } from '@/hooks/useDebounce';


const initialUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'customer', orders: 12, spent: '$1,234', joined: '2024-01-15', status: 'active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'customer', orders: 8, spent: '$890', joined: '2024-02-20', status: 'active' },
  { id: 3, name: 'Bob Wilson', email: 'bob@example.com', role: 'creator', orders: 0, spent: '$0', joined: '2024-03-10', status: 'active' },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'customer', orders: 24, spent: '$3,456', joined: '2024-01-05', status: 'active' },
  { id: 5, name: 'Charlie Davis', email: 'charlie@example.com', role: 'brand', orders: 0, spent: '$0', joined: '2024-04-12', status: 'suspended' },
];


export default function UsersView() {
  const [users, setUsers] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [editingUser, setEditingUser] = useState<typeof initialUsers[0] | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Debounce search term for better performance
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Memoize filtered users to prevent unnecessary recalculations
  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matchesSearch = u.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) || 
                           u.email.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
      const matchesRole = roleFilter === 'all' || u.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, debouncedSearchTerm, roleFilter]);


  const handleSuspendToggle = (userId: number) => {
    setUsers(users.map(u => u.id === userId ? {...u, status: u.status === 'active' ? 'suspended' : 'active'} : u));
  };

  const handleSaveUser = (updatedUser: typeof initialUsers[0]) => {
    setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
  };

  const handleAddUser = (newUser: typeof initialUsers[0]) => {
    setUsers([...users, newUser]);
  };

  const handleExport = () => {
    const csvContent = [
      ['Name', 'Email', 'Role', 'Orders', 'Total Spent', 'Joined', 'Status'].join(','),
      ...users.map(u => [u.name, u.email, u.role, u.orders, u.spent, u.joined, u.status].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleSendPasswordReset = async (user: typeof initialUsers[0]) => {
    try {
      // In production, this would call the Supabase edge function
      // const { data, error } = await supabase.functions.invoke('send-password-reset', {
      //   body: { email: user.email, userName: user.name }
      // });
      
      // Simulate sending email
      alert(`Password reset link sent to ${user.email}\n\nThe user will receive an email with instructions to reset their password.`);
      
      // Show success feedback
      console.log(`Password reset email sent to ${user.name} (${user.email})`);
    } catch (error) {
      console.error('Error sending password reset:', error);
      alert('Failed to send password reset email. Please try again.');
    }
  };




  return (
    <>
    <div className="space-y-4 sm:space-y-6">

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">Users</h1>
          <p className="text-sm sm:text-base text-gray-400">Manage customers, creators, and brand accounts</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold flex items-center gap-2 text-sm sm:text-base"
          >
            <UserPlus className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Add User</span>
            <span className="sm:hidden">Add</span>
          </button>
          <button 
            onClick={handleExport}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold flex items-center gap-2 text-sm sm:text-base"
          >
            <Download className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>

      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-900 border border-gray-800 rounded-lg pl-10 sm:pl-12 pr-4 py-2 sm:py-3 text-sm sm:text-base text-white focus:border-cyan-500 focus:outline-none"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 sm:py-3 text-sm sm:text-base text-white focus:border-cyan-500 focus:outline-none"
        >
          <option value="all">All Roles</option>
          <option value="customer">Customers</option>
          <option value="creator">Creators</option>
          <option value="brand">Brands</option>
        </select>
      </div>


      {/* Mobile Card View */}
      <div className="block lg:hidden space-y-4">
        {filteredUsers.map(user => (
          <div key={user.id} className="bg-gray-900 rounded-xl border border-gray-800 p-4">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="text-white font-semibold text-lg mb-1">{user.name}</h3>
                <p className="text-gray-400 text-sm mb-2">{user.email}</p>
                <div className="flex gap-2 flex-wrap">
                  <span className="px-2 py-1 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-400 capitalize">
                    {user.role}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    user.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {user.status}
                  </span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-3 text-center">
              <div>
                <p className="text-gray-400 text-xs mb-1">Orders</p>
                <p className="text-white font-semibold">{user.orders}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-1">Spent</p>
                <p className="text-white font-semibold">{user.spent}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-1">Joined</p>
                <p className="text-white text-sm">{user.joined}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setEditingUser(user)}
                className="flex-1 p-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg transition-colors text-sm font-medium"
              >
                Edit
              </button>
              <button
                onClick={() => handleSendPasswordReset(user)}
                className="p-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-lg transition-colors"
                title="Send Password Reset"
              >
                <Key className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleSuspendToggle(user.id)}
                className={`p-2 rounded-lg transition-colors ${
                  user.status === 'active' 
                    ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400' 
                    : 'bg-green-500/20 hover:bg-green-500/30 text-green-400'
                }`}
                title={user.status === 'active' ? 'Suspend' : 'Activate'}
              >
                {user.status === 'active' ? <Ban className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800/50">
              <tr>
                <th className="text-left p-4 text-gray-400 font-semibold text-sm">Name</th>
                <th className="text-left p-4 text-gray-400 font-semibold text-sm">Email</th>
                <th className="text-left p-4 text-gray-400 font-semibold text-sm">Role</th>
                <th className="text-left p-4 text-gray-400 font-semibold text-sm">Orders</th>
                <th className="text-left p-4 text-gray-400 font-semibold text-sm">Total Spent</th>
                <th className="text-left p-4 text-gray-400 font-semibold text-sm">Joined</th>
                <th className="text-left p-4 text-gray-400 font-semibold text-sm">Status</th>
                <th className="text-left p-4 text-gray-400 font-semibold text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id} className="border-t border-gray-800 hover:bg-gray-800/30">
                  <td className="p-4 text-white font-semibold">{user.name}</td>
                  <td className="p-4 text-gray-300">{user.email}</td>
                  <td className="p-4">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-400 capitalize">
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4 text-white">{user.orders}</td>
                  <td className="p-4 text-white font-semibold">{user.spent}</td>
                  <td className="p-4 text-gray-400">{user.joined}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      user.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingUser(user)}
                        className="p-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg transition-colors"
                        title="Edit User"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleSendPasswordReset(user)}
                        className="p-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-lg transition-colors"
                        title="Send Password Reset Link"
                      >
                        <Key className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleSuspendToggle(user.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          user.status === 'active' 
                            ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400' 
                            : 'bg-green-500/20 hover:bg-green-500/30 text-green-400'
                        }`}
                        title={user.status === 'active' ? 'Suspend User' : 'Activate User'}
                      >
                        {user.status === 'active' ? <Ban className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
    {editingUser && (
      <UserEditModal user={editingUser} onClose={() => setEditingUser(null)} onSave={handleSaveUser} />
    )}
    {showAddModal && (
      <AddUserModal onClose={() => setShowAddModal(false)} onAdd={handleAddUser} />
    )}
    </>

  );
}

