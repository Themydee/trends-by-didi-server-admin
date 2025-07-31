import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { FaUsers, FaBox, FaShoppingCart, FaTruck, FaMoneyBillWave } from "react-icons/fa";

const Analytics = ({ token }) => {
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    orders: 0,
    pending: 0,
    delivered: 0,
    revenue: 0,
    monthlyRevenue: [],
    dailyRevenue: [],
  });

  const fetchStats = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/analytics`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch analytics", error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const cardStyle =
    "bg-white rounded-2xl p-6 shadow flex items-center gap-4 w-full sm:w-[48%] lg:w-[32%]";
  const iconStyle = "text-2xl text-secondary bg-primary p-2 rounded-full";

  return (
    <div className="max-w-[1400px] mx-auto w-full px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-black">Analytics Overview</h2>

      {/* Cards */}
      <div className="flex flex-wrap gap-4 mb-10">
        <div className={cardStyle}>
          <FaUsers className={iconStyle} />
          <div>
            <p className="text-gray-600">Users</p>
            <p className="text-xl font-semibold">{stats.users}</p>
          </div>
        </div>
        <div className={cardStyle}>
          <FaBox className={iconStyle} />
          <div>
            <p className="text-gray-600">Goods</p>
            <p className="text-xl font-semibold">{stats.products}</p>
          </div>
        </div>
        <div className={cardStyle}>
          <FaShoppingCart className={iconStyle} />
          <div>
            <p className="text-gray-600">Total Orders</p>
            <p className="text-xl font-semibold">{stats.orders}</p>
          </div>
        </div>
        <div className={cardStyle}>
          <FaTruck className={iconStyle} />
          <div>
            <p className="text-gray-600">Pending Orders</p>
            <p className="text-xl font-semibold">{stats.pending}</p>
          </div>
        </div>
        <div className={cardStyle}>
          <FaTruck className={iconStyle} />
          <div>
            <p className="text-gray-600">Delivered</p>
            <p className="text-xl font-semibold">{stats.delivered}</p>
          </div>
        </div>
        <div className={cardStyle}>
          <FaMoneyBillWave className={iconStyle} />
          <div>
            <p className="text-gray-600">Revenue</p>
            <p className="text-xl font-semibold">₦{stats.revenue}</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="text-lg font-semibold text-black mb-4">Monthly Revenue</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#00BFA6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="text-lg font-semibold text-black mb-4">Daily Revenue</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.dailyRevenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#FFA500" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
