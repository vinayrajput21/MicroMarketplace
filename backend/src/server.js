require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const port = process.env.PORT || 8080; 

connectDB().then(() => {

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
});
});