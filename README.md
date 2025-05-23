<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
 
</head>
<body>

  <h1>🍽️ Cloud-Native Food Ordering & Delivery Platform</h1>
  
  <p><strong>A comprehensive full-stack MERN microservices-based platform</strong> inspired by systems like <strong>PickMe Food</strong> and <strong>UberEats</strong>. This platform enables customers to browse restaurants, order food, track deliveries, and make secure payments through a modern, scalable architecture featuring multiple microservices communicating via REST APIs, orchestrated using Docker.</p>

  <h2>🚀 Technology Stack</h2>
  
  <h3>Frontend</h3>
  <ul>
    <li><strong>Framework:</strong> React.js</li>
    <li><strong>Styling:</strong> CSS3, Responsive Design</li>
    <li><strong>State Management:</strong> React Hooks</li>
  </ul>

  <h3>Backend</h3>
  <ul>
    <li><strong>Runtime:</strong> Node.js</li>
    <li><strong>Framework:</strong> Express.js</li>
    <li><strong>Architecture:</strong> Microservices</li>
  </ul>

  <h3>Database & Storage</h3>
  <ul>
    <li><strong>Database:</strong> MongoDB</li>
    <li><strong>Media Storage:</strong> Cloudinary</li>
  </ul>

  <h3>DevOps & Security</h3>
  <ul>
    <li><strong>Containerization:</strong> Docker</li>
    <li><strong>Authentication:</strong> JWT + RBAC</li>
    <li><strong>API Gateway:</strong> Custom Gateway</li>
  </ul>

  <h3>Integrations</h3>
  <ul>
    <li><strong>Payments:</strong> PayHere/Stripe</li>
    <li><strong>Notifications:</strong> Twilio/SMTP</li>
    <li><strong>Images:</strong> Cloudinary</li>
  </ul>

  <h2>🧩 Microservices Architecture</h2>
  <p>The platform is built using a microservices architecture pattern, ensuring scalability, maintainability, and independent deployment capabilities.</p>
  
  <table>
    <thead>
      <tr>
        <th>Service</th>
        <th>Port</th>
        <th>Description</th>
        <th>Key Features</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Gateway API</strong></td>
        <td>8000</td>
        <td>Unified API gateway for routing requests</td>
        <td>Request routing, Load balancing, Rate limiting</td>
      </tr>
      <tr>
        <td><strong>Auth Service</strong></td>
        <td>8001</td>
        <td>Authentication and authorization</td>
        <td>JWT tokens, User registration, Login/Logout</td>
      </tr>
      <tr>
        <td><strong>User Service</strong></td>
        <td>8002</td>
        <td>Customer profile management</td>
        <td>Profile CRUD, Order history, Preferences</td>
      </tr>
      <tr>
        <td><strong>Restaurant Service</strong></td>
        <td>8003</td>
        <td>Restaurant and menu management</td>
        <td>Menu CRUD, Availability, Restaurant profiles</td>
      </tr>
      <tr>
        <td><strong>Order Service</strong></td>
        <td>8004</td>
        <td>Order processing and management</td>
        <td>Order creation, Status tracking, Order history</td>
      </tr>
      <tr>
        <td><strong>Delivery Service</strong></td>
        <td>8005</td>
        <td>Delivery assignment and tracking</td>
        <td>Driver assignment, Real-time tracking, Route optimization</td>
      </tr>
      <tr>
        <td><strong>Payment Service</strong></td>
        <td>8006</td>
        <td>Payment processing</td>
        <td>PayHere integration, Transaction history, Refunds</td>
      </tr>
      <tr>
        <td><strong>Admin Service</strong></td>
        <td>8007</td>
        <td>Administrative operations</td>
        <td>Restaurant verification, User management, Analytics</td>
      </tr>
      <tr>
        <td><strong>Frontend Client</strong></td>
        <td>5173</td>
        <td>React.js web application</td>
        <td>User interface, Responsive design, Real-time updates</td>
      </tr>
    </tbody>
  </table>

  <h2>🧑‍🍳 User Roles & Capabilities</h2>
  
  <h3>👤 Customer</h3>
  <ul>
    <li>Browse restaurants and menus</li>
    <li>Place and customize orders</li>
    <li>Make secure payments</li>
    <li>Track delivery in real-time</li>
    <li>Rate and review restaurants</li>
    <li>Manage profile and order history</li>
  </ul>

  <h3>🏪 Restaurant Owner</h3>
  <ul>
    <li>Manage restaurant profile and information</li>
    <li>Create and update menu items</li>
    <li>Set availability and operating hours</li>
    <li>Process incoming orders</li>
    <li>Update order status</li>
    <li>View analytics and reports</li>
  </ul>

  <h3>🚚 Delivery Personnel</h3>
  <ul>
    <li>View assigned delivery orders</li>
    <li>Update delivery status</li>
    <li>Navigate using integrated maps</li>
    <li>Communicate with customers</li>
    <li>Manage delivery history</li>
  </ul>

  <h3>⚙️ Admin</h3>
  <ul>
    <li>Approve and verify restaurants</li>
    <li>Manage user accounts</li>
    <li>Monitor platform analytics</li>
    <li>Handle disputes and support</li>
    <li>Configure platform settings</li>
    <li>Generate reports</li>
  </ul>

  <h2>📦 Project Structure</h2>
  <pre>
