import { useState, useEffect } from "react";
import useTheater from "../service/theaterAndUserHook";
import { useTheaterContext } from "../navigation/TheaterContext";
import '../styles/managetheater.css'
import { Schedule } from "../service/Schedule";
function ManageTheaters({theaters}) {
    const [theater, setTheater] = useState('San Jose XD 12345')
    const { closestTheaterInfo} = useTheaterContext();
    const [remove, setRemove]= useState('Remove')
    const [isContentVisible, setIsContentVisible] = useState(true);
    const schedule = new Schedule()
    const {theaterCollection, refreshTheater}= useTheater();
    const [newSchedule, setNewSchedule] = useState({
        theater: '', // Initialize with default values
        room: '',
        movie: '',
        dateTime: '',
        duration: '',
        price: '',
      });

    // useEffect(()=>{
    //     async function test(){
    //     const test = refreshTheater();
    //     return test
    //     }
    //     test()
    //     console.log(closestTheaterInfo)
    // },[])

      const toggleContentVisibility = () => {
        setIsContentVisible((prev) => !prev);
      };
      
      const containerStyle = {
        display: 'grid',
        gridTemplateColumns: '1fr 2fr', // Adjust the ratio according to your preference
        alignItems: 'center',
        gap: '10px', // This is the space between the label and input field
      };
      
      const labelStyle = {
        textAlign: 'right', // Align text to the right for the label
        paddingRight: '10px', // Add some padding to separate it from the input field
      };
      
      const inputStyle = {
        width: '100%', // Ensure input fields take up the full available width
        boxSizing: 'border-box', // Include padding and border in the element's total width and height
      };
      
      
    // Define a function to get the seat count for a show
    function getSeatCountForShow(show, theaterRooms) {
        if (theaterRooms && theaterRooms.length > 0) {
            const matchingRoom = theaterRooms.find((room) => room.name === show.room);
            if (matchingRoom) {
                return matchingRoom.seat_count.$numberInt;
            }
        }
        return 'N/A'; // Return a default value if no matching room is found
    }

    const [removedSchedules, setRemovedSchedules] = useState([]);

    const handleRemoveSchedule = async (show) => {
        try {
          const scheduleIdToDelete = show?.schedule_id; // Correct property name
          console.log(scheduleIdToDelete);
      
          const success = await schedule.deleteSchedule(scheduleIdToDelete);
          
          if (success) {
            window.location.reload()
            alert('This schedule is deleted');
            console.log('Schedule deleted successfully');
            
            // Remove the schedule from the showtimes array
            const updatedShowtimes = show.filter((s) => s.schedule_id !== scheduleIdToDelete);
            setShowtimes(updatedShowtimes);
      
            // Add the removed schedule to the removedSchedules state
            setRemovedSchedules((prevRemovedSchedules) => [...prevRemovedSchedules, scheduleIdToDelete]);
          } else {
            console.log('Schedule deletion failed');
          }
        } catch (error) {
          console.error('Error deleting schedule:', error);
        }
      };
      

    // const removeSchedule = async()=>{
    //     try {
    //         const scheduleIdToDelete = '12345'; // Replace with the actual schedule ID
    //         const success = await schedule.deleteSchedule(scheduleIdToDelete);
    //         if (success) {
    //             alert('This schedule is deleted')
    //             console.log('Schedule deleted successfully');
    //         } else {
    //           console.log('Schedule deletion failed');
    //         }
    //       } catch (error) {
    //         console.error('Error deleting schedule:', error);
    //       }          

    // }
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewSchedule((prevState) => ({
          ...prevState,
          [name]: value,
        }));
      };
    
      const handleCreateSchedule = async () => {
        try {
            console.log(newSchedule)
          // Check if all required fields are filled
          if (!newSchedule.room || !newSchedule.movie || !newSchedule.dateTime || !newSchedule.duration || !newSchedule.price) {
            console.error('Please fill in all required fields.');
            alert('Please fill out all the fields');
            return; // Exit the function if any required field is missing
          }
      
          // Manually add Theater ID to newSchedule
          newSchedule.theater = closestTheaterInfo?.theaterId;
      
          // Handle the creation of the new schedule with the values in newSchedule
          const insertedSchedule = await schedule.insertSchedule(newSchedule);
          if(insertedSchedule){
            window.location.reload()
            alert('Successfully Added: ', insertedSchedule)
            // refreshTheater();
          }
      
          // Log the newly inserted schedule (optional)
          console.log('Newly Inserted Schedule:', insertedSchedule);
      
          // Clear the newSchedule object or perform any other necessary actions
          setNewSchedule({}); // Assuming you have a state variable to manage newSchedule
        } catch (error) {
          console.error('Error creating schedule:', error);
          // Handle the error, display an error message, or perform other actions
        }
      };

            // Function to handle date input change
        const handleDateChange = (e, show) => {
            const editedDate = e.target.value;
            // Update the show object with the edited date
            show.editedDate = editedDate;
        };
        
        // Function to handle seat capacity input change
        const handleSeatCapacityChange = (e, show) => {
            const editedSeatCapacity = parseInt(e.target.value, 10);
            // Update the show object with the edited seat capacity
            show.editedSeatCapacity = editedSeatCapacity;
        };
        
        // // Function to handle the "Remove" button click
        // const handleRemoveSchedule = (show) => {
        //     // Implement the removal logic here
        // };
        
        // Function to handle the "Update" button click
        const handleUpdateSchedule = (show) => {
            if (show.editing) {
            // Implement the update logic here with the edited date and seat capacity
            const updatedDate = show.editedDate;
            const updatedSeatCapacity = show.editedSeatCapacity;
            // Call an API or update the state as needed
            }
            // Toggle the editing property to switch between edit and save mode
            show.editing = !show.editing;
        };

    const hasChanged = (show) => {
        return (
        show.editedDate !== show.dateTime ||
        show.editedSeatCapacity !== show.seatCapacity
        );
    };
    const [editingSchedules, setEditingSchedules] = useState([]);
    const [showtimes, setShowtimes] = useState(closestTheaterInfo?.showtimes || []);

    const handleEditSchedule = (show) => {
    if (editingSchedules.includes(show.schedule_id)) {
        // If the schedule is already in editing mode, remove it from the editing list
        setEditingSchedules((prevEditingSchedules) =>
        prevEditingSchedules.filter((id) => id !== show.schedule_id)
        );
    } else {
        // Otherwise, add it to the editing list
        setEditingSchedules((prevEditingSchedules) => [...prevEditingSchedules, show.schedule_id]);
    }
    };
  
  
      
      
