require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');
const apiRoutes = require('./src/routes/api');

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use('/api', apiRoutes);

app.get('/', (req, res) => res.send('FITSTEP API Running...'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
