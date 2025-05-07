// controllers/earnings.controller.js
const Earnings = require('../Models/Earning');
const Delivery = require('../Models/Delivery');
const mongoose = require('mongoose');
const EarningCalculation = require('../Utils/EarningCalculation');

exports.getEarningsSummary = async (req, res) => {
    try {
        const currentDate = new Date();

        // Start of current week (Sunday)
        const currentDay = currentDate.getDay();
        const weekStart = new Date(currentDate);
        weekStart.setDate(currentDate.getDate() - currentDay);
        weekStart.setHours(0, 0, 0, 0);

        // Start of current month
        const monthStart = new Date(currentDate);
        monthStart.setDate(1);
        monthStart.setHours(0, 0, 0, 0);

        // Start of current year
        const yearStart = new Date(currentDate);
        yearStart.setMonth(0, 1);
        yearStart.setHours(0, 0, 0, 0);

        // Get weekly earnings
        const weeklyEarnings = await Earnings.aggregate([
            {
                $match: {
                    driver: new mongoose.Types.ObjectId(req.user._id),
                    createdAt: { $gte: weekStart }
                }
            },
            {
                $group: {
                    _id: null,
                    totalEarnings: { $sum: '$totalEarning' },
                    totalBonus: { $sum: '$bonus' },
                    tips: { $sum: '$tips' }, // Add tips field to model
                    ordersCount: { $sum: 1 }
                }
            }
        ]);

        // Get monthly earnings
        const monthlyEarnings = await Earnings.aggregate([
            {
                $match: {
                    driver: new mongoose.Types.ObjectId(req.user._id),
                    createdAt: { $gte: monthStart }
                }
            },
            {
                $group: {
                    _id: null,
                    totalEarnings: { $sum: '$totalEarning' },
                    totalBonus: { $sum: '$bonus' },
                    tips: { $sum: '$tips' },
                    ordersCount: { $sum: 1 }
                }
            }
        ]);

        // Get yearly earnings
        const yearlyEarnings = await Earnings.aggregate([
            {
                $match: {
                    driver: new mongoose.Types.ObjectId(req.user._id),
                    createdAt: { $gte: yearStart }
                }
            },
            {
                $group: {
                    _id: null,
                    totalEarnings: { $sum: '$totalEarning' },
                    totalBonus: { $sum: '$bonus' },
                    tips: { $sum: '$tips' },
                    ordersCount: { $sum: 1 }
                }
            }
        ]);

        // Calculate active hours
        // This would require tracking active time in your app
        const weeklyHours = await calculateActiveHours(req.user._id, weekStart);
        const monthlyHours = await calculateActiveHours(req.user._id, monthStart);
        const yearlyHours = await calculateActiveHours(req.user._id, yearStart);

        // Get recent payments
        const recentPayments = await Earnings.find({
            driver: req.user._id
        })
            .sort({ paymentDate: -1 })
            .limit(5)
            .select('_id totalEarning paymentDate paymentStatus');

        // Format recent payments for frontend
        const formattedRecentPayments = recentPayments.map(payment => ({
            id: `PAY-${payment._id.toString().substring(0, 8).toUpperCase()}`,
            date: formatDate(payment.paymentDate),
            amount: payment.totalEarning,
            status: payment.paymentStatus
        }));

        // Format response to match frontend expectations
        res.json({
            week: {
                total: weeklyEarnings[0]?.totalEarnings || 0,
                orders: weeklyEarnings[0]?.ordersCount || 0,
                tips: weeklyEarnings[0]?.tips || 0,
                bonuses: weeklyEarnings[0]?.totalBonus || 0,
                hours: weeklyHours || 0,
                averagePerOrder: calculateAverage(
                    weeklyEarnings[0]?.totalEarnings || 0,
                    weeklyEarnings[0]?.ordersCount || 1
                ),
                averagePerHour: calculateAverage(
                    weeklyEarnings[0]?.totalEarnings || 0,
                    weeklyHours || 1
                )
            },
            month: {
                total: monthlyEarnings[0]?.totalEarnings || 0,
                orders: monthlyEarnings[0]?.ordersCount || 0,
                tips: monthlyEarnings[0]?.tips || 0,
                bonuses: monthlyEarnings[0]?.totalBonus || 0,
                hours: monthlyHours || 0,
                averagePerOrder: calculateAverage(
                    monthlyEarnings[0]?.totalEarnings || 0,
                    monthlyEarnings[0]?.ordersCount || 1
                ),
                averagePerHour: calculateAverage(
                    monthlyEarnings[0]?.totalEarnings || 0,
                    monthlyHours || 1
                )
            },
            year: {
                total: yearlyEarnings[0]?.totalEarnings || 0,
                orders: yearlyEarnings[0]?.ordersCount || 0,
                tips: yearlyEarnings[0]?.tips || 0,
                bonuses: yearlyEarnings[0]?.totalBonus || 0,
                hours: yearlyHours || 0,
                averagePerOrder: calculateAverage(
                    yearlyEarnings[0]?.totalEarnings || 0,
                    yearlyEarnings[0]?.ordersCount || 1
                ),
                averagePerHour: calculateAverage(
                    yearlyEarnings[0]?.totalEarnings || 0,
                    yearlyHours || 1
                )
            },
            recentPayments: formattedRecentPayments
        });
    } catch (error) {
        console.error('Error in getEarningsSummary:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};




exports.createEarningsRecord = async (req, res) => {
    try {
        // Find the delivery
        const delivery = await Delivery.findOne({
            driverid: req.user._id,
            status: 'delivered'
        }).sort({ Date: -1 }); // Get the most recent delivered order

        if (!delivery) {
            return res.status(404).json({ message: 'No completed delivery found' });
        }

        // Extract delivery distance
        const deliveryDistance = delivery.totalDistance;

        // Calculate base earnings from distance
        const baseEarning = EarningCalculation(deliveryDistance);

        // Calculate bonus based on various factors
        let bonus = 0;

        // 1. Distance bonus - extra for long deliveries
        if (deliveryDistance > 10) {
            bonus += 50; // Add $2.50 for deliveries over 10km
        } else if (deliveryDistance > 5) {
            bonus += 20; // Add $1.00 for deliveries between 5-10km
        }

        // 2. Peak hour bonus
        const deliveryHour = new Date(delivery.Date).getHours();
        const isPeakHour = (deliveryHour >= 11 && deliveryHour <= 14) || // Lunch rush
            (deliveryHour >= 18 && deliveryHour <= 21);   // Dinner rush

        if (isPeakHour) {
            bonus += 15; // Add $1.50 for peak hour deliveries
        }

        // 3. Weekend bonus
        const deliveryDay = new Date(delivery.Date).getDay();
        const isWeekend = (deliveryDay === 0 || deliveryDay === 6); // Sunday or Saturday

        if (isWeekend) {
            bonus += 10; // Add $1.00 for weekend deliveries
        }

        // Get tips from the request (assuming tips are passed from frontend)
        const tips = req.body.tips || 0;

        // Calculate total earning (base + bonus + tips)
        const totalEarning = baseEarning + bonus + tips;

        // Create earnings record
        const earnings = new Earnings({
            driver: req.user._id,
            totalEarning: totalEarning,
            bonus: bonus,
            tips: tips,
            paymentStatus: 'pending',
            deliveryId: delivery._id // Reference to the delivery
        });

        await earnings.save();

        res.status(201).json({
            message: 'Earnings recorded successfully',
            data: {
                ...earnings.toObject(),
                baseEarning: baseEarning,
                bonusBreakdown: {
                    distanceBonus: deliveryDistance > 10 ? 50 : (deliveryDistance > 5 ? 20 : 0),
                    peakHourBonus: isPeakHour ? 15 : 0,
                    weekendBonus: isWeekend ? 10 : 0
                }
            }
        });
    } catch (error) {
        console.error('Error in createEarningsRecord:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Helper function to calculate average
function calculateAverage(total, count) {
    return count > 0 ? Number((total / count).toFixed(2)) : 0;
}

// Helper function to format date
function formatDate(date) {
    const d = new Date(date);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}





async function calculateActiveHours(driverId, startDate) {

    const deliveries = await Delivery.countDocuments({
        driverid: driverId,
        Date: { $gte: startDate }
    });

    return Number((deliveries * 0.75).toFixed(2));
}
