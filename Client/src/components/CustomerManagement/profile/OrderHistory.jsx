import React, { useEffect, useState } from "react";
import { FaHistory, FaReceipt } from "react-icons/fa";
import orderService from "../../../services/order-service";
import { jwtDecode } from "jwt-decode";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const getCustomerIdFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
      const decoded = jwtDecode(token);
      return decoded.id || decoded._id; // adjust based on your token structure
    } catch (err) {
      console.error("Failed to decode token", err);
      return null;
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const customerId = getCustomerIdFromToken();
      console.log("Customer ID from token:", customerId);
      if (!customerId) {
        setError("No customer ID found. Please place an order first.");
        setLoading(false);
        return;
      }

      try {
        const res = await orderService.getCustomerOrders(customerId);
        setOrders(res.data.orders);
      } catch (err) {
        console.error("Error fetching orders", err);
        setError("Failed to fetch orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Function to format date to a more readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Function to determine status badge style
  const getStatusBadgeClass = (status) => {
    switch(status.toLowerCase()) {
      case 'delivered':
        return 'inline-flex px-2 py-1 text-xs font-semibold leading-5 text-green-300 bg-green-900 bg-opacity-70 rounded-full';
      case 'in progress':
      case 'processing':
        return 'inline-flex px-2 py-1 text-xs font-semibold leading-5 text-amber-300 bg-amber-900 bg-opacity-70 rounded-full';
      case 'cancelled':
        return 'inline-flex px-2 py-1 text-xs font-semibold leading-5 text-red-300 bg-red-900 bg-opacity-70 rounded-full';
      default:
        return 'inline-flex px-2 py-1 text-xs font-semibold leading-5 text-blue-300 bg-blue-900 bg-opacity-70 rounded-full';
    }
  };

  return (
    <div className="min-h-screen text-white bg-gradient-to-b from-blue-900 to-black">
      <div className="container px-4 py-8 mx-auto">
        <div className="max-w-6xl mx-auto">
          {/* Header with background card */}
          <div className="relative overflow-hidden rounded-t-2xl bg-gradient-to-r from-indigo-900 to-blue-900">
            {/* Decorative background elements */}
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="absolute w-40 h-40 rounded-full top-10 left-20 bg-amber-500 opacity-10 blur-xl"></div>
              <div className="absolute bg-blue-500 rounded-full bottom-10 right-20 w-60 h-60 opacity-10 blur-xl"></div>
            </div>
            
            {/* Header content */}
            <div className="relative z-10 flex flex-col items-center p-8">
              <h2 className="text-3xl font-bold text-white">Order History</h2>
              <p className="mt-2 text-amber-400">View and track your recent orders</p>
            </div>
          </div>
          
          {/* Main content area */}
          <div className="p-6 shadow-2xl bg-blue-950 bg-opacity-80 backdrop-blur-sm rounded-b-2xl">
            
            {loading && (
              <div className="py-10 text-center">
                <p className="text-blue-300">Loading your orders...</p>
              </div>
            )}
            
            {error && (
              <div className="p-4 bg-red-900 border border-red-800 rounded-lg bg-opacity-30">
                <p className="text-red-300">{error}</p>
              </div>
            )}

            {!loading && !error && orders.length === 0 && (
              <div className="py-10 text-center border border-blue-700 border-dashed rounded-lg">
                <p className="text-blue-300">No orders found. Place your first order!</p>
              </div>
            )}

            {!loading && !error && orders.length > 0 && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-blue-800">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase text-amber-400">Order ID</th>
                      <th className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase text-amber-400">Restaurant</th>
                      <th className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase text-amber-400">Date</th>
                      <th className="px-6 py-3 text-xs font-medium tracking-wider text-right uppercase text-amber-400">Status</th>
                      <th className="px-6 py-3 text-xs font-medium tracking-wider text-right uppercase text-amber-400">Total</th>
                      <th className="px-6 py-3 text-xs font-medium tracking-wider text-right uppercase text-amber-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-blue-800">
                    {orders.map((order) => (
                      <tr key={order._id} className="transition-colors hover:bg-blue-900 hover:bg-opacity-40">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-white">AMB{order._id.substring(0, 8).toUpperCase()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-white">{order.restaurant?.name || "Restaurant"}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-blue-300">{formatDate(order.createdAt || new Date())}</div>
                        </td>
                        <td className="px-6 py-4 text-right whitespace-nowrap">
                          <span className={getStatusBadgeClass(order.status)}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-right text-amber-400 whitespace-nowrap">
                          LKR{order.totalAmount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-right whitespace-nowrap">
                          <button className="p-2 text-blue-300 transition-colors hover:text-amber-400">
                            <FaReceipt size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;