// Add/update/remove movies/showtimes/theater assignment in the schedule
// Configure seating capacity for each theater in a multiplex
// View analytics dashboard showing Theater occupancy for the last 30/60/90 days
// Summarized by location
// Summarized by movies
// Configure discount prices for shows before 6pm and for Tuesday shows
    return ( 
        <div className ='manageTheater'>
            <h3 style={{textAlign:'center', textDecoration:'underline'}}> Manage Theater</h3>
            <p style={{borderBottom: '1px solid #FFF'}}> Current Theater </p>
            <div style={{display:'flex', justifyContent:'flex-start'}}>
                <p> Your Theater: {closestTheaterInfo?.theaterName? closestTheaterInfo.theaterName : theater} </p>
                
            </div>
            <p style={{borderBottom: '1px solid #FFF'}}> Update Schedule Assignments </p>
            <div>
            <button onClick={toggleContentVisibility} style={{display: "flex", width: '100%', justifyContent: 'right', backgroundColor: 'transparent'}}>
                {isContentVisible ? 'Hide Content' : 'Show Content'}
            </button>
            <div
                className={`content ${isContentVisible ? 'visible' : 'hidden'}`}
                style={{ transition: 'height 0.5s' }}
            >
                 {showtimes.map((show, index) => (
        <div className='theaterCard' style={{ marginBottom: '2%' }} key={index}>
          <div style={{ margin: '2%' }}>
            <p> Schedule Id: {show?.schedule_id}</p>
            <p> Movie Title: {show?.movieTitle} </p>
            <p>
              Schedule:
              {editingSchedules.includes(show.schedule_id) ? (
                <input
                  type='datetime-local'
                  value={show?.editedDate || show?.dateTime}
                  onChange={(e) => handleDateChange(e, show)}
                />
              ) : (
                show?.dateTime
              )}
            </p>
            <p>
              Total Seat: {editingSchedules.includes(show.schedule_id) ? (
                <input
                  type='number'
                  value={show?.editedSeatCapacity || getSeatCountForShow(show, closestTheaterInfo?.theaterRoom)}
                  onChange={(e) => handleSeatCapacityChange(e, show)}
                />
              ) : (
                getSeatCountForShow(show, closestTheaterInfo?.theaterRoom)
              )}
            </p>
            <button
              style={{ backgroundColor: '#A30000', borderRadius: '5px' }}
              onClick={() => handleRemoveSchedule(show)}
            >
              {removedSchedules.includes(show.schedule_id) ? 'Removed' : 'Remove'}
            </button>
            <button
              style={{ backgroundColor: '#007BFF', borderRadius: '5px' }}
              onClick={() => handleEditSchedule(show)}
            >
              {editingSchedules.includes(show.schedule_id) ? 'Save' : 'Edit'}
            </button>
          </div>
        </div>
      ))}
                {/* {showtimes.map((show, index) => (
                <div className='theaterCard' style={{ marginBottom: '2%' }} key={index}>
                    <div style={{ margin: '2%' }}>
                    <p> Schedule Id: {show?.schedule_id}</p>
                    <p> Movie Title: {show?.movieTitle} </p>
                    <p>
                        Schedule:
                        {editingSchedules.includes(show.schedule_id) ? (
                        <input
                            type='datetime-local'
                            value={show?.editedDate || show?.dateTime}
                            onChange={(e) => handleDateChange(e, show)}
                        />
                        ) : (
                        show?.dateTime
                        )}
                    </p>
                    <p>
                        Total Seat: {editingSchedules.includes(show.schedule_id) ? (
                        <input
                            type='number'
                            value={show?.editedSeatCapacity || getSeatCountForShow(show, closestTheaterInfo?.theaterRoom)}
                            onChange={(e) => handleSeatCapacityChange(e, show)}
                        />
                        ) : (
                        getSeatCountForShow(show, closestTheaterInfo?.theaterRoom)
                        )}
                    </p>
                    <button
                        style={{ backgroundColor: '#A30000', borderRadius: '5px' }}
                        onClick={() => handleRemoveSchedule(show)}
                    >
                        {remove}
                    </button>
                    <button
                        style={{ backgroundColor: '#007BFF', borderRadius: '5px' }}
                        onClick={() => handleEditSchedule(show)}
                    >
                        {editingSchedules.includes(show.schedule_id) ? 'Save' : 'Edit'}
                    </button>
                    </div>
                </div>
                ))} */}
            </div>
            </div>
            <div>
            <p style={{borderBottom: '1px solid #FFF'}}> Create New Schedules </p>
            <p> Current Theater: {closestTheaterInfo?.theaterName}</p>
            <div style={containerStyle}>
                <div>
                <label htmlFor='theater' style={labelStyle}>Theater Id:</label>
                <input
                    type='text'
                    id='theater'
                    name='theater'
                    value={closestTheaterInfo?.theaterId || ''}
                    readOnly // Add this attribute to make it non-editable
                    style={inputStyle}
                />
                </div>

                <div>
                <label htmlFor='room' style={labelStyle}>Room:</label>
                <input type='text' id='room' name='room' value={newSchedule.room} onChange={handleInputChange} style={inputStyle} />
                </div>
                <div>
                <label htmlFor='movie' style={labelStyle}>Movie Id:</label>
                <input type='text' id='movie' name='movie' value={newSchedule.movie} onChange={handleInputChange} style={inputStyle} />
                </div>
                <div>
                <label htmlFor='dateTime' style={labelStyle}>Date and Time:</label>
                <input type='datetime-local' id='dateTime' name='dateTime' value={newSchedule.dateTime} onChange={handleInputChange} style={inputStyle} />
                </div>
                <div>
                <label htmlFor='duration' style={labelStyle}>Duration (in minutes):</label>
                <input type='number' id='duration' name='duration' value={newSchedule.duration} onChange={handleInputChange} style={inputStyle} />
                </div>
                <div>
                <label htmlFor='price' style={labelStyle}>Price:</label>
                <input type='number' id='price' name='price' value={newSchedule.price} onChange={handleInputChange} style={inputStyle} />
                </div>
            </div>
                <button onClick={handleCreateSchedule} style={{backgroundColor: '#A30000', marginTop: '2%'}}>Create New Schedule</button>
                
            </div>

        </div>
     );
}

export default ManageTheaters;

// {
//     "_id": "65504914a941af265b2e29c2",
//     "theater": "654ae43ee79c11bbe9d373b1",
//     "room": "Room A",
//     "movie": "6539d906c951fa0c359524e6",
//     "dateTime": "2023-12-30T16:00:00.000Z",
//     "duration": 120,
//     "price": 15
// }