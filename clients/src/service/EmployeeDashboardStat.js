import '../styles/managetheater.css'
import server from './server_fetcher';
export class EmployeeDashboardStat {
    constructor() {
        this.booking = [];
    }
    async getDashboardOverview() {
        try {
            const response = await server.fetch('theaters-with-movies', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const data = await response.json();
            this.booking = data; // Storing the fetched data in the booking property
            return data; // Returning the data for further processing or usage
        } catch (error) {
            console.error('Error fetching dashboard overview:', error);
            // Handle errors appropriately, perhaps returning an error message or different data structure
        }
    }
    
}
