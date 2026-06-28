import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/auth/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) {
    return <div className="text-premium-silver">Loading users...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold text-premium-white mb-6">Users List</h2>
      <div className="bg-premium-dark rounded-xl border border-premium-gray overflow-hidden">
        <table className="w-full">
          <thead className="bg-premium-gray">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-premium-silver uppercase tracking-wider">Username</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-premium-silver uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-premium-silver uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-premium-silver uppercase tracking-wider">Phone</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-premium-gray">
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-premium-gray/50 transition-colors">
                <td className="px-6 py-4 text-premium-white">{user.username}</td>
                <td className="px-6 py-4 text-premium-silver">{user.email}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    user.role === 'admin' 
                      ? 'bg-premium-gold/20 text-premium-gold' 
                      : 'bg-premium-gray text-premium-silver'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-premium-silver">{user.phone || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersList;