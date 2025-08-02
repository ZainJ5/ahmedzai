"use client";

import React from 'react';
import { 
  FaCar, 
  FaUsers, 
  FaMoneyBillWave, 
  FaChartLine, 
  FaEye, 
  FaExclamationTriangle,
  FaPlusCircle,
  FaListAlt,
  FaChartBar,
  FaCog
} from 'react-icons/fa';

export default function Dashboard() {
  // Mock data
  const stats = [
    { title: 'Total Cars', value: '1,254', icon: <FaCar />, color: 'bg-blue-500' },
    { title: 'Registered Users', value: '5,423', icon: <FaUsers />, color: 'bg-green-500' },
    { title: 'Total Sales', value: '$245,890', icon: <FaMoneyBillWave />, color: 'bg-purple-500' },
    { title: 'Monthly Views', value: '28,419', icon: <FaChartLine />, color: 'bg-orange-500' },
  ];

  const recentCars = [
    { id: 1, name: 'Toyota Corolla', price: '$12,500', status: 'Available', added: '2025-07-24', views: 45 },
    { id: 2, name: 'Honda Civic', price: '$14,200', status: 'Available', added: '2025-07-23', views: 67 },
    { id: 3, name: 'Suzuki Swift', price: '$8,500', status: 'Sold', added: '2025-07-22', views: 38 },
    { id: 4, name: 'Nissan X-Trail', price: '$18,900', status: 'Available', added: '2025-07-20', views: 92 },
    { id: 5, name: 'Toyota Prado', price: '$32,500', status: 'Reserved', added: '2025-07-19', views: 120 },
  ];

  const alerts = [
    { message: 'Low stock alert: Only 3 Toyota Corollas left', type: 'warning', time: '2 hours ago' },
    { message: 'New customer registration: John Doe', type: 'info', time: '4 hours ago' },
    { message: 'Payment failed: Invoice #12345', type: 'error', time: '1 day ago' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
        <p className="text-gray-500 text-sm">Last updated: {new Date().toLocaleString()}</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
                <h3 className="text-2xl font-bold mt-2">{stat.value}</h3>
              </div>
              <div className={`${stat.color} text-white p-3 rounded-full shadow-md`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Car Listings */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="border-b border-gray-100 px-6 py-4 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">Recent Car Listings</h2>
            <button className="text-primary hover:text-primary-dark transition text-sm font-medium flex items-center">
              View All <span className="ml-1">→</span>
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Car</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Added</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentCars.map((car) => (
                  <tr key={car.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{car.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{car.price}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${car.status === 'Available' ? 'bg-green-100 text-green-800' : 
                          car.status === 'Sold' ? 'bg-red-100 text-red-800' : 
                          'bg-yellow-100 text-yellow-800'}`}
                      >
                        {car.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{car.added}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex items-center">
                      <FaEye className="text-gray-400 mr-1" /> {car.views}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Alerts & Notifications */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="border-b border-gray-100 px-6 py-4 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">Alerts & Notifications</h2>
            <button className="text-primary hover:text-primary-dark transition text-sm font-medium flex items-center">
              View All <span className="ml-1">→</span>
            </button>
          </div>
          
          <div className="p-6 space-y-4">
            {alerts.map((alert, index) => (
              <div key={index} className={`p-4 rounded-lg border-l-4 
                ${alert.type === 'warning' ? 'bg-yellow-50 border-yellow-400' : 
                  alert.type === 'error' ? 'bg-red-50 border-red-400' : 
                  'bg-blue-50 border-blue-400'}`}
              >
                <div className="flex">
                  <div className={`flex-shrink-0 
                    ${alert.type === 'warning' ? 'text-yellow-400' : 
                      alert.type === 'error' ? 'text-red-400' : 
                      'text-blue-400'}`}
                  >
                    <FaExclamationTriangle />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-700 font-medium">{alert.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 rounded-lg bg-primary-50 text-primary flex flex-col items-center justify-center transition hover:bg-primary hover:text-white group">
            <FaPlusCircle className="text-xl mb-2 group-hover:text-white" />
            <span className="text-sm font-medium">Add New Car</span>
          </button>
          <button className="p-4 rounded-lg bg-primary-50 text-primary flex flex-col items-center justify-center transition hover:bg-primary hover:text-white group">
            <FaListAlt className="text-xl mb-2 group-hover:text-white" />
            <span className="text-sm font-medium">Manage Listings</span>
          </button>
          <button className="p-4 rounded-lg bg-primary-50 text-primary flex flex-col items-center justify-center transition hover:bg-primary hover:text-white group">
            <FaChartBar className="text-xl mb-2 group-hover:text-white" />
            <span className="text-sm font-medium">View Reports</span>
          </button>
          <button className="p-4 rounded-lg bg-primary-50 text-primary flex flex-col items-center justify-center transition hover:bg-primary hover:text-white group">
            <FaCog className="text-xl mb-2 group-hover:text-white" />
            <span className="text-sm font-medium">System Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
}