// Load environment variables
require('dotenv').config();

const express = require('express');
const AWS = require('aws-sdk');
const app = express();
const cors = require('cors');
const port = 3000;

// Allow requests from your frontend domain
const corsOptions = {
  origin: 'http://tests3react-ssgdhj.s3-website.us-east-2.amazonaws.com',
  optionsSuccessStatus: 200
};


// Configure AWS SDK
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});
console.log(`Region: ${process.env.AWS_REGION}`);
const dynamoDB = new AWS.DynamoDB.DocumentClient();



app.use(cors(corsOptions));
app.use(express.json());

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const params = {
    TableName: 'Users',
    Key: { username },
  };

  try {
    const data = await dynamoDB.get(params).promise();
    if (data.Item && data.Item.password === password) {
      res.status(200).send('Login successful');
    } else {
      res.status(401).send('Invalid credentials');
    }
  } catch (error) {
    res.status(500).send('Error fetching user');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
