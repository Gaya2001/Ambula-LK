import React, { useState, useEffect } from 'react';
import { FaCalendar, FaDownload, FaCreditCard, FaChevronRight, FaChevronDown } from 'react-icons/fa';
import axios from 'axios';
import DeliveryRiderService from '../../../services/DeliveryRider-service';


function EarningsContent() {
    const [activeTimeframe, setActiveTimeframe] = useState('week');
    const [showPaymentDetails, setShowPaymentDetails] = useState(false);
    const [earningsData, setEarningsData] = useState({
        week: {
            total: 0,
            orders: 0,
            tips: 0,
            bonuses: 0,
            hours: 0,
            averagePerOrder: 0,
            averagePerHour: 0
        },
        month: {
            total: 0,
            orders: 0,
            tips: 0,
            bonuses: 0,
            hours: 0,
            averagePerOrder: 0,
            averagePerHour: 0
        },
        year: {
            total: 0,
            orders: 0,
            tips: 0,
            bonuses: 0,
            hours: 0,
            averagePerOrder: 0,
            averagePerHour: 0
        }
    });
    const [recentPayments, setRecentPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        const fetchEarningsData = async () => {
            try {
                setLoading(true);
                const response = await DeliveryRiderService.fetchEarningsData();

                console.log('Earnings data:', response.data);

                setEarningsData({
                    week: response.data.week,
                    month: response.data.month,
                    year: response.data.year
                });


                setRecentPayments(response.data.recentPayments);

                setLoading(false);
            } catch (err) {
                console.error('Error fetching earnings data:', err);
                setError('Failed to load earnings data. Please try again.');
                setLoading(false);
            }
        };

        fetchEarningsData();
    }, []);


    const currentEarnings = earningsData[activeTimeframe];

    if (loading) {
        return (
            <div className="flex justify-center items-center p-10 h-64">
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                    <p className="mt-2 text-gray-600">Loading earnings data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 m-4">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <p className="text-red-700">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Earnings Summary Card */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="bg-gradient-to-r from-[#0C1A39] to-[#1D2D50] p-6 text-white">
                    <div className="flex flex-wrap items-center justify-between">
                        <div>
                            <h2 className="text-xl font-semibold mb-1">Total Earnings</h2>
                            <div className="flex items-baseline">
                                <span className="text-4xl font-bold">Rs {currentEarnings.total.toFixed(2)}</span>
                                <span className="ml-2 text-sm opacity-80">
                                    {activeTimeframe === 'week' ? 'This Week' :
                                        activeTimeframe === 'month' ? 'This Month' : 'This Year'}
                                </span>
                            </div>
                        </div>

                        {/* Timeframe Selector */}
                        <div className="flex bg-black bg-opacity-25 rounded-lg p-1 mt-2 sm:mt-0">
                            <button
                                className={`px-3 py-1 rounded-lg text-sm ${activeTimeframe === 'week' ? 'bg-[#FF8A00] text-white' : 'text-gray-300'
                                    }`}
                                onClick={() => setActiveTimeframe('week')}
                            >
                                Week
                            </button>
                            <button
                                className={`px-3 py-1 rounded-lg text-sm ${activeTimeframe === 'month' ? 'bg-[#FF8A00] text-white' : 'text-gray-300'
                                    }`}
                                onClick={() => setActiveTimeframe('month')}
                            >
                                Month
                            </button>
                            <button
                                className={`px-3 py-1 rounded-lg text-sm ${activeTimeframe === 'year' ? 'bg-[#FF8A00] text-white' : 'text-gray-300'
                                    }`}
                                onClick={() => setActiveTimeframe('year')}
                            >
                                Year
                            </button>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    {/* Earnings Breakdown */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-4">
                            <h3 className="text-sm font-medium text-gray-500 uppercase">Earnings Breakdown</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Base Pay</span>
                                    <span className="font-medium text-black">Rs {(currentEarnings.total - currentEarnings.tips - currentEarnings.bonuses).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Tips</span>
                                    <span className="font-medium text-black ">Rs {currentEarnings.tips.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Bonuses</span>
                                    <span className="font-medium text-black ">Rs {currentEarnings.bonuses.toFixed(2)}</span>
                                </div>
                                <div className="pt-2 border-t border-gray-200 flex justify-between">
                                    <span className="font-medium text-black">Total</span>
                                    <span className="font-bold text-black ">Rs {currentEarnings.total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-sm font-medium text-gray-500 uppercase">Performance</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Orders Completed</span>
                                    <span className="font-medium text-black ">{currentEarnings.orders}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Hours Active</span>
                                    <span className="font-medium text-black ">{currentEarnings.hours} hrs</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Average Per Order</span>
                                    <span className="font-medium text-black">Rs {currentEarnings.averagePerOrder.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Average Per Hour</span>
                                    <span className="font-medium text-black">Rs {currentEarnings.averagePerHour.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-sm font-medium text-gray-500 uppercase">Actions</h3>
                            <div className="space-y-3">
                                <button className="w-full flex items-center justify-between bg-gray-100 hover:bg-gray-200 transition-colors p-3 rounded-lg text-left">
                                    <div className="flex items-center">
                                        <FaCalendar className="text-gray-500 mr-3" />
                                        <span className="font-medium">View Earnings Calendar</span>
                                    </div>
                                    <FaChevronRight className="text-gray-400" />
                                </button>

                                <button className="w-full flex items-center justify-between bg-gray-100 hover:bg-gray-200 transition-colors p-3 rounded-lg text-left">
                                    <div className="flex items-center">
                                        <FaDownload className="text-gray-500 mr-3" />
                                        <span className="font-medium">Download Statement</span>
                                    </div>
                                    <FaChevronRight className="text-gray-400" />
                                </button>

                                <button
                                    className="w-full flex items-center justify-between bg-gray-100 hover:bg-gray-200 transition-colors p-3 rounded-lg text-left"
                                    onClick={() => setShowPaymentDetails(!showPaymentDetails)}
                                >
                                    <div className="flex items-center">
                                        <FaCreditCard className="text-gray-500 mr-3" />
                                        <span className="font-medium">Payment Methods</span>
                                    </div>
                                    {showPaymentDetails ? <FaChevronDown className="text-gray-400" /> : <FaChevronRight className="text-gray-400" />}
                                </button>

                                {showPaymentDetails && (
                                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 mt-1">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center">
                                                <div className="h-8 w-12 bg-blue-600 rounded mr-3 flex items-center justify-center text-white text-xs font-bold">VISA</div>
                                                <div>
                                                    <p className="font-medium">Visa ending in 4382</p>
                                                    <p className="text-xs text-gray-500">Default payment method</p>
                                                </div>
                                            </div>
                                            <button className="text-[#FF8A00] text-sm hover:underline">Edit</button>
                                        </div>
                                        <button className="text-[#FF8A00] text-sm hover:underline">+ Add new payment method</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Payments */}
            <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-800">Recent Payments</h2>
                    <button className="text-sm text-[#FF8A00] hover:underline">View All</button>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {recentPayments.length > 0 ? (
                                recentPayments.map(payment => (
                                    <tr key={payment.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{payment.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payment.date}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">Rs{payment.amount.toFixed(2)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${payment.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {payment.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                            <button className="text-[#FF8A00] hover:text-[#FF9D2F]">Details</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                                        No recent payments found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default EarningsContent;
