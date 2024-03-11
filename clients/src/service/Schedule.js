import server from "./server_fetcher";

export class Schedule{
    constructor(){
        this.Schedules = [];
    }
    getSchedule(){
        return this.Schedules;
    }
    async fetchSchedule() {
        try {
          // Fetch theater data
          const response = await server.fetch(`schedules`);
          if (!response.ok) {
            throw new Error('Failed to fetch theaters');
          }
          const theaterData = await response.json();
          this.Schedules = theaterData;
          
        } catch (error) {
          console.error('Error fetching theater data: ', error);
          throw error;
        }
      }
    
      async insertSchedule(schedule) {
        try {
          // const response = await fetch(`${this.apiUrl}schedules/insertOne`, {
            const response = await server.fetch(`schedules/insertOne`, {
            method: 'POST',
            body: JSON.stringify(schedule),
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          });
          if (!response.ok) {
            throw new Error('Failed to insert schedule');
          }
          // Assuming the API returns the newly inserted schedule, you can update the local data accordingly
          const insertedSchedule = await response.json();
          this.Schedules.push(insertedSchedule); // Use 'Schedules' with a capital 'S'
      
          return insertedSchedule; // Optionally return the inserted schedule
        } catch (error) {
          console.error('Error inserting schedule: ', error);
          throw error;
        }
      }

      async deleteSchedule(scheduleIdToDelete) {
        try {
          // const response = await fetch(`${this.apiUrl}schedules/${scheduleIdToDelete}`, {
            const response = await server.fetch(`schedules/${scheduleIdToDelete}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          });
      
          if (!response.ok) {
            throw new Error('Failed to delete schedule');
          }
      
          console.log('Schedule deleted successfully');
          return true; // Return true to indicate successful deletion
        } catch (error) {
          console.error('Error deleting schedule:', error);
          return false; // Return false to indicate failed deletion
        }
      }
      
      
      
}