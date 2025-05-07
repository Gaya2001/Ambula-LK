import React, { useState, useEffect, useRef } from 'react';
import {
    FaWallet,
    FaCheckCircle,
    FaTimes,
    FaClock,
    FaInfoCircle,
    FaBell,
    FaArrowRight,
    FaChevronDown,
    FaChevronUp
} from 'react-icons/fa';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

import { MakeDriverAvailable, UpdateDriverLocation } from '../DeliveryServices/DeliveryAvailabilty';
import DeliveryRiderService from '../../../services/DeliveryRider-service';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

function StatCard({ title, value, change, isNegative, isPositive, icon }) {
    return (
        <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="flex justify-between">
                <div>
                    <p className="text-xs text-gray-500 font-medium">{title}</p>
                    <p className="text-xl font-bold mt-1">{value}</p>
                    <div
                        className={`inline-flex items-center text-xs mt-1 ${isNegative
                            ? 'text-red-500'
                            : isPositive
                                ? 'text-green-500'
                                : 'text-green-500'
                            }`}
                    >
                        <span>{change}</span>
                    </div>
                </div>
                <div className="bg-gray-50 p-2 rounded-lg">{icon}</div>
            </div>
        </div>
    );
}

function EarningsTrendChart({ data }) {
    const chartRef = useRef(null);

    // Add better fallback for chart
    const hasNonZeroData = data.datasets.some(dataset =>
        dataset.data.some(value => value > 0)
    );

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    boxWidth: 12,
                    padding: 10,
                    font: { size: 11 }
                }
            },
            title: { display: false },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        let label = context.dataset.label || '';
                        if (label) label += ': ';
                        if (context.parsed.y !== null) {
                            if (context.dataset.label === 'Earnings') {
                                label += `$${context.parsed.y.toFixed(2)}`;
                            } else {
                                label += context.parsed.y;
                            }
                        }
                        return label;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: { font: { size: 10 } },
                title: {
                    display: true,
                    text: 'Number of Orders',
                    font: { size: 10 }
                },
                suggestedMax: hasNonZeroData ? 5 : 10 // Lower max for count data
            },
            y1: {
                position: 'right',
                beginAtZero: true,
                ticks: {
                    font: { size: 10 },
                    callback: function (value) {
                        return '$' + value;
                    }
                },
                title: {
                    display: true,
                    text: 'Earnings ($)',
                    font: { size: 10 }
                },
                grid: {
                    drawOnChartArea: false // Only show grid lines for primary y-axis
                },
                suggestedMax: hasNonZeroData ? 30 : 50 // Cap earnings display at $30-50
            },
            x: { ticks: { font: { size: 10 } } }
        },
        animation: {
            duration: 1000 // Add animation to make chart more visible
        }
    };

    return (
        <div className="h-[280px] relative">
            {/* Add sample data placeholder when all values are zero */}
            {!hasNonZeroData && (
                <div className="absolute inset-0 flex items-center justify-center z-10 bg-white bg-opacity-70">
                    <div className="text-center p-4">
                        <p className="text-gray-500 font-medium">No delivery data for this period</p>
                        <p className="text-xs text-gray-400 mt-1">Chart will update when deliveries are completed</p>
                    </div>
                </div>
            )}
            <Bar
                data={data}
                options={options}
                ref={chartRef}
                // Add key to force remount when data changes
                key={JSON.stringify(data.datasets.map(d => d.data))}
            />
        </div>
    );
}


function DashboardContent() {
    const [editMode, setEditMode] = useState(false);
    const [profileImg, setProfileImg] = useState('');
    const fileInputRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        age: 0,
        gender: '',
        mobile: '',
        email: '',
        password: '',
        isVerified: false,
        profileImage: ''
    });
    const [deliveryData, setDeliveryData] = useState({
        pending: 0,
        completed: 0,
        cancelled: 0,
        total: 0
    });
    const [earningsData, setEarningsData] = useState({
        week: {
            total: 0,
            change: '0%'
        },
        month: {
            total: 0,
            change: '0%'
        },
        year: {
            total: 0,
            change: '0%'
        }
    });
    const [recentPayments, setRecentPayments] = useState([]);
    const [deliveries, setDeliveries] = useState([]);

    const [timePeriod, setTimePeriod] = useState('week');
    const [showNotification, setShowNotification] = useState(false);
    const [expandChart, setExpandChart] = useState(false);
    const [success, setSuccess] = useState(null);
    const [dataExists, setDataExists] = useState(false);

    // Initialize with sample data to ensure the chart renders even with no data
    const [chartData, setChartData] = useState({
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
            {
                label: 'Earnings',
                data: [0, 0, 0, 0, 0, 0, 0],
                backgroundColor: 'rgba(255, 138, 0, 0.6)',
                borderColor: 'rgb(255, 138, 0)',
                borderWidth: 1,
                borderRadius: 5,
            },
            {
                label: 'Completed',
                data: [0, 0, 0, 0, 0, 0, 0],
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgb(75, 192, 192)',
                borderWidth: 1,
                borderRadius: 5,
            },
            {
                label: 'Cancelled',
                data: [0, 0, 0, 0, 0, 0, 0],
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
                borderColor: 'rgb(255, 99, 132)',
                borderWidth: 1,
                borderRadius: 5,
            }
        ],
    });

    // For demo purposes - add sample data if you want to see the chart with values
    const addSampleData = () => {
        console.log("Adding sample data to chart");

        const sampleData = {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [
                {
                    label: 'Earnings',
                    data: [25, 45, 30, 70, 40, 60, 35],
                    backgroundColor: 'rgba(255, 138, 0, 0.6)',
                    borderColor: 'rgb(255, 138, 0)',
                    borderWidth: 1,
                    borderRadius: 5,
                },
                {
                    label: 'Completed',
                    data: [5, 8, 6, 9, 7, 10, 5],
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    borderColor: 'rgb(75, 192, 192)',
                    borderWidth: 1,
                    borderRadius: 5,
                },
                {
                    label: 'Cancelled',
                    data: [1, 0, 2, 1, 0, 3, 1],
                    backgroundColor: 'rgba(255, 99, 132, 0.6)',
                    borderColor: 'rgb(255, 99, 132)',
                    borderWidth: 1,
                    borderRadius: 5,
                }
            ],
        };

        setChartData(sampleData);
        setDataExists(true);
    };

    // =================== Update driver Availability and Location ===================
    useEffect(() => {
        const callDriverFunctions = async () => {
            await MakeDriverAvailable(setLoading, setSuccess, setError);
            await UpdateDriverLocation(setLoading, setSuccess, setError);
        };

        callDriverFunctions();
    }, []);

    // =================== Fetch driver details ===================
    useEffect(() => {
        const fetchDriverDetails = async () => {
            setLoading(true);
            try {
                const response = await DeliveryRiderService.GetDriverDetails();
                console.log("Driver details fetched:", response.data);
                setFormData({
                    ...formData,
                    firstName: response.data.driver.firstName,
                    lastName: response.data.driver.lastName,
                    age: response.data.driver.age,
                    gender: response.data.driver.gender,
                    mobile: response.data.driver.mobile,
                    email: response.data.driver.email,
                    password: response.data.driver.password,
                    profileImage: response.data.driver.profileImage,
                });
                if (response.data.driver.profileImage) {
                    setProfileImg(response.data.driver.profileImage);
                }
            } catch (err) {
                console.error("Error fetching driver details:", err);
                setError(err.response?.data?.message || "Failed to load driver details.");
            } finally {
                setLoading(false);
            }
        };

        fetchDriverDetails();
    }, []);

    // =================== Fetch Driver's Delivery details ===================
    useEffect(() => {
        const fetchDeliveries = async () => {
            setLoading(true);
            try {
                const deliveriesResponse = await DeliveryRiderService.GetAllDeliveriesForDriver();
                console.log("Deliveries fetched:", deliveriesResponse.data);
                const fetchedDeliveries = deliveriesResponse.data;
                setDeliveries(fetchedDeliveries);

                // Count deliveries by status
                let pendingCount = 0;
                let completedCount = 0;
                let cancelledCount = 0;
                let totalEarnings = 0;

                fetchedDeliveries.forEach(delivery => {
                    const status = delivery.status.toLowerCase();
                    if (status === "pending") {
                        pendingCount++;
                    } else if (status === "completed" || status === "delivered" || status === "picked") {
                        completedCount++;
                        // Add to earnings if the delivery has a price
                        if (delivery.price) {
                            totalEarnings += parseFloat(delivery.price || 0);
                        }
                    } else if (status === "cancelled") {
                        cancelledCount++;
                    }
                });

                setDeliveryData({
                    pending: pendingCount,
                    completed: completedCount,
                    cancelled: cancelledCount,
                    total: fetchedDeliveries.length
                });

                // Update earnings in state if not already set by earnings endpoint
                if (earningsData.week.total === 0) {
                    setEarningsData(prev => ({
                        ...prev,
                        week: {
                            total: totalEarnings.toFixed(2),
                            change: '+0%'
                        }
                    }));
                }

                // Check if we have a pending notification to display
                const hasPendingDelivery = fetchedDeliveries.some(delivery =>
                    delivery.status.toLowerCase() === "pending");

                if (hasPendingDelivery) {
                    // Find the most recent pending delivery to show in notification
                    const pendingDeliveries = fetchedDeliveries.filter(
                        delivery => delivery.status.toLowerCase() === "pending"
                    );

                    if (pendingDeliveries.length > 0) {
                        // Sort by date descending to get most recent
                        pendingDeliveries.sort((a, b) => {
                            const dateA = new Date(a.Date || a.createdAt || a.date);
                            const dateB = new Date(b.Date || b.createdAt || b.date);
                            return dateB - dateA;
                        });

                        const recentPending = pendingDeliveries[0];
                        if (recentPending) {
                            setShowNotification(true);
                        }
                    }
                }

                // Update chart data based on deliveries
                const hasData = updateChartDataFromDeliveries(fetchedDeliveries);

                // If no delivery data exists, add sample data automatically
                if (!hasData) {
                    console.log("No delivery data for chart, using sample data");
                    addSampleData();
                }

            } catch (err) {
                console.error("Error fetching deliveries:", err);
                setError(err.response?.data?.message || "Failed to load delivery details.");
                // Even if there's an error, show sample data so the chart is visible
                addSampleData();
            } finally {
                setLoading(false);
            }
        };

        fetchDeliveries();
    }, []);

    // Function to update chart data based on deliveries and time period
    // Function to update chart data based on deliveries and time period
    const updateChartDataFromDeliveries = (deliveries) => {
        // Weekly chart (by day of week)
        const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const earningsByDay = Array(7).fill(0);
        const completedByDay = Array(7).fill(0);
        const cancelledByDay = Array(7).fill(0);

        const today = new Date();
        console.log("Today's date:", today.toISOString());

        // Start of current week (Sunday)
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        startOfWeek.setHours(0, 0, 0, 0);

        console.log("Start of week for chart:", startOfWeek.toISOString());

        let processedDeliveries = 0;
        let hasData = false;

        deliveries.forEach(delivery => {
            try {
                // Important: Use the proper date field - Date with capital D from your data
                const deliveryDate = new Date(delivery.Date || delivery.createdAt || delivery.date);
                console.log(`Checking delivery date: ${deliveryDate.toISOString()} >= ${startOfWeek.toISOString()}`);

                if (deliveryDate >= startOfWeek) {
                    processedDeliveries++;
                    const dayIndex = deliveryDate.getDay(); // 0 for Sunday, 1 for Monday, etc.
                    console.log(`Delivery on day index: ${dayIndex} (${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dayIndex]})`);

                    if (delivery.status.toLowerCase() === "completed" ||
                        delivery.status.toLowerCase() === "delivered" ||
                        delivery.status.toLowerCase() === "picked") {
                        completedByDay[dayIndex]++;
                        hasData = true;

                        // Use totalDistance as a substitute for earnings if price isn't available
                        const price = parseFloat(delivery.price || 0);
                        if (!isNaN(price) && price > 0) {
                            earningsByDay[dayIndex] += price;
                        } else if (delivery.totalDistance) {
                            // Scale down the totalDistance to a reasonable earnings value (max $20-30 per delivery)
                            // This prevents the y-axis from being dominated by these values
                            const estimatedEarnings = Math.min(25, delivery.totalDistance * 0.08);
                            earningsByDay[dayIndex] += estimatedEarnings;
                        } else {
                            // Default value if no price or distance data
                            earningsByDay[dayIndex] += 10; // Default $10 per delivery
                        }
                    } else if (delivery.status.toLowerCase() === "cancelled") {
                        cancelledByDay[dayIndex]++;
                        hasData = true;
                    }
                }
            } catch (error) {
                console.error("Error processing delivery for chart:", error, delivery);
            }
        });

        console.log("Processed deliveries for chart:", processedDeliveries);
        console.log("Raw data by day:", { earningsByDay, completedByDay, cancelledByDay });

        // Reorder arrays to start from Monday (index 1) instead of Sunday (index 0)
        const reorderForChart = (arr) => {
            return [...arr.slice(1), arr[0]];
        };

        const earningsData = reorderForChart(earningsByDay);
        const completedData = reorderForChart(completedByDay);
        const cancelledData = reorderForChart(cancelledByDay);

        console.log("Chart data after reordering:", { earningsData, completedData, cancelledData });

        setChartData({
            labels: labels,
            datasets: [
                {
                    label: 'Earnings',
                    data: earningsData,
                    backgroundColor: 'rgba(255, 138, 0, 0.6)',
                    borderColor: 'rgb(255, 138, 0)',
                    borderWidth: 1,
                    borderRadius: 5,
                    // Place earnings on a secondary y-axis for better visualization
                    yAxisID: 'y1',
                },
                {
                    label: 'Completed',
                    data: completedData,
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    borderColor: 'rgb(75, 192, 192)',
                    borderWidth: 1,
                    borderRadius: 5,
                    yAxisID: 'y',
                },
                {
                    label: 'Cancelled',
                    data: cancelledData,
                    backgroundColor: 'rgba(255, 99, 132, 0.6)',
                    borderColor: 'rgb(255, 99, 132)',
                    borderWidth: 1,
                    borderRadius: 5,
                    yAxisID: 'y',
                }
            ],
        });

        setDataExists(hasData);
        return hasData;
    };


    // =================== Fetch Driver's Earning ===================
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

    // Calculate current earnings display based on time period
    const getCurrentEarningsDisplay = () => {
        return {
            total: earningsData.week.total || '0.00',
            change: earningsData.week.change || '+0%'
        };
    };

    const earningsDisplay = getCurrentEarningsDisplay();

    return (
        <div className="h-full overflow-hidden">
            <div className="h-full flex flex-col">
                <div className="flex-1 flex flex-col gap-4 p-4">
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                            {error}
                        </div>
                    )}

                    <div className="bg-gradient-to-r from-[#0C1A39] to-[#235789] text-white rounded-lg shadow-md overflow-hidden">
                        <div className="p-4 flex justify-between items-start">
                            <div>
                                <h2 className="text-lg font-bold">Welcome back, {formData.firstName}!</h2>
                                <p className="mt-1 text-sm text-gray-200">{deliveryData.pending} active orders in your area</p>
                            </div>
                            <div className="relative">
                                <div className="bg-orange-500 h-2 w-2 rounded-full absolute -top-1 -right-1"></div>
                                <FaBell className="text-white text-base cursor-pointer hover:text-orange-200 transition-colors" />
                            </div>
                        </div>


                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-black">
                        <StatCard
                            title="Week's Earnings"
                            value={`$${earningsDisplay.total}`}
                            change={earningsDisplay.change}
                            isPositive={!earningsDisplay.change.includes('-')}
                            isNegative={earningsDisplay.change.includes('-')}
                            icon={<FaWallet className="h-6 w-6 text-orange-500" />}
                        />
                        <StatCard
                            title="Completed Orders"
                            value={deliveryData.completed}
                            change={`${deliveryData.completed > 0 ? '+' : ''}${deliveryData.completed}`}
                            isPositive={deliveryData.completed > 0}
                            icon={<FaCheckCircle className="h-6 w-6 text-green-500" />}
                        />
                        <StatCard
                            title="Cancelled"
                            value={deliveryData.cancelled}
                            change={`${deliveryData.cancelled > 0 ? '+' : ''}${deliveryData.cancelled}`}
                            isNegative={deliveryData.cancelled > 0}
                            icon={<FaTimes className="h-6 w-6 text-red-500" />}
                        />
                        <StatCard
                            title="Pending Orders"
                            value={deliveryData.pending}
                            change={`${deliveryData.pending > 0 ? '+' : ''}${deliveryData.pending}`}
                            isPositive={deliveryData.pending > 0}
                            icon={<FaClock className="h-6 w-6 text-blue-500" />}
                        />
                    </div>

                    <div className="bg-white rounded-lg shadow flex-1 flex flex-col">
                        <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                            <div className="flex items-center">
                                <h3 className="font-semibold text-gray-800">Performance Overview</h3>
                                <button onClick={() => setExpandChart(!expandChart)} className="ml-2 text-gray-500 hover:text-gray-700">
                                    {expandChart ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
                                </button>
                            </div>
                            <div className="flex bg-gray-100 rounded overflow-hidden text-xs">
                                <button className="px-3 py-1 font-medium bg-[#0C1A39] text-white">
                                    Week
                                </button>
                            </div>
                        </div>

                        <div className="p-4 flex-1" style={{ minHeight: "300px" }}>
                            {loading ? (
                                <div className="h-[280px] flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
                                </div>
                            ) : (
                                <div className="h-[280px]">
                                    <EarningsTrendChart data={chartData} />
                                </div>
                            )}

                            {!expandChart && (
                                <div className="grid grid-cols-3 gap-4 mt-4">
                                    <div className="text-center">
                                        <p className="text-xs text-gray-500">Total Deliveries</p>
                                        <p className="font-bold">{deliveryData.total}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xs text-gray-500">Completion Rate</p>
                                        <p className="font-bold">
                                            {deliveryData.total > 0
                                                ? `${Math.round((deliveryData.completed / deliveryData.total) * 100)}%`
                                                : '0%'}
                                        </p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xs text-gray-500">Avg. Earnings/Delivery</p>
                                        <p className="font-bold">
                                            {deliveryData.completed > 0 && earningsDisplay.total > 0
                                                ? `$${(parseFloat(earningsDisplay.total) / deliveryData.completed).toFixed(2)}`
                                                : '$0.00'}
                                        </p>
                                    </div>
                                </div>
                            )}



                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DashboardContent;
