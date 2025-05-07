import React, { useState } from 'react';
import { 
  PieChart, Pie, Cell, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  LineChart, Line, ResponsiveContainer
} from 'recharts';
import { 
  DollarSign, 
  TrendingUp, 
  CreditCard, 
  ShoppingBag, 
  Calendar, 
  Filter, 
  Download, 
  ArrowUpRight, 
  ArrowDownRight,
  Percent
} from 'lucide-react';

const Financials = () => {
  const [dateRange, setDateRange] = useState('This Month');
  const [activeTab, setActiveTab] = useState('overview');

  // Sample data for charts
  const revenueData = [
    { name: 'Jan', revenue: 24000 },
    { name: 'Feb', revenue: 26000 },
    { name: 'Mar', revenue: 32000 },
    { name: 'Apr', revenue: 28000 },
    { name: 'May', revenue: 35000 },
    { name: 'Jun', revenue: 42000 },
    { name: 'Jul', revenue: 40000 },
  ];

  const orderData = [
    { name: 'Mon', orders: 120 },
    { name: 'Tue', orders: 145 },
    { name: 'Wed', orders: 178 },
    { name: 'Thu', orders: 156 },
    { name: 'Fri', orders: 198 },
    { name: 'Sat', orders: 232 },
    { name: 'Sun', orders: 187 },
  ];

  const revenueSourceData = [
    { name: 'Food', value: 68 },
    { name: 'Delivery Fee', value: 15 },
    { name: 'Service Fee', value: 10 },
    { name: 'Promotions', value: 7 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const paymentData = [
    { name: 'Credit Card', value: 58 },
    { name: 'Debit Card', value: 23 },
    { name: 'Digital Wallet', value: 12 },
    { name: 'Cash', value: 7 },
  ];

  const PAYMENT_COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300'];

  const restaurantData = [
    { name: 'Tasty Burger', revenue: 42500, orders: 852 },
    { name: 'Pizza Palace', revenue: 38700, orders: 743 },
    { name: 'Sushi Express', revenue: 35200, orders: 621 },
    { name: 'Taco Time', revenue: 29800, orders: 542 },
    { name: 'Pasta Paradise', revenue: 26400, orders: 478 },
  ];

  const cards = [
    {
      title: 'Total Revenue',
      value: '$247,500',
      change: '+8.3%',
      positive: true,
      icon: <DollarSign className="text-green-500" />
    },
    {
      title: 'Average Order Value',
      value: '$32.45',
      change: '+2.1%',
      positive: true,
      icon: <ShoppingBag className="text-blue-500" />
    },
    {
      title: 'Processing Fees',
      value: '$12,350',
      change: '-1.2%',
      positive: false,
      icon: <CreditCard className="text-purple-500" />
    },
    {
      title: 'Restaurant Payouts',
      value: '$198,000',
      change: '+7.5%',
      positive: true,
      icon: <TrendingUp className="text-orange-500" />
    }
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Financial Dashboard</h1>
          <p className="text-gray-500 mt-1">Monitor your platform's financial performance</p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <select 
              className="px-4 py-2 bg-white border rounded-lg shadow-sm text-gray-700 appearance-none pr-8 cursor-pointer"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option>Today</option>
              <option>This Week</option>
              <option>This Month</option>
              <option>Last 3 Months</option>
              <option>This Year</option>
              <option>Custom Range</option>
            </select>
            <Calendar className="absolute right-2 top-2.5 h-4 w-4 text-gray-500 pointer-events-none" />
          </div>
          <button className="flex items-center px-4 py-2 bg-white border rounded-lg shadow-sm text-gray-700 hover:bg-gray-50">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </button>
          <button className="flex items-center px-4 py-2 bg-white border rounded-lg shadow-sm text-gray-700 hover:bg-gray-50">
            <Download className="mr-2 h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex space-x-8">
          <button 
            className={`px-1 py-4 text-sm font-medium border-b-2 ${activeTab === 'overview' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`px-1 py-4 text-sm font-medium border-b-2 ${activeTab === 'transactions' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            onClick={() => setActiveTab('transactions')}
          >
            Transactions
          </button>
          <button 
            className={`px-1 py-4 text-sm font-medium border-b-2 ${activeTab === 'restaurants' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            onClick={() => setActiveTab('restaurants')}
          >
            Restaurant Performance
          </button>
          <button 
            className={`px-1 py-4 text-sm font-medium border-b-2 ${activeTab === 'settlements' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            onClick={() => setActiveTab('settlements')}
          >
            Settlements
          </button>
        </nav>
      </div>

      {activeTab === 'overview' && (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {cards.map((card, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{card.title}</p>
                    <h3 className="text-2xl font-bold mt-1 text-gray-800">{card.value}</h3>
                  </div>
                  <div className="p-2 bg-gray-50 rounded-lg">{card.icon}</div>
                </div>
                <div className="mt-4 flex items-center">
                  <span className={`text-sm font-medium flex items-center ${card.positive ? 'text-green-600' : 'text-red-600'}`}>
                    {card.positive ? <ArrowUpRight className="h-4 w-4 mr-1" /> : <ArrowDownRight className="h-4 w-4 mr-1" />}
                    {card.change}
                  </span>
                  <span className="text-xs text-gray-500 ml-2">vs. last period</span>
                </div>
              </div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Revenue Chart */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Revenue Trend</h3>
                <div className="text-xs text-gray-500">Last 7 months</div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" />
                  <YAxis 
                    tickFormatter={tick => `$${tick/1000}k`} 
                    domain={[0, 'dataMax + 5000']} 
                  />
                  <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                  <Line type="monotone" dataKey="revenue" stroke="#0088FE" strokeWidth={2} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Orders Chart */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Daily Orders</h3>
                <div className="text-xs text-gray-500">Last 7 days</div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={orderData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 'dataMax + 20']} />
                  <Tooltip />
                  <Bar dataKey="orders" fill="#00C49F" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Revenue Sources & Payment Methods */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Revenue Sources */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Revenue Sources</h3>
              <div className="flex flex-col md:flex-row items-center justify-between">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={revenueSourceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {revenueSourceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 md:mt-0 flex flex-col gap-2">
                  {revenueSourceData.map((item, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                      <span className="text-sm text-gray-600">{item.name}: {item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Methods</h3>
              <div className="flex flex-col md:flex-row items-center justify-between">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={paymentData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {paymentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PAYMENT_COLORS[index % PAYMENT_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 md:mt-0 flex flex-col gap-2">
                  {paymentData.map((item, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: PAYMENT_COLORS[index % PAYMENT_COLORS.length] }}></div>
                      <span className="text-sm text-gray-600">{item.name}: {item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Top Performing Restaurants */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Performing Restaurants</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Restaurant</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg. Order Value</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {restaurantData.map((restaurant, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{restaurant.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${restaurant.revenue.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{restaurant.orders}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${(restaurant.revenue / restaurant.orders).toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full" 
                              style={{ width: `${(restaurant.revenue / 45000) * 100}%` }}
                            ></div>
                          </div>
                          <span className="ml-3 text-sm text-gray-500">{Math.round((restaurant.revenue / 45000) * 100)}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeTab === 'transactions' && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Transactions</h3>
          <p className="text-gray-500">Transaction details would be displayed here with filtering and pagination options.</p>
          {/* Transaction table would be implemented here */}
        </div>
      )}

      {activeTab === 'restaurants' && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Restaurant Financial Performance</h3>
          <p className="text-gray-500">Detailed restaurant financial metrics would be displayed here.</p>
          {/* Restaurant performance data would be implemented here */}
        </div>
      )}

      {activeTab === 'settlements' && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Settlements</h3>
          <p className="text-gray-500">Settlement reports and schedules would be displayed here.</p>
          {/* Settlement data would be implemented here */}
        </div>
      )}
    </div>
  );
};

export default Financials;