food-delivery-platform/
├── Client/                 # React.js frontend application
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── Dockerfile
├── Admin-Service/          # Administrative operations
├── Auth-Service/           # Authentication & authorization
├── Restaurant-Service/     # Restaurant & menu management
├── Order-Service/          # Order processing
├── Delivery-Service/       # Delivery management
├── Payment-Service/        # Payment processing
├── User-Service/           # User profile management
├── Gateway-API/            # API gateway
├── docker-compose.yml      # Docker orchestration
├── .env.example           # Environment variables template
└── README.html            # This documentation
  </pre>

  <h2>⚙️ Installation & Setup</h2>
  
  <h3>Prerequisites</h3>
  <ul>
    <li>Docker and Docker Compose installed</li>
    <li>Node.js 16+ (for local development)</li>
    <li>MongoDB (if running locally)</li>
    <li>Git</li>
  </ul>

  <h3>Quick Start with Docker</h3>
  <ol>
    <li><strong>Clone the repository</strong>
      <pre>git clone &lt;repository-url&gt;
cd food-delivery-platform</pre>
    </li>
    <li><strong>Configure environment variables</strong>
      <pre>cp .env.example .env
# Edit .env with your configuration</pre>
    </li>
    <li><strong>Start all services</strong>
      <pre>docker-compose up --build</pre>
    </li>
    <li><strong>Access the application</strong>
      <ul>
        <li>Frontend: <code>http://localhost:5173</code></li>
        <li>API Gateway: <code>http://localhost:8000</code></li>
        <li>Individual services: <code>http://localhost:800X</code></li>
      </ul>
    </li>
  </ol>

  <h3>Local Development Setup</h3>
  <ol>
    <li><strong>Install dependencies for each service</strong>
      <pre>cd Auth-Service && npm install
