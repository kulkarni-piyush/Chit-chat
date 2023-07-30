const mongoose = require("mongoose");
const express = require('express');
const jwt = require('jsonwebtoken');
const {User,Room} = require('../db');
const { SECRET } = require("../middleware/auth")
const { authenticateJwt } = require("../middleware/auth");

const router = express.Router();

router.post("/signup",async (req,res) =>{
const {username, password} = req.body;
  const user = await User.findOne({username});
  if(user){
    res.status(403).json({ message: 'User already exists' });
  }else{
    const obj ={username: username,password: password};
       const newuser = new User(obj);
       newuser.save();

       const token = jwt.sign({username ,role:user},SECRET,{expiresIn:'1h'});
       res.json({message: 'user created successfully', token});
  }
})

router.post("/signin",async (req,res) =>{
    const {username, password} = req.headers;
      const user = await User.findOne({username:username,password:password});
      if(user){
        const token = jwt.sign({username ,role:user},SECRET,{expiresIn:'1h'});
        res.json({message: 'user loggedin', token});
      }else{
        res.status(403).json({ message: 'User does not exist exists' });
      }
    })

router.get("/joinedRooms",authenticateJwt,async (req,res)=>{
    const user = await User.findOne({ username: req.user.username }).populate('Rooms');
    if(user){
        res.json(user);
    }else{
        res.sendStatus(404);
    }
})


router.get('/allrooms', authenticateJwt, async (req, res) => {
  const rooms = await Room.find({});
  res.json({rooms});
});


router.post("/joinroom/:roomname",authenticateJwt,async (req,res) =>{
    const room = await Room.findOne({ uniquename: req.params.roomname});
    if(room){
        const user = await User.findOne({ username: req.user.username });
           if(user){
            user.Rooms.push(room);
            await user.save();
            room.members.push(user);
            await room.save();
            res.json({ message: ''+user.username+' joined the room' });
           }else{
            res.status(403).json({ message: 'User not found' });
           }

}else{
    res.status(404).json({ message: 'Room not available' });
}
})

router.post("/createroom",authenticateJwt,async (req,res) =>{
   const {uniquename} = req.body;
   console.log(uniquename);
   const room = await Room.findOne({uniquename:uniquename});
  if(room){
    res.status(403).json({ message: 'Roomname already exists' });
  }else{
    const obj ={uniquename: uniquename};
       const newroom = new Room(obj);
       newroom.save();
       res.json({message: 'room created successfully'});
  }
})

module.exports = router;