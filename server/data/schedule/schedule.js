const fs = require('fs');
const path = require('path');
// const { ObjectId } = require('mongodb');
const movies = require('./movieId.json')
const theaterIds = [
    '654ae43ee79c11bbe9d373b1',
    '654ae43ee79c11bbe9d373b3',
    '6556b535c1378d306dee9464',
    '6556b536c1378d306dee9465',
    '6556b536c1378d306dee9466',
    '6556b536c1378d306dee9467',
    '6556b536c1378d306dee9468',
    '6556b536c1378d306dee9469',
    '6556b537c1378d306dee946a',
    '6556b537c1378d306dee946b',
    '6556b537c1378d306dee946c',
    '6556b537c1378d306dee946d',
    '6556b537c1378d306dee946e',
    '6556b538c1378d306dee946f',
    '6556b538c1378d306dee9470',
    '6556b538c1378d306dee9471',
    '6556b538c1378d306dee9472',
    '6556b538c1378d306dee9473',
    '6556b538c1378d306dee9474',
    '6556b539c1378d306dee9475',
  ];

  require('dotenv').config();
  const { MongoClient, ObjectId } = require('mongodb');

  
  const outputFilePath = path.join(__dirname, 'schedules.json');
  
  function getRandomFutureDateTime() {
    const today = new Date();
    const latest = new Date().setDate(today.getDate() + 30);
    const randomDate = new Date(today.getTime() + Math.random() * (latest - today.getTime()));
    randomDate.setHours(Math.floor(Math.random() * 24)); // Random hour of the day
    randomDate.setMinutes(Math.floor(Math.random() * 60)); // Random minute
    return randomDate;
  }
  
  function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
  }
  
  function generateSchedules(movies, theaterIds, count) {
    const schedules = [];
    const allRooms = ['Room A', 'Room B', 'Room C', 'Room D'];
    const limitedRooms = ['Room A', 'Room B']; // Only for the first two theaters
    const lastScheduledTime = {}; // Object to keep track of the last scheduled time for each room-theater combination
  
    for (let i = 0; i < count; i++) {
      const randomMovie = getRandomElement(movies);
      const randomTheaterId = getRandomElement(theaterIds);
      const isLimitedTheater = theaterIds.slice(0, 2).includes(randomTheaterId);
      const rooms = isLimitedTheater ? limitedRooms : allRooms;
      let randomRoom = getRandomElement(rooms);
      let randomDateTime = getRandomFutureDateTime();
  
      const scheduleKey = `${randomTheaterId}-${randomRoom}`;
      if (lastScheduledTime[scheduleKey]) {
        const lastTime = new Date(lastScheduledTime[scheduleKey]);
        do {
          randomDateTime = new Date(lastTime.getTime() + 2 * 60 * 60 * 1000); // Add 2 hours to the last time
        } while (randomDateTime < new Date());
      }
  
      lastScheduledTime[scheduleKey] = randomDateTime.toISOString();
  
      const schedule = {
        _id: new ObjectId(),
        theater: new ObjectId(randomTheaterId),
        room: randomRoom,
        movie: new ObjectId(randomMovie.movieId),
        dateTime: randomDateTime.toISOString(),
        duration: randomMovie.runtime,
        price: Math.floor(Math.random() * 6) + 10 // Random price between 10 and 15
      };
  
      schedules.push(schedule);
    }
  
    return schedules;
  }
  
  const generatedSchedules = generateSchedules(movies, theaterIds, 100);
  fs.writeFileSync(outputFilePath, JSON.stringify(generatedSchedules, null, 2), 'utf8');
  console.log(`Schedules have been saved to ${outputFilePath}`);
  