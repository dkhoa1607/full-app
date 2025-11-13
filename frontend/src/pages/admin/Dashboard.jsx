import { useEffect, useState } from "react";
import { DollarSign, ShoppingBag, Users, Package } from "lucide-react";

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white ${color}`}>
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <p className="text-gray-500 text-sm font-medium">{title}</p>
      <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
    </div>
  </div>
);

function Dashboard() {
  const [stats, setStats] = useState({ revenue: 0, orders: 0, products: 0, users: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/stats');
        if(res.ok) setStats(await res.json());
      } catch (error) { console.error(error); }
    };
    fetchStats();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8 text-gray-800">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Revenue" value={`$${stats.revenue.toLocaleString()}`} icon={DollarSign} color="bg-green-500" />
        <StatCard title="Total Orders" value={stats.orders} icon={ShoppingBag} color="bg-blue-500" />
        <StatCard title="Total Products" value={stats.products} icon={Package} color="bg-orange-500" />
        <StatCard title="Total Users" value={stats.users} icon={Users} color="bg-purple-500" />
      </div>
    </div>
  );
}

export default Dashboard;