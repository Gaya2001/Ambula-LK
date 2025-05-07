import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Phone, MapPin, Clock, LogOut, Edit, Save, X } from "lucide-react";
import logo1 from "../../../assets/Customer/c1.png";
import customerService from "../../../services/customer-service";

const CustomerProfile = ({ setCustomerData: setDashboardCustomerData, customerData: initialCustomerData }) => {
  const [customerData, setCustomerData] = useState(initialCustomerData || null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(!initialCustomerData);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    username: "",
    phone: "",
    password: "",
    delivery_address: "",
    city: "",
    postal_code: "",
  });

  const openEditModal = () => {
    if (!customerData) return;
    
    setFormData({
      first_name: customerData.first_name || "",
      last_name: customerData.last_name || "",
      email: customerData.email || "",
      username: customerData.username || "",
      phone: customerData.phone || "",
      password: "", // Empty by default
      delivery_address: customerData.delivery_address || "",
      city: customerData.city || "",
      postal_code: customerData.postal_code || "",
    });
    setShowEditModal(true);
    setUpdateSuccess(false);
    setError(null);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    setError(null);

    try {
      // Create a clean update object with only the properties that have values
      const updateData = {};
      Object.keys(formData).forEach(key => {
        // Include all fields except empty password
        if (key === 'password' && !formData[key]) {
          return; // Skip empty password
        }
        updateData[key] = formData[key];
      });

      const response = await customerService.updateCustomerProfile(updateData);

      if (response.data && response.data.customer) {
        setCustomerData(response.data.customer);
        if (setDashboardCustomerData) {
          setDashboardCustomerData(response.data.customer);
        }
        setUpdateSuccess(true);
        setTimeout(() => {
          setShowEditModal(false);
          setUpdateSuccess(false);
        }, 1500);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Update error:", error);
      setError(error.response?.data?.message || "Update failed. Please try again.");
    } finally {
      setUpdateLoading(false);
    }
  };

  useEffect(() => {
    // If customerData was passed as a prop, use it
    if (initialCustomerData) {
      setCustomerData(initialCustomerData);
      setLoading(false);
      return;
    }

    const fetchCustomerData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await customerService.getCustomerProfile();

        if (response.data && response.data.customer) {
          setCustomerData(response.data.customer);
          if (setDashboardCustomerData) {
            setDashboardCustomerData(response.data.customer);
          }
        } else {
          throw new Error("Invalid response format");
        }
      } catch (error) {
        console.error("Profile fetch error:", error);
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          setError("Failed to load profile data. Please refresh the page.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, [navigate, setDashboardCustomerData, initialCustomerData]);

  if (error && !showEditModal) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-900 to-black">
        <div className="p-6 bg-red-900 border border-red-800 rounded-lg shadow-lg bg-opacity-30">
          <p className="font-medium text-red-200">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 mt-4 text-white bg-red-800 rounded-md hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (loading || !customerData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-900 to-black">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto border-4 rounded-full border-t-amber-500 border-b-transparent border-l-transparent border-r-transparent animate-spin"></div>
          <p className="mt-4 text-lg text-gray-300">Loading your profile...</p>
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
            
            {/* Profile header content */}
            <div className="relative z-10 flex flex-col items-center gap-8 p-8 md:flex-row">
              <div className="flex-shrink-0">
                <div className="w-32 h-32 overflow-hidden border-4 rounded-full shadow-lg border-amber-500">
                  <img
                    src={customerData.profile_image || logo1}
                    alt="Profile"
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-3xl font-bold text-white">
                  {customerData.first_name} {customerData.last_name}
                </h2>
                <p className="text-lg text-amber-400">@{customerData.username}</p>
                
                <div className="flex flex-wrap justify-center gap-2 mt-3 md:justify-start">
                  
                  <span className="px-3 py-1 text-sm bg-blue-800 bg-opacity-50 rounded-full">
                    Member since {new Date(customerData.created_at || customerData.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-col gap-3 mt-4 md:flex-row md:mt-0">
                <button
                  onClick={openEditModal}
                  className="flex items-center justify-center gap-2 px-4 py-2 text-white transition rounded-lg shadow-lg bg-amber-600 hover:bg-amber-500"
                >
                  <Edit size={18} />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => {
                    localStorage.removeItem("token");
                    navigate("/login");
                  }}
                  className="flex items-center justify-center gap-2 px-4 py-2 text-white transition bg-red-700 rounded-lg shadow-lg hover:bg-red-600"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Main content with tabs */}
          <div className="shadow-2xl bg-blue-950 bg-opacity-80 backdrop-blur-sm rounded-b-2xl">
            <div className="border-b border-blue-800">
              <div className="flex p-2 space-x-1 overflow-x-auto">
                <button
                  onClick={() => setActiveTab("personal")}
                  className={`px-4 py-2 rounded-t-lg font-medium transition ${
                    activeTab === "personal"
                      ? "bg-blue-700 text-white"
                      : "bg-transparent text-blue-300 hover:bg-blue-800"
                  }`}
                >
                  Personal Info
                </button>
                <button
                  onClick={() => setActiveTab("contact")}
                  className={`px-4 py-2 rounded-t-lg font-medium transition ${
                    activeTab === "contact"
                      ? "bg-blue-700 text-white"
                      : "bg-transparent text-blue-300 hover:bg-blue-800"
                  }`}
                >
                  Contact & Address
                </button>
                <button
                  onClick={() => setActiveTab("account")}
                  className={`px-4 py-2 rounded-t-lg font-medium transition ${
                    activeTab === "account"
                      ? "bg-blue-700 text-white"
                      : "bg-transparent text-blue-300 hover:bg-blue-800"
                  }`}
                >
                  Account
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {/* Personal Info Tab */}
              {activeTab === "personal" && (
                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-xl font-semibold text-amber-400">
                    <User size={20} />
                    <h3>Personal Information</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="p-4 bg-blue-900 rounded-lg bg-opacity-40">
                      <p className="mb-1 text-sm text-blue-300">FIRST NAME</p>
                      <p className="font-medium text-white">{customerData.first_name}</p>
                    </div>
                    
                    <div className="p-4 bg-blue-900 rounded-lg bg-opacity-40">
                      <p className="mb-1 text-sm text-blue-300">LAST NAME</p>
                      <p className="font-medium text-white">{customerData.last_name}</p>
                    </div>
                    
                    <div className="p-4 bg-blue-900 rounded-lg bg-opacity-40">
                      <p className="mb-1 text-sm text-blue-300">EMAIL</p>
                      <div className="flex items-center gap-2">
                        <Mail size={16} className="text-blue-300" />
                        <p className="font-medium text-white">{customerData.email}</p>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-blue-900 rounded-lg bg-opacity-40">
                      <p className="mb-1 text-sm text-blue-300">USERNAME</p>
                      <p className="font-medium text-white">@{customerData.username}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Contact & Address Tab */}
              {activeTab === "contact" && (
                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-xl font-semibold text-amber-400">
                    <MapPin size={20} />
                    <h3>Contact & Address</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="p-4 bg-blue-900 rounded-lg bg-opacity-40">
                      <p className="mb-1 text-sm text-blue-300">PHONE</p>
                      <div className="flex items-center gap-2">
                        <Phone size={16} className="text-blue-300" />
                        <p className="font-medium text-white">{customerData.phone || "No phone set"}</p>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-blue-900 rounded-lg bg-opacity-40">
                      <p className="mb-1 text-sm text-blue-300">DELIVERY ADDRESS</p>
                      <p className="font-medium text-white">{customerData.delivery_address || "No address set"}</p>
                    </div>
                    
                    <div className="p-4 bg-blue-900 rounded-lg bg-opacity-40">
                      <p className="mb-1 text-sm text-blue-300">CITY</p>
                      <p className="font-medium text-white">{customerData.city || "No city set"}</p>
                    </div>
                    
                    <div className="p-4 bg-blue-900 rounded-lg bg-opacity-40">
                      <p className="mb-1 text-sm text-blue-300">POSTAL CODE</p>
                      <p className="font-medium text-white">{customerData.postal_code || "No postal code set"}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Account Tab */}
              {activeTab === "account" && (
                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-xl font-semibold text-amber-400">
                    <Clock size={20} />
                    <h3>Account Information</h3>
                  </div>
                  
                  <div className="p-5 bg-blue-900 rounded-lg bg-opacity-40">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div>
                        <p className="mb-1 text-sm text-blue-300">MEMBER SINCE</p>
                        <p className="font-medium text-white">{new Date(customerData.created_at || customerData.createdAt).toLocaleDateString()}</p>
                      </div>
                      
                      <div>
                        <p className="mb-1 text-sm text-blue-300">ACCOUNT STATUS</p>
                        <div className="flex items-center gap-2">
                          <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                          <p className="font-medium text-white">Active</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-6 mt-6 border-t border-blue-800">
                      <button
                        onClick={openEditModal}
                        className="flex items-center gap-2 px-4 py-2 text-white transition rounded-lg bg-amber-600 hover:bg-amber-500"
                      >
                        <Edit size={18} />
                        Edit Profile
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit modal with modern design */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm">
          <div className="bg-gradient-to-b from-blue-900 to-indigo-950 text-white shadow-2xl rounded-2xl max-h-[90vh] w-[90%] max-w-lg overflow-hidden flex flex-col">
            <div className="sticky top-0 z-10 flex items-center justify-between p-5 bg-blue-900 border-b border-blue-800">
              <h2 className="flex items-center gap-2 text-xl font-bold text-amber-400">
                <Edit size={20} />
                Edit Profile
              </h2>
              <button 
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 transition hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            {updateSuccess && (
              <div className="flex items-center gap-2 p-3 mx-5 mt-4 text-green-200 bg-green-900 bg-opacity-50 border border-green-700 rounded-md">
                <div className="flex items-center justify-center w-6 h-6 bg-green-500 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p>Profile updated successfully!</p>
              </div>
            )}

            {error && (
              <div className="p-3 mx-5 mt-4 text-red-200 bg-red-900 bg-opacity-50 border border-red-700 rounded-md">
                {error}
              </div>
            )}

            <div className="flex-1 p-5 overflow-y-auto">
              <form onSubmit={handleUpdate}>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="block mb-1 text-sm text-blue-300">FIRST NAME</label>
                      <input
                        name="first_name"
                        type="text"
                        value={formData.first_name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 text-white bg-blue-900 bg-opacity-50 border border-blue-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-sm text-blue-300">LAST NAME</label>
                      <input
                        name="last_name"
                        type="text"
                        value={formData.last_name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 text-white bg-blue-900 bg-opacity-50 border border-blue-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block mb-1 text-sm text-blue-300">EMAIL</label>
                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 text-white bg-blue-900 bg-opacity-50 border border-blue-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block mb-1 text-sm text-blue-300">USERNAME</label>
                    <input
                      name="username"
                      type="text"
                      value={formData.username}
                      onChange={handleChange}
                      className="w-full px-4 py-2 text-white bg-blue-900 bg-opacity-50 border border-blue-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block mb-1 text-sm text-blue-300">PHONE</label>
                    <input
                      name="phone"
                      type="text"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 text-white bg-blue-900 bg-opacity-50 border border-blue-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block mb-1 text-sm text-blue-300">
                      PASSWORD <span className="text-gray-400">(Leave blank to keep unchanged)</span>
                    </label>
                    <input
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-2 text-white bg-blue-900 bg-opacity-50 border border-blue-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block mb-1 text-sm text-blue-300">DELIVERY ADDRESS</label>
                    <input
                      name="delivery_address"
                      type="text"
                      value={formData.delivery_address}
                      onChange={handleChange}
                      className="w-full px-4 py-2 text-white bg-blue-900 bg-opacity-50 border border-blue-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="block mb-1 text-sm text-blue-300">CITY</label>
                      <input
                        name="city"
                        type="text"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full px-4 py-2 text-white bg-blue-900 bg-opacity-50 border border-blue-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-sm text-blue-300">POSTAL CODE</label>
                      <input
                        name="postal_code"
                        type="text"
                        value={formData.postal_code}
                        onChange={handleChange}
                        className="w-full px-4 py-2 text-white bg-blue-900 bg-opacity-50 border border-blue-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>
                </div>
              </form>
            </div>
            
            <div className="sticky bottom-0 z-10 flex justify-end gap-4 p-5 bg-blue-900 border-t border-blue-800">
              <button
                type="button"
                className="flex items-center gap-1 px-4 py-2 text-white transition bg-gray-700 rounded-lg hover:bg-gray-600"
                onClick={() => setShowEditModal(false)}
                disabled={updateLoading}
              >
                <X size={18} />
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="flex items-center gap-1 px-4 py-2 text-white transition rounded-lg bg-amber-600 hover:bg-amber-500 disabled:bg-amber-800 disabled:opacity-50"
                disabled={updateLoading}
              >
                {updateLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerProfile;