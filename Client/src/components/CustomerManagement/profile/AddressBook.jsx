import React, { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaBuilding, FaSuitcase, FaHome, FaHeart, FaPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';
import PaymentService from '../../../services/payment-service';

const PaymentAddressBook = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    addressType: 'Home',
    streetAddress: '',
    city: '',
    country: 'Sri Lanka',
    postalCode: '',
    phone: '',
    isDefault: false
  });
  const [isEditing, setIsEditing] = useState(false);

  // Icons for different address types
  const addressIcons = {
    Home: <FaHome className="w-5 h-5" />,
    Work: <FaBuilding className="w-5 h-5" />,
    Office: <FaSuitcase className="w-5 h-5" />,
    Favorite: <FaHeart className="w-5 h-5" />,
    Other: <FaMapMarkerAlt className="w-5 h-5" />,
    Delivery: <FaMapMarkerAlt className="w-5 h-5" />
  };

  // Fetch addresses from payment history
  useEffect(() => {
    fetchPaymentAddresses();
  }, []);

  const fetchPaymentAddresses = async () => {
    setLoading(true);
    try {
      // Get payment history for the customer
      const response = await PaymentService.getCustomerPayments();

      if (response.data && response.data.payments) {
        // Extract unique addresses from payment history
        const paymentAddresses = extractUniqueAddresses(response.data.payments);
        setAddresses(paymentAddresses);
      } else {
        throw new Error(response.data?.message || 'Failed to load addresses');
      }
    } catch (err) {
      console.error('Error fetching payment addresses:', err);
      setError(err.message || 'Something went wrong while loading your addresses');
    } finally {
      setLoading(false);
    }
  };

  // Extract unique addresses from payment history
  const extractUniqueAddresses = (payments) => {
    const uniqueAddresses = {};
    const addressList = [];

    payments.forEach(payment => {
      if (payment.customerDetails) {
        const { address, city, country, postalCode, phone } = payment.customerDetails;

        // Create a unique key for this address
        const addressKey = `${address}-${city}-${country}`;

        // If this address hasn't been added yet
        if (!uniqueAddresses[addressKey] && address) {
          const addressObj = {
            id: addressList.length + 1, // Generate a unique ID
            addressType: 'Home', // Default type
            streetAddress: address,
            city: city || '',
            country: country || 'Sri Lanka',
            postalCode: postalCode || '',
            phone: phone || '',
            isDefault: addressList.length === 0, // First address is default
            orderId: payment.orderId // Reference to the original order
          };

          uniqueAddresses[addressKey] = true;
          addressList.push(addressObj);
        }
      }

      // Check for delivery details as well (might contain different addresses)
      if (payment.deliveryDetails) {
        const { address, city, country, postalCode, phone } = payment.deliveryDetails;

        const addressKey = `${address}-${city}-${country}`;

        if (!uniqueAddresses[addressKey] && address) {
          const addressObj = {
            id: addressList.length + 1,
            addressType: 'Delivery',
            streetAddress: address,
            city: city || '',
            country: country || 'Sri Lanka',
            postalCode: postalCode || '',
            phone: phone || '',
            isDefault: addressList.length === 0,
            orderId: payment.orderId
          };

          uniqueAddresses[addressKey] = true;
          addressList.push(addressObj);
        }
      }
    });

    return addressList;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      const userId = userData.id;

      if (!userId) {
        toast.error('Please log in to manage addresses');
        return;
      }

      if (isEditing) {
        // Update existing address
        const updatedAddresses = addresses.map(addr =>
          addr.id === formData.addressId
            ? {
                ...addr,
                addressType: formData.addressType,
                streetAddress: formData.streetAddress,
                city: formData.city,
                country: formData.country,
                postalCode: formData.postalCode,
                phone: formData.phone,
                isDefault: formData.isDefault
              }
            : formData.isDefault ? { ...addr, isDefault: false } : addr
        );

        setAddresses(updatedAddresses);
        toast.success('Address updated successfully');
      } else {
        // Create a new orderId for this address to be used with regenerate coordinates
        const orderId = `addr_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

        // Create a payment record with this address to store coordinates
        const paymentData = {
          orderId,
          customerId: userId,
          restaurantId: "placeholder",
          amount: 0, // Placeholder value
          items: [{ name: "Address Registration", price: 0, quantity: 1 }],
          customerDetails: {
            firstName: userData.firstName || "Customer",
            lastName: userData.lastName || "User",
            email: userData.email || "",
            phone: formData.phone,
            address: formData.streetAddress,
            city: formData.city,
            country: formData.country,
            postalCode: formData.postalCode
          }
        };

        await PaymentService.initializePayment(paymentData);

        // Optionally, trigger geocoding for this address
        await PaymentService.regenerateCoordinates(orderId);

        // Add the new address to the list
        const newAddress = {
          id: addresses.length + 1,
          addressType: formData.addressType,
          streetAddress: formData.streetAddress,
          city: formData.city,
          country: formData.country,
          postalCode: formData.postalCode,
          phone: formData.phone,
          isDefault: formData.isDefault,
          orderId: orderId // Store the reference to the new order ID
        };

        // Update addresses list
        const updatedAddresses = [...addresses];

        // If the new address is set as default, update existing addresses
        if (formData.isDefault) {
          updatedAddresses.forEach(addr => {
            addr.isDefault = false;
          });
        }

        updatedAddresses.push(newAddress);
        setAddresses(updatedAddresses);
        toast.success('Address added successfully');
      }

      // Reset form and close it
      resetForm();
      setShowAddForm(false);

    } catch (err) {
      console.error('Error managing address:', err);
      toast.error(err.message || 'Failed to save address');
    }
  };

  const resetForm = () => {
    setFormData({
      addressType: 'Home',
      streetAddress: '',
      city: '',
      country: 'Sri Lanka',
      postalCode: '',
      phone: '',
      isDefault: false
    });
    setIsEditing(false);
  };

  const handleSetDefault = async (addressId) => {
    // Update all addresses to set the current one as default
    const updatedAddresses = addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === addressId
    }));

    setAddresses(updatedAddresses);
    toast.success('Default address updated');
  };

  const handleDelete = async (addressId) => {
    if (!window.confirm('Are you sure you want to remove this address?')) {
      return;
    }

    // Filter out the address to delete
    const updatedAddresses = addresses.filter(addr => addr.id !== addressId);

    // If we deleted the default address and others remain, set a new default
    if (addresses.find(a => a.id === addressId)?.isDefault && updatedAddresses.length > 0) {
      updatedAddresses[0].isDefault = true;
    }

    setAddresses(updatedAddresses);
    toast.success('Address removed from your list');
  };

  const handleEdit = (address) => {
    setFormData({
      addressId: address.id,
      addressType: address.addressType,
      streetAddress: address.streetAddress,
      city: address.city,
      country: address.country,
      postalCode: address.postalCode,
      phone: address.phone,
      isDefault: address.isDefault
    });
    setIsEditing(true);
    setShowAddForm(true);
  };

  const handleCancel = () => {
    resetForm();
    setShowAddForm(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-6 text-white rounded-lg shadow-lg min-h-64 bg-blue-950 bg-opacity-80 backdrop-blur-sm">
        <div className="inline-block w-8 h-8 border-4 rounded-full border-amber-500 border-t-transparent animate-spin"></div>
        <p className="ml-3 text-blue-200">Loading your addresses...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 rounded-lg shadow-lg bg-blue-950 bg-opacity-80 backdrop-blur-sm">
        <div className="p-4 text-red-200 bg-red-900 bg-opacity-50 rounded-md">
          <p>{error}</p>
          <button
            onClick={() => fetchPaymentAddresses()}
            className="px-4 py-2 mt-3 text-sm text-white bg-red-700 rounded hover:bg-red-800"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

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
            <div className="relative z-10 flex flex-col p-8">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-white">My Addresses</h2>
                <button
                  onClick={() => {
                    resetForm();
                    setShowAddForm(!showAddForm);
                  }}
                  className="flex items-center px-4 py-2 text-white transition-colors rounded-md bg-amber-500 hover:bg-amber-600"
                >
                  <FaPlus className="mr-2" />
                  {showAddForm ? 'Cancel' : 'Add New Address'}
                </button>
              </div>
              <p className="mt-2 text-amber-400">Manage your delivery locations</p>
            </div>
          </div>
          
          {/* Main content area */}
          <div className="p-6 shadow-2xl bg-blue-950 bg-opacity-80 backdrop-blur-sm rounded-b-2xl">
            {showAddForm && (
              <div className="p-4 mb-6 bg-blue-900 border border-blue-800 rounded-lg bg-opacity-40">
                <h3 className="mb-4 text-lg font-medium text-amber-400">
                  {isEditing ? 'Edit Address' : 'Add New Address'}
                </h3>
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="block mb-1 text-sm font-medium text-blue-200">Address Type</label>
                      <select
                        name="addressType"
                        value={formData.addressType}
                        onChange={handleInputChange}
                        className="w-full p-2 text-white bg-blue-800 bg-opacity-50 border border-blue-700 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                        required
                      >
                        <option value="Home">Home</option>
                        <option value="Work">Work</option>
                        <option value="Office">Office</option>
                        <option value="Favorite">Favorite</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block mb-1 text-sm font-medium text-blue-200">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full p-2 text-white bg-blue-800 bg-opacity-50 border border-blue-700 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                        placeholder="+94 71 234 5678"
                        required
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block mb-1 text-sm font-medium text-blue-200">Street Address</label>
                      <input
                        type="text"
                        name="streetAddress"
                        value={formData.streetAddress}
                        onChange={handleInputChange}
                        className="w-full p-2 text-white bg-blue-800 bg-opacity-50 border border-blue-700 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                        placeholder="123 Palm Grove"
                        required
                      />
                    </div>

                    <div>
                      <label className="block mb-1 text-sm font-medium text-blue-200">City</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full p-2 text-white bg-blue-800 bg-opacity-50 border border-blue-700 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                        placeholder="Colombo"
                        required
                      />
                    </div>

                    <div>
                      <label className="block mb-1 text-sm font-medium text-blue-200">Postal Code</label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        className="w-full p-2 text-white bg-blue-800 bg-opacity-50 border border-blue-700 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                        placeholder="10100"
                      />
                    </div>

                    <div>
                      <label className="block mb-1 text-sm font-medium text-blue-200">Country</label>
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className="w-full p-2 text-white bg-blue-800 bg-opacity-50 border border-blue-700 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      >
                        <option value="Sri Lanka">Sri Lanka</option>
                        <option value="India">India</option>
                        <option value="Maldives">Maldives</option>
                      </select>
                    </div>

                    <div className="flex items-center md:col-span-2">
                      <input
                        type="checkbox"
                        id="isDefault"
                        name="isDefault"
                        checked={formData.isDefault}
                        onChange={handleInputChange}
                        className="w-4 h-4 border-blue-700 rounded text-amber-600 focus:ring-amber-500"
                      />
                      <label htmlFor="isDefault" className="ml-2 text-sm text-blue-200">
                        Set as default delivery address
                      </label>
                    </div>

                    <div className="flex justify-end gap-3 md:col-span-2">
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="px-4 py-2 text-blue-200 transition-colors bg-blue-800 border border-blue-700 rounded-md hover:bg-blue-700"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 text-white transition-colors rounded-md bg-amber-500 hover:bg-amber-600"
                      >
                        {isEditing ? 'Update Address' : 'Save Address'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}

            {addresses.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center bg-blue-900 border-2 border-blue-800 border-dashed rounded-lg bg-opacity-30">
                <FaMapMarkerAlt className="w-12 h-12 mb-3 text-blue-300" />
                <h3 className="mb-2 text-lg font-medium text-blue-100">No addresses found</h3>
                <p className="mb-4 text-blue-300">You haven't added any delivery addresses yet.</p>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="px-4 py-2 text-white transition-colors rounded-md bg-amber-500 hover:bg-amber-600"
                >
                  Add Your First Address
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {addresses.map((address) => (
                  <div
                    key={address.id}
                    className={`border rounded-lg ${
                      address.isDefault
                        ? "border-2 border-amber-500 bg-blue-900 bg-opacity-50"
                        : "border border-blue-800 bg-blue-900 bg-opacity-30"
                    }`}
                  >
                    <div className="flex flex-col p-4 md:flex-row md:items-center md:justify-between">
                      <div className="flex items-center">
                        <div className={`p-2 mr-4 text-white rounded-full ${
                          address.isDefault ? "bg-amber-500" : "bg-blue-700"
                        }`}>
                          {addressIcons[address.addressType] || <FaMapMarkerAlt className="w-5 h-5" />}
                        </div>
                        <div>
                          <div className="flex items-center">
                            <p className="font-medium text-white">{address.addressType}</p>
                            {address.isDefault && (
                              <span className="px-2 py-0.5 ml-2 text-xs rounded-full bg-amber-600 text-amber-100">
                                Default
                              </span>
                            )}
                            {address.orderId && address.orderId.startsWith('addr_') && (
                              <span className="px-2 py-0.5 ml-2 text-xs rounded-full bg-blue-600 text-blue-100">
                                New
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-blue-200">{address.streetAddress}, {address.city}</p>
                          <p className="text-sm text-blue-200">{address.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-center mt-4 space-x-2 md:mt-0">
                        {!address.isDefault && (
                          <button
                            onClick={() => handleSetDefault(address.id)}
                            className="px-3 py-1 text-sm transition-colors border rounded-md text-amber-300 border-amber-500 hover:bg-amber-900 hover:bg-opacity-30"
                          >
                            Set as Default
                          </button>
                        )}
                        <button
                          onClick={() => handleEdit(address)}
                          className="px-3 py-1 text-sm text-blue-200 transition-colors border border-blue-600 rounded-md hover:bg-blue-800"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(address.id)}
                          className="px-3 py-1 text-sm text-red-300 transition-colors border border-red-700 rounded-md hover:bg-red-900 hover:bg-opacity-30"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentAddressBook;