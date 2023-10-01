const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const path = require('path');
const mongoose = require('mongoose');
const db = mongoose.connection

const port = process.env.PORT || 8000;
const index = require("./routes/index");
const app = express();

const server = http.createServer(app);
const io = socketIo(server);  // < Interesting!

io.on("connection", socket => {
    console.log('client connected');
});

io.on('disconnect', () => {
    console.log('client disconnected');
});
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    req.io = io;
    next();
});

app.io = io;
app.use(express.urlencoded());
// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use(index);

app.use(express.static(path.join(__dirname, 'build')));


// app.get('/*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });

mongoose
  .connect(
    'mongodb+srv://diplomka-server:VH7Rb0Dzh78KCQIc@branches-awulu.mongodb.net/diplomka24?retryWrites=true&w=majority'
  ).then(() => server.listen(port, () => console.log(`Listening on port ${port}`)));