cd ../User-Service && npm install
# Repeat for all services</pre>
    </li>
    <li><strong>Start MongoDB locally</strong></li>
    <li><strong>Start each service individually</strong>
      <pre>npm run dev</pre>
    </li>
  </ol>

  <h2>🔐 Security Features</h2>
  <ul>
    <li><strong>JWT Authentication:</strong> Secure token-based authentication</li>
    <li><strong>Role-Based Access Control (RBAC):</strong> Different permissions for different user types</li>
    <li><strong>Protected Routes:</strong> Both frontend and backend route protection</li>
    <li><strong>Input Validation:</strong> Comprehensive data validation and sanitization</li>
    <li><strong>CORS Configuration:</strong> Proper cross-origin resource sharing setup</li>
    <li><strong>Environment Variables:</strong> Sensitive data stored securely</li>
  </ul>

  <h2>📧 Communication & Notifications</h2>
  <ul>
    <li><strong>SMS Notifications:</strong> Order updates via Twilio</li>
    <li><strong>Email Confirmations:</strong> SMTP-based email notifications</li>
    <li><strong>Real-time Updates:</strong> Live order status updates</li>
    <li><strong>Push Notifications:</strong> Browser-based notifications</li>
  </ul>

  <h2>💳 Payment Integration</h2>
  <p>Secure payment processing through multiple providers:</p>
  <ul>
    <li><strong>PayHere:</strong> Primary payment gateway (Sri Lankan market)</li>
    <li><strong>Stripe:</strong> International payment processing</li>
    <li><strong>Sandbox Mode:</strong> Safe testing environment</li>
    <li><strong>Multiple Payment Methods:</strong> Credit cards, digital wallets</li>
  </ul>

  <h2>📸 Media Management</h2>
  <p>All media files (restaurant images, menu item photos, user avatars) are managed through <strong>Cloudinary</strong> for:</p>
  <ul>
    <li>Automatic image optimization</li>
    <li>Multiple format support</li>
    <li>CDN delivery for fast loading</li>
    <li>Responsive image serving</li>
  </ul>

  <h2>🧪 API Testing</h2>
  <p>Each microservice exposes RESTful APIs that can be tested individually:</p>
  
  <h3>Example Endpoints</h3>
  <table>
    <thead>
      <tr>
        <th>Method</th>
        <th>Endpoint</th>
        <th>Description</th>
        <th>Service</th>
      </tr>
    </thead>
    <tbody>
      <tr><td>POST</td><td>/auth/register</td><td>User registration</td><td>Auth Service</td></tr>
      <tr><td>POST</td><td>/auth/login</td><td>User login</td><td>Auth Service</td></tr>
      <tr><td>GET</td><td>/restaurants</td><td>Get all restaurants</td><td>Restaurant Service</td></tr>
      <tr><td>GET</td><td>/restaurants/:id/menu</td><td>Get restaurant menu</td><td>Restaurant Service</td></tr>
      <tr><td>POST</td><td>/orders</td><td>Create new order</td><td>Order Service</td></tr>
      <tr><td>GET</td><td>/orders/:id/track</td><td>Track order status</td><td>Delivery Service</td></tr>
      <tr><td>POST</td><td>/payments/process</td><td>Process payment</td><td>Payment Service</td></tr>
    </tbody>
  </table>

  <h2>🚀 Deployment & Scaling</h2>
  <ul>
    <li><strong>Docker Containerization:</strong> Each service runs in isolated containers</li>
    <li><strong>Kubernetes Ready:</strong> Easy migration to Kubernetes for production</li>
    <li><strong>Horizontal Scaling:</strong> Scale individual services based on demand</li>
    <li><strong>Load Balancing:</strong> Built-in load balancing through API gateway</li>
    <li><strong>Health Checks:</strong> Service health monitoring and auto-recovery</li>
  </ul>

  <h2>👥 Development Team</h2>
  <table>
    <thead>
      <tr>
        <th>Student ID</th>
        <th>Name</th>
        <th>Role</th>
      </tr>
    </thead>
    <tbody>
      <tr><td>IT22066770</td><td>Athukorala H.H.B</td><td>Full-Stack Developer</td></tr>
      <tr><td>IT22070630</td><td>Perera K.D.N</td><td>Backend Developer</td></tr>
      <tr><td>IT22220424</td><td>Kaushalya P.L.P.D</td><td>Frontend Developer</td></tr>
      <tr><td>IT22187178</td><td>Vijithapala T.G.K.G</td><td>DevOps Engineer</td></tr>
    </tbody>
  </table>

  <h2>📄 Documentation</h2>
  <p>Comprehensive project documentation is available in <code>report.pdf</code> including:</p>
  <ul>
    <li><strong>System Architecture Diagram:</strong> Visual representation of the microservices architecture</li>
    <li><strong>API Interface Specifications:</strong> Detailed API documentation</li>
    <li><strong>Workflow Descriptions:</strong> User journey and system workflows</li>
    <li><strong>Security Implementation:</strong> Security measures and best practices</li>
    <li><strong>Individual Contributions:</strong> Team member responsibilities and contributions</li>
    <li><strong>Testing Strategies:</strong> Unit, integration, and system testing approaches</li>
  </ul>

  <h2>📌 Key Features & Highlights</h2>
  <ul>
    <li>🏗️ <strong>Microservices Architecture:</strong> Scalable and maintainable design</li>
    <li>🔒 <strong>Enterprise Security:</strong> JWT authentication with role-based access</li>
    <li>📱 <strong>Responsive Design:</strong> Works seamlessly on all devices</li>
    <li>⚡ <strong>Real-time Updates:</strong> Live order tracking and notifications</li>
    <li>💰 <strong>Multiple Payment Options:</strong> Flexible payment processing</li>
    <li>🚀 <strong>Cloud-Native:</strong> Container-ready for modern deployment</li>
    <li>🔧 <strong>Easy Development:</strong> Docker-based development environment</li>
    <li>📊 <strong>Analytics Ready:</strong> Built-in analytics and reporting capabilities</li>
  </ul>

  <h2>🤝 Contributing</h2>
  <ol>
    <li>Fork the repository</li>
    <li>Create a feature branch (<code>git checkout -b feature/amazing-feature</code>)</li>
    <li>Commit your changes (<code>git commit -m 'Add amazing feature'</code>)</li>
    <li>Push to the branch (<code>git push origin feature/amazing-feature</code>)</li>
    <li>Open a Pull Request</li>
  </ol>

  <h2>📞 Support</h2>
  <p>For support and questions, please contact the development team or create an issue in the repository.</p>

  <blockquote>
    <p><strong>Note:</strong> This platform is designed with modern software engineering principles, emphasizing scalability, security, and maintainability. It serves as an excellent example of microservices architecture implementation using the MERN stack.</p>
  </blockquote>

</body>
</html>
