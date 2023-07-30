const mongoose = require("mongoose");
// Define mongoose schemas
const userSchema = new mongoose.Schema({
    username: {type: String},
    password: String,
    Rooms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Room' }]
  });
  
  const RoomSchema = new mongoose.Schema({
    uniquename: String,
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  });



  const User = mongoose.model('User',userSchema);
  const Room = mongoose.model('Room',RoomSchema);

  module.exports = {
    User,
    Room}