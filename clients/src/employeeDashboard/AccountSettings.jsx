import React, { useState } from 'react';

function AccountSettings() {
  // State for account information
  const [employeeInfo, setEmployeeInfo] = useState({
    employeeID: '1234',
    fullName: '',
    address: '',
    phone: '',
    email: '',
  });

  // State for password management
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
  });

  // Handlers for input changes
  const handleInfoChange = (e) => {
    setEmployeeInfo({ ...employeeInfo, [e.target.name]: e.target.value });
  };

  const handlePasswordsChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  // Handler for form submission
  const handleSave = (e) => {
    e.preventDefault();
    // Here you would typically send the data to a server
    console.log('Saving employee info:', employeeInfo);
    console.log('Updating passwords:', passwords);
    // Add your logic to save the information, for example, an API call
  };

  return (
    <div style={{ maxWidth: '500px', margin: 'auto', paddingBottom: '20px' }}>
      <div style={{ borderBottom: '1px solid white', textAlign: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: '0.5em 0' }}>Employee Information</h2>
      </div>
      <form onSubmit={handleSave}>
        {Object.entries(employeeInfo).map(([key, value]) => (
          <div key={key} style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>
              {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}:
            </label>
            <input
              type={key === 'email' ? 'email' : 'text'}
              id={key}
              name={key}
              value={value}
              onChange={handleInfoChange}
              required
              style={{ width: '100%', padding: '0.5rem' }}
            />
          </div>
        ))}
        
        <div style={{ borderBottom: '1px solid white', textAlign: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: '0.5em 0' }}>Manage Passwords</h2>
        </div>
        
        {Object.entries(passwords).map(([key, value]) => (
          <div key={key} style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>
              {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}:
            </label>
            <input
              type="password"
              id={key}
              name={key}
              value={value}
              onChange={handlePasswordsChange}
              required
              style={{ width: '100%', padding: '0.5rem' }}
            />
          </div>
        ))}

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button type="submit" style={{ padding: '0.5rem 1rem', backgroundColor: 'orange', border: 'none', cursor: 'pointer' }}>
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

export default AccountSettings;
