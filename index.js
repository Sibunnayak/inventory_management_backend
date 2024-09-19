const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const AuthRouter = require('./Routes/AuthRouter');
const ItemRouter = require('./Routes/itemRouter');

// Increase payload limit for JSON and URL-encoded form data
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
// Allow all origins or just your frontend origin
app.use(cors({
    origin: 'http://localhost:3000' // Replace with the correct frontend URL in production
  }));
require('dotenv').config();
require('./Models/db');
const PORT = process.env.PORT || 8080;

app.get('/ping', (req, res) => {
    res.send('PONG');
});

app.use(bodyParser.json());
app.use(cors());
app.use('/auth', AuthRouter);
app.use('/item', ItemRouter);



app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})