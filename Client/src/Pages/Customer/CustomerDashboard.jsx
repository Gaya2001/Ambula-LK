import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaHome,
  FaHistory,
  FaBell,
  FaSignOutAlt,
  FaMapMarkerAlt,
  FaCreditCard,
  FaSearch,
  FaUtensils
} from "react-icons/fa";
import logo1 from "../../assets/Customer/c1.png";

import CustomerProfile from "../../components/CustomerManagement/profile/CustomerProfile";
import OrderHistory from "../../components/CustomerManagement/profile/OrderHistory";
import PaymentMethods from "../../components/CustomerManagement/profile/PaymentMethods";
import AddressBook from "../../components/CustomerManagement/profile/AddressBook";
import Notifications from "../../components/CustomerManagement/profile/Notifications";

import Logo from "../../assets/logo-color.png";
import { useNavigate } from "react-router-dom";

function CustomerDashboard() {
  const [activeTab, setActiveTab] = useState("welcome");
  const [cart, setCart] = useState([]); // Example cart state
  const [cartItems, setCartItems] = useState(3); // Example cart count
  const [customerData, setCustomerData] = useState(null);
  const [notifications, setNotifications] = useState(2); // Example notification count
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    // Fetch customer data
    fetchCustomerData(token);
  }, [navigate]);

  const fetchCustomerData = async (token) => {
    try {
      // Replace with your actual API endpoint
      const response = await fetch("https://api.ambula.lk/customer/profile", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch profile data");
      }

      const data = await response.json();
      setCustomerData(data);

      // Simulate fetching cart data
      const cartResponse = await fetch("https://api.ambula.lk/customer/cart", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (cartResponse.ok) {
        const cartData = await cartResponse.json();
        setCartItems(cartData.items.length);

        // Update localStorage with the fresh cart data
        localStorage.setItem("cart", JSON.stringify(cartData.items));
      } else {
        // If cart fetch fails, clear any existing cart data
        setCartItems(0);
        localStorage.removeItem("cart");
      }
    } catch (error) {
      console.error("Error fetching customer data:", error);
      // Clear cart data if there's an error
      setCartItems(0);
      localStorage.removeItem("cart");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("cart");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    localStorage.removeItem("rememberedEmail");
    setCart([]);
    setCartItems(0); // Reset the cart count to zero
    navigate("/login");
  };
  const handleSearch = (e) => {
    e.preventDefault();
    // Navigate to search results or filter current view
    if (searchQuery.trim()) {
      // You could navigate to a dedicated search page
      // navigate(`/search?q=${encodeURIComponent(searchQuery)}`);

      // Or set state to show filtered results in the current view
      setActiveTab("restaurants");
      // Implement search functionality in the restaurants component
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-screen h-screen bg-gray-100">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-t-4 border-orange-500 rounded-full animate-spin"></div>
          <p className="mt-4 text-lg font-medium text-gray-700">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-b from-blue-900 to-black">
      {/* Sidebar */}
      <div className="w-20 md:w-64 bg-[#0C1A39] text-white flex flex-col">
        <div className="flex items-center justify-center p-4 md:justify-start">
          <img src={Logo} alt="Ambula" className="w-12 h-12" />
          <span className="hidden ml-3 text-xl font-bold md:block">
            AMBULA.LK
          </span>
        </div>

        <div className="flex-1 overflow-y-auto">
          <nav className="px-2 mt-8">
            <SidebarItem
              icon={<FaHome />}
              title="Welcome"
              active={activeTab === "welcome"}
              onClick={() => setActiveTab("welcome")}
            />
            <SidebarItem
              icon={<FaUser />}
              title="My Profile"
              active={activeTab === "profile"}
              onClick={() => setActiveTab("profile")}
            />
            <SidebarItem
              icon={<FaHistory />}
              title="Order History"
              active={activeTab === "history"}
              onClick={() => setActiveTab("history")}
            />
            <SidebarItem
              icon={<FaCreditCard />}
              title="Payment Methods"
              active={activeTab === "payment"}
              onClick={() => setActiveTab("payment")}
            />
            <SidebarItem
              icon={<FaMapMarkerAlt />}
              title="Address Book"
              active={activeTab === "addresses"}
              onClick={() => setActiveTab("addresses")}
            />
            <SidebarItem
              icon={<FaBell />}
              title="Notifications"
              active={activeTab === "notifications"}
              onClick={() => setActiveTab("notifications")}
              badge={notifications}
            />
          </nav>
        </div>

        <div className="p-4">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center w-full py-2 text-sm text-white transition-colors rounded md:justify-start hover:bg-gray-700"
          >
            <FaSignOutAlt className="w-5 h-5" />
            <span className="hidden ml-3 md:block">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        
          {/* Header */}
                <div className="px-6 py-4 bg-[#704214] text-white flex justify-between items-center">
                  <h1 className="text-xl font-bold">My Profile</h1>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 overflow-hidden rounded-full">
                        <img 
                          src={customerData?.profile_image || logo1} 
                          alt="Profile" 
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {customerData?.first_name || ""} {customerData?.last_name || ""}
                        </p>
                        <p className="text-xs text-green-400">Online</p>
                      </div>
                    </div>
                  </div>
                </div>
       

        {/* Content Area */}
        <main className="flex-1 p-4 overflow-y-auto">
        {activeTab === "welcome" && (
  <div className="min-h-screen text-white bg-gradient-to-b from-blue-900 to-black">
    <div className="container px-4 py-8 mx-auto">
      <div className="max-w-4xl mx-auto">
        {/* Header with background card - similar to profile */}
        <div className="relative overflow-hidden rounded-t-2xl bg-gradient-to-r from-indigo-900 to-blue-900">
          {/* Decorative background elements */}
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute w-40 h-40 rounded-full top-10 left-20 bg-amber-500 opacity-10 blur-xl"></div>
            <div className="absolute bg-blue-500 rounded-full bottom-10 right-20 w-60 h-60 opacity-10 blur-xl"></div>
          </div>
          
          {/* Welcome header content */}
          <div className="relative z-10 flex flex-col items-center p-8">
            <h2 className="text-3xl font-bold text-white">
              Welcome back, {customerData ? `${customerData.first_name}` : "Valued Customer"}!
            </h2>
            <p className="mt-2 text-amber-400">Ready to order some delicious food?</p>
          </div>
        </div>
        
        {/* Main content area */}
        <div className="shadow-2xl bg-blue-950 bg-opacity-80 backdrop-blur-sm rounded-b-2xl">

{/* Quick Actions */}
<div className="p-6 pt-0">
            <div className="flex items-center gap-2 text-xl font-semibold text-amber-400">
              <FaHome size={20} />
              <h3>Quick Actions</h3>
            </div>
            
            <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-3">
              <div className="p-4 transition-all bg-blue-900 border border-blue-800 rounded-lg bg-opacity-40 hover:bg-opacity-50">
                <div className="flex items-center space-x-3">
                  <div className="p-2 text-white bg-blue-500 rounded-full">
                    <FaHistory className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-white">Order Again</h3>
                </div>
                <p className="mt-2 text-sm text-blue-300">Quickly reorder from your past orders.</p>
                <button
                  className="w-full px-4 py-2 mt-4 text-white transition-all bg-blue-500 rounded-lg hover:bg-blue-600"
                  onClick={() => setActiveTab("history")}
                >
                  View History
                </button>
              </div>

              <div className="p-4 transition-all bg-blue-900 border border-blue-800 rounded-lg bg-opacity-40 hover:bg-opacity-50">
                <div className="flex items-center space-x-3">
                  <div className="p-2 text-white bg-purple-500 rounded-full">
                    <FaMapMarkerAlt className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-white">Manage Addresses</h3>
                </div>
                <p className="mt-2 text-sm text-blue-300">Update or add delivery locations.</p>
                <button
                  className="w-full px-4 py-2 mt-4 text-white transition-all bg-purple-500 rounded-lg hover:bg-purple-600"
                  onClick={() => setActiveTab("addresses")}
                >
                  My Addresses
                </button>
              </div>

              <div className="p-4 transition-all bg-blue-900 border border-blue-800 rounded-lg bg-opacity-40 hover:bg-opacity-50">
                <div className="flex items-center space-x-3">
                  <div className="p-2 text-white bg-teal-500 rounded-full">
                    <FaCreditCard className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-white">Payment Methods</h3>
                </div>
                <p className="mt-2 text-sm text-blue-300">Manage your payment options.</p>
                <button
                  className="w-full px-4 py-2 mt-4 text-white transition-all bg-teal-500 rounded-lg hover:bg-teal-600"
                  onClick={() => setActiveTab("payment")}
                >
                  View Methods
                </button>
              </div>
            </div>
          </div>

          {/* Current/Active Order Status */}
          <div className="p-6">
            <div className="flex items-center gap-2 text-xl font-semibold text-amber-400">
              <FaUtensils size={20} />
              <h3>Your Active Order</h3>
            </div>
            
            <div className="p-4 mt-4 bg-blue-900 border border-blue-800 rounded-lg bg-opacity-40">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-12 h-12 text-white rounded-full bg-amber-600">
                    <FaUtensils className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-medium text-white">Order #AMB23956</p>
                    <p className="text-sm text-blue-300">Being prepared at Royal Thai Restaurant</p>
                  </div>
                </div>
                <button
                  className="px-3 py-1 mt-3 text-sm border rounded-full text-amber-600 border-amber-600 hover:bg-amber-600 hover:text-white md:mt-0"
                  onClick={() => setActiveTab("history")}
                >
                  View Details
                </button>
              </div>
              <div className="mt-4">
                <div className="w-full h-2 bg-blue-800 rounded-full">
                  <div className="h-2 rounded-full bg-amber-500" style={{ width: '40%' }}></div>
                </div>
                <p className="mt-2 text-sm text-blue-300">Estimated delivery: 6:45 PM</p>
              </div>
            </div>
          </div>

          
          
        </div>
      </div>
    </div>
  </div>
)}

          {activeTab === "profile" && <CustomerProfile setCustomerData={setCustomerData} customerData={customerData} />}
          {activeTab === "history" && <OrderHistory />}
          {activeTab === "payment" && <PaymentMethods />}
          {activeTab === "addresses" && <AddressBook />}
          {activeTab === "notifications" && <Notifications />}
        </main>
      </div>
    </div>
  );
}

function SidebarItem({ icon, title, active, onClick, badge }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center md:justify-start w-full py-3 px-2 mb-2 rounded-lg transition-colors relative ${active ? "bg-[#FF8A00] text-white" : "text-gray-300 hover:bg-gray-700"
        }`}
    >
      <div className="w-5 h-5">{icon}</div>
      <span className="hidden ml-3 md:block">{title}</span>
      {badge && (
        <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-xs text-white bg-red-500 rounded-full md:relative md:top-auto md:right-auto md:ml-2">
          {badge}
        </span>
      )}
    </button>
  );
}

export default CustomerDashboard;