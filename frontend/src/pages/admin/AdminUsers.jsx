import { useEffect, useState } from "react";
import { User, Shield, Trash2 } from "lucide-react";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Hàm fetch user
  const fetchUsers = async () => {
    setLoading(true);
    try {
      // API này sẽ được tạo ở backend (Bước 4)
      const res = await fetch('https://full-app-da2f.vercel.app/api/users', {
          
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      } else {
         alert("Bạn không có quyền Admin hoặc Lỗi Server");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Hàm xóa (Tạm thời vô hiệu hóa)
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa User này? (Không thể hoàn tác)"))
    try {
      const res = await fetch(`https://full-app-da2f.vercel.app/api/users/${id}`, {
        method: 'DELETE',
          
      });

      if (res.ok) {
        alert("Xóa user thành công!");
        fetchUsers(); // Tải lại danh sách
      } else {
        const data = await res.json();
        alert(data.message || "Xóa thất bại");
      }
    } catch (error) {
      alert("Lỗi server");
    }
  };

  if (loading) return <div className="p-10 text-center">Loading users...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-8">Manage Users ({users.length})</h1>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">User ID</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="bg-white border-b hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs">
                    ...{user._id.slice(-6).toUpperCase()}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {user.firstName} {user.lastName}
                  </td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">
                    {user.isAdmin ? (
                      <span className="flex items-center gap-1.5 text-xs font-medium text-red-600">
                        <Shield className="w-3 h-3" /> Admin
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-xs text-gray-500">
                        <User className="w-3 h-3" /> Customer
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => handleDelete(user._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminUsers;