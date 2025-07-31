import React, { useState, useEffect } from "react";
import axios from "axios";
import { server_url, currency } from "../App";
import { TbTrash } from "react-icons/tb";
import { toast } from "react-toastify";

const List = ({ token }) => {
  const [list, setList] = useState([]);

  const fetchList = async () => {
    try {
      const response = await axios.get(server_url + "/api/product/list");
      if (response.data.success) {
        setList(response.data.product);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const removeProduct = async (id) => {
    try {
      const response = await axios.post(
        server_url + "/api/product/delete",
        { id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };
  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="w-full min-h-screen px-4 sm:px-8 py-6 ">
      <div className="max-w-7xl mx-auto flex flex-col gap-4">
        {/* Header (visible only on medium+ screens) */}
        <div className="hidden md:grid grid-cols-5 items-center bg-gray-200 text-gray-800 font-semibold py-3 px-4 rounded">
          <h5>Image</h5>
          <h5>Name</h5>
          <h5>Category</h5>
          <h5>Price</h5>
          <h5>Remove</h5>
        </div>

        {/* List of Products */}
        {list.map((item) => (
          <div
            key={item._id}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 items-center gap-4 bg-white p-4 rounded-lg shadow hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-center md:justify-start">
              <img
                src={item.image[0]}
                alt={item.name}
                className="w-16 h-16 object-cover rounded-lg"
              />
            </div>

            <h5 className="text-sm font-semibold text-center md:text-left">
              {item.name}
            </h5>
            <p className="text-sm text-gray-600 text-center md:text-left">
              {item.category}
            </p>
            <div className="text-sm font-bold text-green-600 text-center md:text-left">
              {currency}
              {item.price}
            </div>
            <div className="col-span-full md:col-span-5 text-sm text-gray-600 flex flex-wrap gap-2 mt-1">
              {item.sizes && item.sizes.length > 0 ? (
                item.sizes.map((sz, idx) => (
                  <span
                    key={idx}
                    className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-800"
                  >
                    {sz.size}: {sz.quantity}
                  </span>
                ))
              ) : (
                <span className="text-xs text-gray-400">
                  No sizes available
                </span>
              )}
            </div>

            <div className="flex items-center justify-center md:justify-end">
              <button
                onClick={() => removeProduct(item._id)}
                className="text-red-500 hover:text-red-700 text-xl transition"
              >
                <TbTrash />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default List;
