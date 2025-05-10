import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart, FaBars, FaUserCircle } from "react-icons/fa";
import logo from "/src/assets/logo-color.png";
import Sidebar from "./Sidebar";
import { UserContext } from "../context/UserContext";

function Header() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useContext(UserContext);
  
  // Get user data from context and localStorage
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const isCustomer = role === "Customer";
  const isLoggedIn = Boolean(token && user?.loggedIn);
  
  // Determine profile link based on user role
  let profileLink = "";
  if (role === "Admin") {
    profileLink = "/admin-dashboard";
  } else if (role === "Restaurant Owner") {
    profileLink = "/owner/profile";
  } else if (role === "Customer") {
    profileLink = "/customer-dashboard";
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      <nav className="relative shadow-md w-full top-0 left-0 z-40">
        <div className="container mx-auto px-4 md:px-10 flex items-center justify-between h-28">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src={logo} alt="FoodDelivery Logo" className="h-20 mr-2" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6 text-xl font-bold">
            <Link
              to="/"
              className="text-white px-4 py-2 rounded hover:bg-[#FC8A06]"
            >
              Home
            </Link>

            <Link
              to="/restaurants"
              className="text-white px-4 py-2 rounded hover:bg-[#FC8A06]"
            >
              Restaurants
            </Link>
            
            {isCustomer && (
              <Link
                to="/orders"
                className="text-white px-4 py-2 rounded hover:bg-[#FC8A06]"
              >
                Track Order
              </Link>
            )}

            <Link
              to="/deliveryPersonnel/HomePage"
              className="text-white px-4 py-2 rounded hover:bg-[#FC8A06]"
            >
              Drive
            </Link>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-6">
            {/* If logged in: Show profile, else show login */}
            {isLoggedIn ? (
              <Link
                to={profileLink}
                className="flex flex-col items-center text-[#FC8A06] hover:text-[#E67E22]"
              >
                <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-gray-100 mb-1">
                  {user.profile_image ? (
                    <img
                      src={user.profile_image}
                      alt="User Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FaUserCircle className="text-orange-500 w-6 h-6" />
                  )}
                </div>
                <span className="text-md font-semibold text-center">
                  {user.username || "User"}
                </span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="flex items-center bg-[#FC8A06] hover:bg-[#e07b00] text-white px-4 py-2 rounded-md text-sm font-semibold"
              >
                Login
              </Link>
            )}

            {isCustomer && (
              <Link to="/cart" className="relative">
                <FaShoppingCart size={24} className="text-white" />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
                  3
                </span>
              </Link>
            )}

            {/* Menu Icon */}
            <button
              onClick={toggleSidebar}
              className="text-white focus:outline-none"
            >
              <FaBars size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* Sidebar Component */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        loggedIn={isLoggedIn}
        username={user?.username}
        profileImage={user?.profile_image}
      />
    </>
  );
}

export default Header;