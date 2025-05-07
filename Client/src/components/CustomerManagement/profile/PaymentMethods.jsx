import React, { useState } from "react";
import { FaCreditCard, FaPlus, FaCheckCircle, FaTrash, FaCcVisa, FaCcMastercard, FaCcAmex } from "react-icons/fa";

const PaymentMethods = () => {
  const [showCardDetails, setShowCardDetails] = useState(false);
  const [showDeclineInfo, setShowDeclineInfo] = useState(false);

  const toggleCardDetails = () => {
    setShowCardDetails(!showCardDetails);
    if (!showCardDetails) setShowDeclineInfo(false);
  };

  const toggleDeclineInfo = () => {
    setShowDeclineInfo(!showDeclineInfo);
  };

  return (
    <div className="min-h-screen text-white bg-gradient-to-b from-blue-900 to-black">
      <div className="container px-4 py-8 mx-auto">
        <div className="max-w-4xl mx-auto">
          {/* Header with background card */}
          <div className="relative overflow-hidden rounded-t-2xl bg-gradient-to-r from-indigo-900 to-blue-900">
            {/* Decorative background elements */}
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="absolute w-40 h-40 rounded-full top-10 left-20 bg-amber-500 opacity-10 blur-xl"></div>
              <div className="absolute bg-blue-500 rounded-full bottom-10 right-20 w-60 h-60 opacity-10 blur-xl"></div>
            </div>
            
            {/* Header content */}
            <div className="relative z-10 flex flex-col items-center p-8">
              <h2 className="text-3xl font-bold text-white">Payment Methods</h2>
              <p className="mt-2 text-amber-400">Manage your payment options securely</p>
            </div>
          </div>
          
          {/* Main content area */}
          <div className="shadow-2xl bg-blue-950 bg-opacity-80 backdrop-blur-sm rounded-b-2xl">
            {/* Add Payment Method Button */}
            <div className="p-6">
              <button className="flex items-center px-4 py-3 text-white transition-colors rounded-md bg-amber-600 hover:bg-amber-700">
                <FaPlus className="mr-2" />
                Add New Payment Method
              </button>
            </div>

            {/* Card Management Section */}
            <div className="px-6 pb-6">
              <div className="flex items-center gap-2 mb-4 text-xl font-semibold text-amber-400">
                <FaCreditCard size={20} />
                <h3>Credit & Debit Cards</h3>
              </div>
              
              <div className="p-4 bg-blue-900 border border-blue-800 rounded-lg bg-opacity-40">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-12 h-12 text-white rounded-full bg-amber-600">
                      <FaCreditCard className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-medium text-white">Saved Payment Cards</p>
                      <p className="text-sm text-blue-300">View and manage your payment options</p>
                    </div>
                  </div>
                  <button
                    className="px-4 py-2 mt-3 text-sm border rounded-full text-amber-400 border-amber-400 hover:bg-amber-600 hover:text-white md:mt-0"
                    onClick={toggleCardDetails}
                  >
                    {showCardDetails ? "Hide Cards" : "View Cards"}
                  </button>
                </div>
                
                {showCardDetails && (
                  <div className="mt-6 space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {/* Visa Card */}
                      <div className="p-4 bg-blue-800 border border-blue-700 rounded-lg bg-opacity-40">
                        <div className="flex justify-between">
                          <div className="flex items-center">
                            <FaCcVisa className="w-10 h-10 text-blue-300" />
                            <div className="ml-3">
                              <p className="font-medium text-white">Visa Card</p>
                              <p className="text-sm text-blue-300">
                                <span className="font-mono">••••</span> 1292
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <button className="p-2 text-red-400 hover:text-red-300">
                              <FaTrash size={16} />
                            </button>
                          </div>
                        </div>
                        <div className="mt-2">
                          <span className="px-2 py-1 text-xs text-green-300 bg-green-900 rounded-full bg-opacity-40">
                            Default
                          </span>
                        </div>
                      </div>

                      {/* MasterCard */}
                      <div className="p-4 bg-blue-800 border border-blue-700 rounded-lg bg-opacity-40">
                        <div className="flex justify-between">
                          <div className="flex items-center">
                            <FaCcMastercard className="w-10 h-10 text-orange-300" />
                            <div className="ml-3">
                              <p className="font-medium text-white">MasterCard</p>
                              <p className="text-sm text-blue-300">
                                <span className="font-mono">••••</span> 1191
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <button className="p-2 text-red-400 hover:text-red-300">
                              <FaTrash size={16} />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* AMEX Card */}
                      <div className="p-4 bg-blue-800 border border-blue-700 rounded-lg bg-opacity-40">
                        <div className="flex justify-between">
                          <div className="flex items-center">
                            <FaCcAmex className="w-10 h-10 text-blue-300" />
                            <div className="ml-3">
                              <p className="font-medium text-white">AMEX</p>
                              <p className="text-sm text-blue-300">
                                <span className="font-mono">••••</span> 0225
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <button className="p-2 text-red-400 hover:text-red-300">
                              <FaTrash size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-blue-800">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-amber-400">Additional Card Information</h4>
                        <button
                          onClick={toggleDeclineInfo}
                          className="px-4 py-1 text-xs text-blue-300 transition-colors border border-blue-700 rounded-full hover:bg-blue-800"
                        >
                          {showDeclineInfo ? "Hide Details" : "Show Details"}
                        </button>
                      </div>

                      {showDeclineInfo && (
                        <div className="mt-4 space-y-4">
                          {/* Alternative Cards Section */}
                          <div className="p-4 bg-blue-900 bg-opacity-50 border border-blue-800 rounded-lg">
                            <h5 className="mb-2 font-medium text-amber-400">Alternative Visa Cards</h5>
                            <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
                              <div className="p-2 bg-blue-900 border border-blue-800 rounded bg-opacity-70">
                                <p className="text-sm text-blue-300">Card 1: <span className="font-mono text-xs text-white">••••9121</span></p>
                              </div>
                              <div className="p-2 bg-blue-900 border border-blue-800 rounded bg-opacity-70">
                                <p className="text-sm text-blue-300">Card 2: <span className="font-mono text-xs text-white">••••5646</span></p>
                              </div>
                              <div className="p-2 bg-blue-900 border border-blue-800 rounded bg-opacity-70">
                                <p className="text-sm text-blue-300">Card 3: <span className="font-mono text-xs text-white">••••7248</span></p>
                              </div>
                            </div>
                          </div>

                          <div className="p-4 bg-blue-900 bg-opacity-50 border border-blue-800 rounded-lg">
                            <h5 className="mb-2 font-medium text-amber-400">Alternative MasterCard Cards</h5>
                            <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
                              <div className="p-2 bg-blue-900 border border-blue-800 rounded bg-opacity-70">
                                <p className="text-sm text-blue-300">Card 1: <span className="font-mono text-xs text-white">••••7487</span></p>
                              </div>
                              <div className="p-2 bg-blue-900 border border-blue-800 rounded bg-opacity-70">
                                <p className="text-sm text-blue-300">Card 2: <span className="font-mono text-xs text-white">••••8283</span></p>
                              </div>
                              <div className="p-2 bg-blue-900 border border-blue-800 rounded bg-opacity-70">
                                <p className="text-sm text-blue-300">Card 3: <span className="font-mono text-xs text-white">••••7973</span></p>
                              </div>
                            </div>
                          </div>

                          <div className="p-4 bg-blue-900 bg-opacity-50 border border-blue-800 rounded-lg">
                            <h5 className="mb-2 font-medium text-amber-400">Alternative AMEX Cards</h5>
                            <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
                              <div className="p-2 bg-blue-900 border border-blue-800 rounded bg-opacity-70">
                                <p className="text-sm text-blue-300">Card 1: <span className="font-mono text-xs text-white">••••8928</span></p>
                              </div>
                              <div className="p-2 bg-blue-900 border border-blue-800 rounded bg-opacity-70">
                                <p className="text-sm text-blue-300">Card 2: <span className="font-mono text-xs text-white">••••3469</span></p>
                              </div>
                              <div className="p-2 bg-blue-900 border border-blue-800 rounded bg-opacity-70">
                                <p className="text-sm text-blue-300">Card 3: <span className="font-mono text-xs text-white">••••2812</span></p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethods;