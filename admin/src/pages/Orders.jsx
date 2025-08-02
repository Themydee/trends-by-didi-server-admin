import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/orders`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
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
      fetchOrders();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <div className="p-4">Loading orders...</div>;

  return (
    <div className="px-4 py-6 max-w-[1400px] mx-auto w-full">
      <h2 className="text-2xl font-bold mb-6">All Orders</h2>

      {orders.map((order) => (
        <div
          key={order._id}
          className="border rounded-lg p-4 mb-6 shadow-sm bg-white w-full"
        >
          {/* Top section */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
            <div>
              <p className="text-sm text-gray-700">
                <strong>User:</strong> {order.user?.email || "N/A"}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Amount:</strong> ₦{order.totalAmount}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Placed:</strong>{" "}
                {new Date(order.createdAt).toLocaleString()}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Status:</strong>
                <span
                  className={`ml-2 px-2 py-1 rounded-full text-white text-xs ${
                    order.status === "pending"
                      ? "bg-yellow-500"
                      : order.status === "paid"
                      ? "bg-blue-500"
                      : order.status === "shipped"
                      ? "bg-purple-500"
                      : "bg-green-600"
                  }`}
                >
                  {order.status}
                </span>
              </p>
            </div>

            <div className="mt-3 sm:mt-0">
              <label className="text-sm">Update Status:</label>
              <select
                className="border mt-1 rounded px-2 py-1 w-full sm:w-auto"
                value={order.status}
                onChange={(e) => {
                  const confirmed = window.confirm(
                    `Change status to ${e.target.value}?`
                  );
                  if (confirmed) updateStatus(order._id, e.target.value);
                }}
              >
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="text-sm text-gray-700 space-y-1 mb-4">
            <p>
              <strong>Name:</strong> {order.user?.firstName}{" "}
              {order.user?.lastName}
            </p>
            <p>
              <strong>Phone:</strong> {order.user?.phone}
            </p>
            <p>
              <strong>Email:</strong> {order.user?.email}
            </p>
            <p>
              <strong>Address:</strong> {order.user?.address},{" "}
              {order.user?.city}, {order.user?.state}, {order.user?.country}
            </p>
          </div>

          {/* Items */}
          <div className="mb-4">
            <h4 className="font-semibold text-gray-800 mb-2">Items Ordered</h4>
            <ul className="space-y-3">
              {order.items?.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 border p-2 rounded-md"
                >
                  {item.image?.[0] && (
                    <img
                      src={item.image[0]}
                      alt={item.title}
                      className="w-12 h-12 object-cover rounded-md"
                    />
                  )}
                  <div className="text-sm text-gray-700">
                    <p className="font-medium">{item.title}</p>
                    <p>
                      {item.quantity} × ₦{item.price}
                      {item.size && <span> (Size: {item.size})</span>}
                      {item.color && item.color.length > 0 && (
  <div className="flex items-center gap-2 mt-1">
    <span>Colors:</span>
    {item.color.map((color, idx) => (
      <div
        key={idx}
        className="w-4 h-4 rounded-full border"
        style={{ backgroundColor: color }}
        title={color}
      ></div>
    ))}
  </div>
)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Payment Proof */}
          <div className="text-sm text-gray-800">
            <strong>Payment Proof:</strong>{" "}
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
              "Not provided"
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Orders;
