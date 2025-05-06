import React from "react";
import { FaBell, FaCheck, FaInfoCircle, FaGift, FaTruck } from "react-icons/fa";

function Notifications() {
  return (
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
            
            {/* Notifications header content */}
            <div className="relative z-10 flex flex-col items-center p-8">
              <div className="flex items-center gap-3">
                <FaBell className="text-amber-400" size={24} />
                <h2 className="text-3xl font-bold text-white">Notifications</h2>
              </div>
              <p className="mt-2 text-blue-300">Stay updated with your orders and offers</p>
            </div>
          </div>
          
          {/* Main content area */}
          <div className="shadow-2xl bg-blue-950 bg-opacity-80 backdrop-blur-sm rounded-b-2xl">
            {/* Notifications list */}
            <div className="p-6">
              <div className="space-y-4">
                {/* Today section */}
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-blue-300">TODAY</h3>
                </div>
                
                {/* Order confirmed notification */}
                <div className="p-4 transition-all bg-blue-900 border-l-4 rounded-lg border-amber-500 bg-opacity-40 hover:bg-opacity-60">
                  <div className="flex items-start">
                    <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 mr-4 rounded-full bg-amber-600">
                      <FaCheck className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-white">Your order has been confirmed!</h3>
                        <span className="text-xs text-blue-300">3:45 PM</span>
                      </div>
                      <p className="mt-1 text-sm text-blue-300">
                        Your order #AMB23956 from Royal Thai Restaurant has been confirmed and is being prepared.
                      </p>
                      <div className="flex mt-3 space-x-2">
                        <button className="px-3 py-1 text-xs border rounded-full text-amber-600 border-amber-600 hover:bg-amber-600 hover:text-white">
                          View Order
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Special offer notification */}
                <div className="p-4 transition-all bg-blue-900 border-l-4 border-blue-500 rounded-lg bg-opacity-40 hover:bg-opacity-60">
                  <div className="flex items-start">
                    <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 mr-4 bg-blue-600 rounded-full">
                      <FaGift className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-white">Special Offer!</h3>
                        <span className="text-xs text-blue-300">11:20 AM</span>
                      </div>
                      <p className="mt-1 text-sm text-blue-300">
                        Get 20% off on your next order from Spice Garden. Use code SPICE20.
                      </p>
                      <div className="flex mt-3 space-x-2">
                        <button className="px-3 py-1 text-xs text-blue-500 border border-blue-500 rounded-full hover:bg-blue-500 hover:text-white">
                          View Restaurant
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Previous section */}
                <div className="mt-8 mb-4">
                  <h3 className="text-sm font-medium text-blue-300">PREVIOUS</h3>
                </div>
                
                {/* Order delivered notification */}
                <div className="p-4 transition-all bg-blue-900 border-l-4 border-gray-500 rounded-lg bg-opacity-40 hover:bg-opacity-60">
                  <div className="flex items-start">
                    <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 mr-4 bg-gray-600 rounded-full">
                      <FaTruck className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-white">Your order has been delivered!</h3>
                        <span className="text-xs text-blue-300">Apr 19, 7:30 PM</span>
                      </div>
                      <p className="mt-1 text-sm text-blue-300">
                        Your order #AMB23892 from Spice Garden has been delivered. Enjoy your meal!
                      </p>
                      <div className="flex mt-3 space-x-2">
                        <button className="px-3 py-1 text-xs text-gray-400 border border-gray-400 rounded-full hover:bg-gray-400 hover:text-blue-900">
                          Rate Your Experience
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* System notification */}
                <div className="p-4 transition-all bg-blue-900 border-l-4 border-purple-500 rounded-lg bg-opacity-40 hover:bg-opacity-60">
                  <div className="flex items-start">
                    <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 mr-4 bg-purple-600 rounded-full">
                      <FaInfoCircle className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-white">App Updates Available</h3>
                        <span className="text-xs text-blue-300">Apr 18, 2:15 PM</span>
                      </div>
                      <p className="mt-1 text-sm text-blue-300">
                        We've made some improvements to our app. Update now to enjoy the latest features!
                      </p>
                      <div className="flex mt-3 space-x-2">
                        <button className="px-3 py-1 text-xs text-purple-400 border border-purple-400 rounded-full hover:bg-purple-400 hover:text-blue-900">
                          Update Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Clear all button */}
              <div className="flex justify-center mt-6">
                <button className="px-4 py-2 text-sm border rounded-lg text-amber-400 border-amber-400 hover:bg-amber-400 hover:text-blue-900">
                  Clear All Notifications
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Notifications;