import React, { useState, useRef, useEffect } from 'react';
import { FaEdit, FaCamera, FaSave, FaTimes, FaLock, FaInfoCircle, FaExclamationTriangle } from 'react-icons/fa';
import DeliveryRiderService from '../../../services/DeliveryRider-service';

function VehicleContent() {
    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [error, setError] = useState(null);

    // Track actual file objects for uploads
    const [frontImageFile, setFrontImageFile] = useState(null);
    const [sideImageFile, setSideImageFile] = useState(null);

    const [vehicleData, setVehicleData] = useState({
        vehicleModel: '',
        vehicleType: '',
        manufactureYear: '',
        licensePlate: '',
        insuranceExpiry: '',
        revenueLicenseExpiry: '',
        driverLicenseExpiry: '',
        emissionTestExpiry: '',
        color: ''
    });

    const [vehicleImages, setVehicleImages] = useState({
        front: '/vehicle-front.jpg',
        side: '/vehicle-side.jpg'
    });

    // =================== Fetch Vehicle details ===================
    useEffect(() => {
        fetchVehicleDetails();
    }, []);

    // Fetch vehicle details function - separated for reusability
    const fetchVehicleDetails = async () => {
        setLoading(true);
        try {
            const response = await DeliveryRiderService.GetVehicleDetails();
            console.log("Vehicle details successfully fetched:", response.data);

            // Update vehicleData state - FIXED: match state keys with backend fields
            setVehicleData({
                vehicleModel: response.data.vehicleModel,
                vehicleType: response.data.vehicleType,
                manufactureYear: response.data.manufactureYear,
                licensePlate: response.data.licensePlate,
                insuranceExpiry: response.data.documents.insurance.expiryDate,
                revenueLicenseExpiry: response.data.documents.revenueLicense.expiryDate,
                driverLicenseExpiry: response.data.documents.driverLicense.expiryDate,
                emissionTestExpiry: response.data.documents.emissionCertificate.expiryDate,
            });

            // Update vehicle images
            setVehicleImages({
                front: response.data.images.frontView || vehicleImages.front,
                side: response.data.images.sideView || vehicleImages.side
            });

        } catch (err) {
            console.error("Vehicle details fetch error:", err);
            setError(
                err.response?.data?.message ||
                err.response?.data?.errors?.[0]?.msg ||
                "Vehicle details fetch failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    // =================== Update Vehicle details ===================
    const updateVehicleDetails = async (formData) => {
        setUpdateLoading(true); // Use separate loading state for updates
        setError(null);

        try {
            const response = await DeliveryRiderService.UpdateVehicleDetails(formData);
            console.log("Vehicle details updated successfully:", response.data);

            // Update local state with the response data instead of re-fetching
            if (response.data) {
                // Update only the fields that were changed
                setVehicleData(prevData => ({
                    ...prevData,
                    vehicleModel: formData.get('vehicleModel') || prevData.vehicleModel,
                    vehicleType: formData.get('vehicleType') || prevData.vehicleType,
                    manufactureYear: formData.get('manufactureYear') || prevData.manufactureYear,
                    licensePlate: formData.get('licensePlate') || prevData.licensePlate,
                }));

                // Only update images if they were changed and returned in response
                if (response.data.images) {
                    setVehicleImages(prevImages => ({
                        ...prevImages,
                        front: response.data.images.frontView || prevImages.front,
                        side: response.data.images.sideView || prevImages.side
                    }));
                }
            }

            // Exit edit mode
            setEditMode(false);
            return true;
        } catch (err) {
            console.error("Vehicle update error:", err);
            setError(
                err.response?.data?.message ||
                err.response?.data?.errors?.[0]?.msg ||
                "Failed to update vehicle details. Please try again."
            );
            return false;
        } finally {
            setUpdateLoading(false); // Use separate loading state for updates
        }
    };

    const frontInputRef = useRef(null);
    const sideInputRef = useRef(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setVehicleData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Modified to track file objects for upload
    const handleImageChange = (position, e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setVehicleImages(prev => ({
                    ...prev,
                    [position]: e.target.result
                }));
            };
            reader.readAsDataURL(file);

            // Store the file object for later upload
            if (position === 'front') {
                setFrontImageFile(file);
            } else if (position === 'side') {
                setSideImageFile(file);
            }
        }
    };

    // Form validation
    const validateForm = () => {
        if (!vehicleData.vehicleModel || !vehicleData.vehicleType || !vehicleData.licensePlate || !vehicleData.manufactureYear) {
            setError("Please fill in all required vehicle details (Model, Type, Year, License Plate)");
            return false;
        }
        return true;
    };

    // Save vehicle data function - FIXED to match backend endpoint expectations
    const handleSave = async () => {
        // Validate form first
        if (!validateForm()) {
            return;
        }

        // Create FormData for image uploads
        const formData = new FormData();

        // FIXED: Append fields with names that match what the backend expects
        formData.append('vehicleModel', vehicleData.vehicleModel);
        formData.append('vehicleType', vehicleData.vehicleType);
        formData.append('manufactureYear', vehicleData.manufactureYear);
        formData.append('licensePlate', vehicleData.licensePlate);

        // Append image files if they exist
        if (frontImageFile) {
            formData.append('frontViewImage', frontImageFile);
        }

        if (sideImageFile) {
            formData.append('sideViewImage', sideImageFile);
        }

        // Call the update function and handle the result
        const success = await updateVehicleDetails(formData);

        if (success) {
            // Clear file state after successful update
            setFrontImageFile(null);
            setSideImageFile(null);
        }
    };

    // Cancel edit mode - reset any pending changes
    const handleCancel = () => {
        // Clear any pending file uploads
        setFrontImageFile(null);
        setSideImageFile(null);

        // Reset images to their original state if files were selected but not saved
        if (frontImageFile || sideImageFile) {
            fetchVehicleDetails();
        }

        setEditMode(false);
        setError(null);
    };

    const isExpiringSoon = (dateString) => {
        if (!dateString) return false;
        const expiryDate = new Date(dateString);
        const today = new Date();
        const thirtyDays = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
        return expiryDate - today < thirtyDays && expiryDate >= today;
    };

    const isExpired = (dateString) => {
        if (!dateString) return false;
        const expiryDate = new Date(dateString);
        const today = new Date();
        return expiryDate < today;
    };

    const formatExpiryDate = (dateString) => {
        if (!dateString) return <span className="text-gray-500">Not set</span>;

        const expiryDate = new Date(dateString);
        const formattedDate = expiryDate.toLocaleDateString();

        if (isExpired(dateString)) {
            return (
                <div className="flex items-center">
                    <span className="text-red-600 font-medium">{formattedDate}</span>
                    <span className="ml-2 bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded">Expired</span>
                </div>
            );
        } else if (isExpiringSoon(dateString)) {
            return (
                <div className="flex items-center">
                    <span className="text-orange-600 font-medium">{formattedDate}</span>
                    <span className="ml-2 bg-orange-100 text-orange-800 text-xs px-2 py-0.5 rounded">Expiring soon</span>
                </div>
            );
        } else {
            return <span className="text-gray-800">{formattedDate}</span>;
        }
    };

    // Read-only field for expiry dates
    const ExpiryDateField = ({ label, value, name }) => (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            {editMode ? (
                <div className="relative">
                    <input
                        type="date"
                        name={name}
                        value={value || ''}
                        disabled
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <FaLock className="text-gray-400" />
                    </div>
                </div>
            ) : (
                formatExpiryDate(value)
            )}
        </div>
    );

    // Show a separate loading indicator when updating
    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <p>Loading vehicle details...</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto">
            {error && (
                <div className="bg-red-50 border border-red-200 p-4 rounded-md mb-4">
                    <div className="flex items-center">
                        <FaExclamationTriangle className="text-red-500 mr-2" />
                        <p className="text-red-700">{error}</p>
                    </div>
                </div>
            )}

            <div className="bg-white shadow rounded-lg">
                {/* Vehicle Header */}
                <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">{vehicleData.vehicleModel}</h1>
                        <p className="text-gray-500">{vehicleData.vehicleType} • {vehicleData.manufactureYear} </p>
                    </div>
                    <div>
                        {editMode ? (
                            <div className="flex space-x-3">
                                <button
                                    onClick={handleSave}
                                    className="flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-semibold hover:bg-orange-600 transition-colors"
                                    disabled={updateLoading}
                                >
                                    <FaSave className="mr-2" />
                                    {updateLoading ? "Saving..." : "Save Changes"}
                                </button>
                                <button
                                    onClick={handleCancel}
                                    className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-300 transition-colors"
                                    disabled={updateLoading}
                                >
                                    <FaTimes className="mr-2" /> Cancel
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setEditMode(true)}
                                className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-300 transition-colors"
                            >
                                <FaEdit className="mr-2" /> Edit Vehicle
                            </button>
                        )}
                    </div>
                </div>

                {/* Show update loading overlay */}
                {updateLoading && (
                    <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10">
                        <div className="text-center p-4 rounded-lg">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
                            <p className="mt-2 text-gray-700 font-medium">Updating vehicle details...</p>
                        </div>
                    </div>
                )}

                {/* Vehicle Images */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex flex-wrap -mx-2">
                        <div className="w-full md:w-1/2 px-2 mb-4">
                            <div className="relative">
                                <img
                                    src={vehicleImages.front}
                                    alt="Vehicle Front"
                                    className="w-full h-64 object-cover rounded-lg"
                                />
                                {editMode && (
                                    <button
                                        onClick={() => frontInputRef.current.click()}
                                        className="absolute bottom-3 right-3 bg-orange-500 text-white p-2 rounded-full hover:bg-orange-600 transition-colors"
                                    >
                                        <FaCamera size={16} />
                                    </button>
                                )}
                                <input
                                    type="file"
                                    ref={frontInputRef}
                                    onChange={(e) => handleImageChange('front', e)}
                                    accept="image/*"
                                    className="hidden"
                                />
                            </div>
                            <p className="text-sm text-gray-500 mt-1 text-center">Front View</p>
                        </div>
                        <div className="w-full md:w-1/2 px-2 mb-4">
                            <div className="relative">
                                <img
                                    src={vehicleImages.side}
                                    alt="Vehicle Side"
                                    className="w-full h-64 object-cover rounded-lg"
                                />
                                {editMode && (
                                    <button
                                        onClick={() => sideInputRef.current.click()}
                                        className="absolute bottom-3 right-3 bg-orange-500 text-white p-2 rounded-full hover:bg-orange-600 transition-colors"
                                    >
                                        <FaCamera size={16} />
                                    </button>
                                )}
                                <input
                                    type="file"
                                    ref={sideInputRef}
                                    onChange={(e) => handleImageChange('side', e)}
                                    accept="image/*"
                                    className="hidden"
                                />
                            </div>
                            <p className="text-sm text-gray-500 mt-1 text-center">Side View</p>
                        </div>
                    </div>
                </div>

                {/* Vehicle Details */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Basic Information */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold text-gray-800">Vehicle Information</h2>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Model</label>
                            {editMode ? (
                                <input
                                    type="text"
                                    name="vehicleModel"
                                    value={vehicleData.vehicleModel}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
                                />
                            ) : (
                                <p className="text-gray-800">{vehicleData.vehicleModel}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Type</label>
                            {editMode ? (
                                <select
                                    name="vehicleType"
                                    value={vehicleData.vehicleType}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                >
                                    <option>Motorbike</option>
                                    <option>Car</option>
                                    <option>Van</option>
                                    <option>Tuk/auto</option>
                                </select>
                            ) : (
                                <p className="text-gray-800">{vehicleData.vehicleType}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Year</label>
                            {editMode ? (
                                <input
                                    type="text"
                                    name="manufactureYear"
                                    value={vehicleData.manufactureYear}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            ) : (
                                <p className="text-gray-800">{vehicleData.manufactureYear}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">License Plate</label>
                            {editMode ? (
                                <input
                                    type="text"
                                    name="licensePlate"
                                    value={vehicleData.licensePlate}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            ) : (
                                <p className="text-gray-800">{vehicleData.licensePlate}</p>
                            )}
                        </div>
                    </div>

                    {/* Vehicle Documents */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-800">Maintenance & Documentation</h2>
                            {editMode && (
                                <div className="flex items-center text-sm text-gray-500">
                                    <FaInfoCircle className="mr-1" />
                                    <span>Expiry dates cannot be edited</span>
                                </div>
                            )}
                        </div>

                        {/* Notice about expired documents */}
                        {(isExpired(vehicleData.insuranceExpiry) ||
                            isExpired(vehicleData.revenueLicenseExpiry) ||
                            isExpired(vehicleData.driverLicenseExpiry) ||
                            isExpired(vehicleData.emissionTestExpiry)) && (
                                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <FaInfoCircle className="h-5 w-5 text-red-400" />
                                        </div>
                                        <div className="ml-3">
                                            <h3 className="text-sm font-medium text-red-800">
                                                Document(s) Expired
                                            </h3>
                                            <p className="text-sm text-red-700 mt-1">
                                                One or more of your documents have expired. Please upload updated documentation as soon as possible.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                        {/* Expiry date fields - all are non-editable */}
                        <ExpiryDateField
                            label="Insurance Expiry"
                            value={vehicleData.insuranceExpiry}
                            name="insuranceExpiry"
                        />

                        <ExpiryDateField
                            label="Vehicle Revenue License Expiry"
                            value={vehicleData.revenueLicenseExpiry}
                            name="revenueLicenseExpiry"
                        />

                        <ExpiryDateField
                            label="Driver License Expiry"
                            value={vehicleData.driverLicenseExpiry}
                            name="driverLicenseExpiry"
                        />

                        <ExpiryDateField
                            label="Vehicle Emission Test Expiry"
                            value={vehicleData.emissionTestExpiry}
                            name="emissionTestExpiry"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default VehicleContent;