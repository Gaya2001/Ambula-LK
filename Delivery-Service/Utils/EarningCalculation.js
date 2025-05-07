
/**
 * Calculate earnings based on delivery distance
 * @param {Number} distance - Distance in kilometers
 * @returns {Number} - Total earnings
 */
const calculateEarningsFromDistance = (distance) => {
    const basePickupFee = 1.40;       // Base pickup fee
    const baseDropoffFee = 0.60;      // Base dropoff fee
    const ratePerKm = 1.00;           // Rate per kilometer
    const minimumFare = 3.50;         // Minimum fare guarantee

    // Calculate total payment based on distance
    let totalPayment = basePickupFee + baseDropoffFee + (distance * ratePerKm);

    // Ensure driver receives at least the minimum fare
    if (totalPayment < minimumFare) {
        totalPayment = minimumFare;
    }

    return parseFloat(totalPayment.toFixed(2));
};

module.exports = calculateEarningsFromDistance;