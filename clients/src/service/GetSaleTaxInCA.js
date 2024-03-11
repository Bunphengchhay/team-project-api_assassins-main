// export async function getTaxRateByAddress(address, city, zip) {
//     const baseURL = 'https://services.maps.cdtfa.ca.gov/api/taxrate/GetRateByAddress';
//     const query = `?address=${encodeURIComponent(address)}&city=${encodeURIComponent(city)}&zip=${encodeURIComponent(zip)}`;
  
//     try {
//       const response = await fetch(baseURL + query);
//       console.log('API Response:', response);
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       const data = await response.json();

//       return data;
//       // if(data){
//       //   return data?.taxRateInfo.rate
//       // }
//       // return 0.10; // This should contain the tax rate
//     } catch (error) {
//       console.error('Error fetching tax rate:', error);
//     }
//   }

export async function getTaxRateByAddress(address, city, zip) {
  const baseURL = 'https://services.maps.cdtfa.ca.gov/api/taxrate/GetRateByAddress';
  const query = `?address=${encodeURIComponent(address)}&city=${encodeURIComponent(city)}&zip=${encodeURIComponent(zip)}`;

  try {
    const response = await fetch(baseURL + query);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    
    // Debugging output
    console.log('API Response:', data);

    if (data && data.taxRateInfo && data.taxRateInfo.rate) {
      return data.taxRateInfo.rate;
    }

    return 0.10; // This should contain the tax rate
  } catch (error) {
    console.error('Error fetching tax rate:', error);

    // Re-throw the error for the caller to handle if needed
    throw error;
  }
}
