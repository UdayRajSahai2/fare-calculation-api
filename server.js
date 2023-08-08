const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3000;


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Uday@2208',
  database: 'fare_db',
  connectionLimit: 10,
});


const fareTable = {
  '1-1': { peak: 30, offPeak: 25 },
  '1-2': { peak: 35, offPeak: 30 },
  '2-1': { peak: 35, offPeak: 30 },
  '2-2': { peak: 25, offPeak: 20 },
};


function calculateSingleJourneyFare(fromZone, toZone, time, isPeakHour) {
  const fareKey = `${fromZone}-${toZone}`;
  const fareCategory = isPeakHour ? 'peak' : 'offPeak';
  const fare = fareTable[fareKey][fareCategory];
  return fare;
}


const users = [
  { username: 'user1', password: 'password1' },
  { username: 'user2', password: 'password2' },
  // Add more users as needed
];


function authenticateUser(req, res, next) {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Authorization token not found' });
  }

  jwt.verify(token, '9899u$d', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
}


app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    const token = jwt.sign({ username }, '9899u$d', { expiresIn: '5h' });
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Invalid username or password' });
  }
});


app.post('/calculate-fare', authenticateUser, (req, res) => {
  const { day, time, fromZone, toZone } = req.body;
  const journeyTime = new Date(time);
  const peakHour = isPeakHour(journeyTime)
  function isPeakHour(time) {
    const day = time.getDay(); 
    const hour = time.getHours();
    const minute = time.getMinutes();
  
    const isWeekend = day === 0 || day === 6; //
  
    const peakHoursWeekday = (hour === 7 && minute >= 0 && minute <= 30) || (hour >= 8 && hour <= 10);
    const peakHoursWeekend = (hour === 9 && minute >= 0 && minute <= 30) || (hour >= 10 && hour <= 11);
  
    return isWeekend ? peakHoursWeekend : peakHoursWeekday;
  }

  if (!day || !time || !fromZone || !toZone) {
    return res.status(400).json({ message: 'Please provide valid data for day, time, fromZone, and toZone' });
  }

  const fare = calculateSingleJourneyFare(fromZone, toZone, time, isPeakHour);

  const sql = 'INSERT INTO journeys (day, time, from_zone, to_zone) VALUES (?, ?, ?, ?)';
  pool.query(sql, [day, time, fromZone, toZone], (err, result) => {
    if (err) {
      console.error('Error saving journey to the database:', err);
      return res.status(500).json({ message: 'Error saving journey to the database' });
    }
    res.json({ fare, journeyId: result.insertId });
  });
});
app.get('/', (req, res) => {
    res.send('Welcome to the Fare Calculation API');
  });
  
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


