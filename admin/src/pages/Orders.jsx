import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(data.orders);
    } catch (error) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_SERVER_URL}/api/orders/${orderId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Order status updated");
      fetchOrders(); // refresh after update
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <div className="p-4">Loading orders...</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">All Orders</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">User</th>
              <th className="p-2 border">Amount</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Payment Proof</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td className="p-2 border">{order.user?.email || "N/A"}</td>
                <td className="p-2 border">₦{order.totalAmount}</td>
                <td className="p-2 border capitalize">{order.status}</td>
                <td className="p-2 border">
                  {order.paymentProof ? (
                    <a
                      href={order.paymentProof}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      View
                    </a>
                  ) : (
                    "No file"
                  )}
                </td>
                <td className="p-2 border">
                  <select
                    className="border rounded px-2 py-1"
                    value={order.status}
                    onChange={(e) => updateStatus(order._id, e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
