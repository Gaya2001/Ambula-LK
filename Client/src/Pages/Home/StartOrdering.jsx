import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function StartOrdering() {
  const [hovered, setHovered] = useState(null);
  const navigate = useNavigate();
  
  const features = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-orange-500">
          <path d="M10.5 1.875a1.125 1.125 0 0 1 2.25 0v8.25a.75.75 0 0 0 1.5 0V4.5a3.75 3.75 0 1 1 7.5 0v8.25a.75.75 0 0 0 1.5 0V4.5a5.25 5.25 0 1 0-10.5 0v5.625a.75.75 0 0 0 1.5 0v-5.625Z" />
        </svg>
      ),
      title: 'Simple 3-Step Ordering',
      description: 'Select your favorite meals, add to cart, and complete checkout in under a minute - it s simple'
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-orange-500">
          <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM9.763 9.51a2.25 2.25 0 0 1 3.828-1.351.75.75 0 0 0 1.06-1.06 3.75 3.75 0 1 0-1.413 6.962.75.75 0 1 0-.6-1.375 2.25 2.25 0 0 1-3.875-2.876Z" clipRule="evenodd" />
        </svg>
      ),
      title: 'Fresh, Delicious Food',
      description: 'Enjoy restaurant-quality meals made from locally sourced ingredients, prepared fresh daily by our expert chefs.'
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-orange-500">
          <path d="M3.375 4.5C2.339 4.5 1.5 5.34 1.5 6.375V13.5h12V6.375c0-1.036-.84-1.875-1.875-1.875h-8.25ZM13.5 15h-12v2.625c0 1.035.84 1.875 1.875 1.875h8.25c1.035 0 1.875-.84 1.875-1.875V15Z" />
          <path d="M6.75 7.5l.75-.75A3.375 3.375 0 0 1 10.875 3c1.394 0 2.634.777 3.375 2.25m-4.125 7.5l.75.75A3.375 3.375 0 0 0 10.875 21c1.394 0 2.634-.777 3.375-2.25M16.5 15h1.125c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H16.5v3.75Z" />
        </svg>
      ),
      title: 'Speedy 30-Min Delivery',
      description: 'Your delicious meal delivered right to your doorstep in 30 minutes or less, with real-time tracking available.'
    }
  ];

  return (
    <div className="bg-gradient-to-br  flex justify-center mx-auto mt-8 max-w-screen-xl px-4 py-16 md:py-24 rounded-lg shadow-md">
      <div className="w-full max-w-6xl bg-white shadow-xl rounded-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Features Section */}
        <div className="w-full md:w-1/2 p-6 md:p-10 space-y-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 border-b border-orange-200 pb-2">Why Choose Us</h3>
          
          {features.map((feature, index) => (
            <div 
              key={index} 
              className={`flex items-start space-x-4 p-4 rounded-lg transition-all duration-300 ${hovered === index ? 'bg-orange-50 transform scale-105' : 'hover:bg-orange-50'}`}
              onMouseEnter={() => setHovered(index)}
              onMouseLeave={() => setHovered(null)}
            >
              <div className="flex-shrink-0 bg-orange-100 p-3 rounded-full">{feature.icon}</div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm md:text-base">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Right Section */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-gray-50 to-orange-50 p-6 md:p-10 flex flex-col justify-center border-l border-orange-100">
          <span className="text-orange-600 font-medium mb-2">READY TO START?</span>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Delicious Food Awaits You
          </h2>

          <p className="text-gray-700 mb-4">
            Join thousands of satisfied customers who enjoy our delicious meals delivered right to their doorstep. Sign up now and get 15% off your first order!
          </p>
          
          <div className="bg-orange-100 p-4 rounded-lg mb-6 border-l-4 border-orange-500">
            <p className="text-sm font-medium text-gray-800">
              "The ordering process was so simple, and the food arrived hot and fresh. Definitely my go-to food delivery service!" - Sarah T.
            </p>
          </div>
          
          <div className="space-y-3 md:space-y-0 md:flex md:space-x-4">
            <button 
              onClick={() => navigate('/register')}
              className="w-full md:w-auto bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium flex items-center justify-center"
            >
              <span>Create Account</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            <button 
              onClick={() => navigate('/restaurants')}
              className="w-full md:w-auto bg-white border-2 border-orange-500 text-orange-500 px-6 py-3 rounded-lg hover:bg-orange-50 transition-colors font-medium"
            >
              Browse Menu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


export default StartOrdering;