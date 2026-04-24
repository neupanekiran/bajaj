// server.js 
require('dotenv').config({ path: './src/.env' }); 
const express = require('express');
const cors = require('cors');
const bfhlRoutes = require('./src/routes/bfhl.routes');
const errorHandler = require('./src/middlewares/errorHandler');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors({ 
    origin: '*', // Allows all origins. Note this is not recommended for production. Doing only for bajaj  Not a intern which does DROP Table users; LOL 
    methods: [ 'POST'], // Only allow POST method for /bfhl endpoint
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

app.use('/bfhl', bfhlRoutes);


app.use(errorHandler);


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});