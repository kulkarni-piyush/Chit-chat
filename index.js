const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors'); 
const router = require("./routes/route.js");
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const PORT = 3000;
app.use(cors());
app.use(express.json());
app.use('/chat',router);

mongoose.connect('mongodb+srv://piyushkulkarni:EdjFKc26KGwxg.T@cluster0.mpjzl9q.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//socket logic


server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
