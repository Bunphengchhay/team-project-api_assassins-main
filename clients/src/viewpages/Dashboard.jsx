import '../styles/dashboard.css'; // Make sure to create and import the Dashboard.css file
import logo from '../assets/image/logo.png'
import CustomerSupport from '../employeeDashboard/CustomerSupport'
import AccountSettings from '../employeeDashboard/AccountSettings';
import Overview from '../employeeDashboard/OverView';
import ManageTheaters from '../employeeDashboard/ManageTheaters';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import authentication from '../service/authentication';

import React, { useState, useEffect } from 'react';

const canAccessDashboard = (user) => {
  return user && user.role && (user.role.includes('admin') || user.role.includes('employee'));
};

function Dashboard() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState('Overview');
  const [user, setUser] = useState({
    name: 'Pence Chhay',
    role: [], // Default empty role
  });
  const [authStatus, setAuthStatus] = useState(null); // To store authentication status

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const openComponent = (componentName) => {
    setSelectedComponent(componentName);
  };

  const getComponentToRender = () => {
    switch (selectedComponent) {
      case 'CustomerSupport':
        return <CustomerSupport />;
      case 'AccountSettings':
        return <AccountSettings />;
      case 'Overview':
        return <Overview />;
      case 'ManageTheaters':
        return <ManageTheaters />;
      default:
        return <Overview />;
    }
  };

  // Fetch user authentication status when the component mounts
  useEffect(() => {
    const fetchAuthStatus = async () => {
      try {
        const response = await authentication.getAuth();
        if (response.ok) {
          const data = await response.json();
          setAuthStatus(data);
          if (data.authenticated) {
            // If authenticated, update the user state with the received data
            setUser({
              name: data.user.name,
              role: data.user.role || [], // Ensure role is an array
            });
          }
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      }
    };

    fetchAuthStatus();
  }, []); // The empty dependency array ensures the effect runs only once on mount

  return (
    <div className="dashboard">
      {isSidebarOpen && <div className="backdrop" onClick={closeSidebar} />}
      <div className="top-bar">
        <button onClick={toggleSidebar} className="burger">
          ☰
        </button>
        <div className="right-content">
          <a href="/Home" className="customer-preview">
            Customer Preview
          </a>
          <div className="user-info">
            <span className="user-icon">👤</span>
            <span className="user-name">{user.name}</span>
          </div>
        </div>
      </div>

      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <button onClick={toggleSidebar} className="close-sidebar">
          ✕
        </button>
        <div className="sidebar-content">
          <nav className="sidebar-nav">
            <button onClick={() => openComponent('Overview')} className="sidebar-item">
              Overview
            </button>
            <button onClick={() => openComponent('CustomerSupport')} className="sidebar-item">
              Customer Support
            </button>
            <button onClick={() => openComponent('ManageTheaters')} className="sidebar-item">
              Manage Theaters
            </button>
            <button onClick={() => openComponent('AccountSettings')} className="sidebar-item">
              Account Settings
            </button>
          </nav>
        </div>
      </div>

      <main className="main-content">
        {authStatus?.authenticated ? ( // Check if user is authenticated
          canAccessDashboard(user) ? (
            getComponentToRender()
          ) : (
            <p>You do not have access to this page.</p>
          )
        ) : (
          <p>Loading...</p>
        )}
      </main>
    </div>
  );
}

export default Dashboard;



// function Dashboard() {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [selectedComponent, setSelectedComponent] = useState(null);
//   const user = {
//     name: 'Pence Chhay',
//     // Add additional user properties if needed
//   };

//   const toggleSidebar = () => {
//     setIsSidebarOpen(!isSidebarOpen);
//   };

//   const closeSidebar = () => {
//     setIsSidebarOpen(false);
//   };

//   const openComponent = (componentName) => {
//     setSelectedComponent(componentName);
//   };

//   const getComponentToRender = () => {
//     switch (selectedComponent) {
//       case 'CustomerSupport':
//         return <CustomerSupport/>
//       case 'AccountSettings':
//         return <AccountSettings />;
//       case 'Overview':
//         return <Overview/>
//       case 'ManageTheaters':
//         return <ManageTheaters/>
//       // Add more cases as necessary for other components
//       default:
//         return <Overview/>
//     }
//   };


//   return (
//     <div className="dashboard">
//       {isSidebarOpen && <div className="backdrop" onClick={closeSidebar} />}
//       <div className="top-bar">
//         <button onClick={toggleSidebar} className="burger">☰</button>
//         <div className="right-content">
//           <a href="/Home" className="customer-preview">Customer Preview</a>
//           <div className="user-info">
//             <span className="user-icon">👤</span>
//             <span className="user-name">{user.name}</span>
//           </div>
//         </div>
//       </div>

//       <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
//         <button onClick={toggleSidebar} className="close-sidebar">✕</button>
//         <div className="sidebar-content">
//           <img src={logo} alt="Logo" className="sidebar-logo" />
//           <nav className="sidebar-nav">
//             <button onClick={() => openComponent('Overview')} className="sidebar-item"> Overview </button>
//             <button onClick={() => openComponent('CustomerSupport')} className="sidebar-item">Customer Support</button>
//             <button onClick={() => openComponent('ManageTheaters')} className="sidebar-item"> Manage Theaters</button>
//             <button onClick={() => openComponent('AccountSettings')} className="sidebar-item">Account Settings</button>
//             {/* Add more buttons for other components */}
//           </nav>
//         </div>
//       </div>

//       <main className="main-content">
//         {/* Main page content goes here */}
//         {getComponentToRender()}
//       </main>
//     </div>
//   );
// }

// export default Dashboard;
