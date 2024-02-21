const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User.js');
const Listing = require('./models/Listing.js');
const Booking = require('./models/Booking.js');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const fs = require('fs');

require('dotenv').config();
const app = express();

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = 'jeqfoiqbfw839';

app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname+'/uploads'));
app.use(cors({
  credentials: true,
  origin: 'http://localhost:5173',
}));

mongoose.connect(process.env.MONGO_URL);

function getUserDataFromToken(req) {
  return new Promise((resolve, reject) => {
    jwt.verify(req.cookies.token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      resolve(userData);
    });
  });
}

app.get('/test', (req, res) => {
  res.json('test ok');
});

app.post('/register', async (req,res) => {
  const {name,email,password} = req.body;

  try {
    const userDoc = await User.create({
      name,
      email,
      password:bcrypt.hashSync(password, bcryptSalt),
    })
    res.json(userDoc);
  } catch (e) {
    res.status(422).json(e);
  }
});

app.post('/login', async (req,res) => {
  const {email,password} = req.body;
  const userDoc = await User.findOne({email});
  if (userDoc) {
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
      jwt.sign({email:userDoc.email, id:userDoc._id}, jwtSecret, {}, (err,token) => {
        if (err) throw err;
        res.cookie('token', token).json(userDoc);
      });
    } else {
      res.status(422).json('pass not ok');
    }
  } else {
    res.json('not found');
  }
});

app.get('/profile', (req,res) => {
  const {token} = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      const {name,email,_id} = await User.findById(userData.id);
      res.json({name,email,_id});
    });
  } else {
    res.json(null);
  }
})

app.post('/logout', (req,res) => {
  res.cookie('token', '').json(true);
});

const photosMiddleware = multer({dest:'uploads/'});
app.post('/upload', photosMiddleware.array('photos', 5), (req,res) => {
  const uploadedFiles = [];
  for (let i = 0; i < req.files.length; i++) {
    const {path,originalname} = req.files[i];
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    const newPath = path + '.' + ext;
    fs.renameSync(path, newPath);
    uploadedFiles.push(newPath.replace('uploads\\',''));
  }
  res.json(uploadedFiles);
});

app.post('/listings', (req,res) => {
  const {token} = req.cookies;
  const {title,address,addedPhotos,description,extraInfo,parkingFrom,parkingUntil,price,walletAddress,} = req.body;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const listingDoc = await Listing.create({
      owner:userData.id,
      title,address,photos:addedPhotos,description,extraInfo,parkingFrom,parkingUntil,price,walletAddress,
    });
    res.json(listingDoc);
  });
});

app.get('/user-listings', (req,res) => {
  const {token} = req.cookies;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    const {id} = userData;
    res.json( await Listing.find({owner:id}) );
  });
});

app.get('/listings/:id', async (req,res) => {
  const {id} = req.params;
  res.json(await Listing.findById(id));
});

app.put('/listings', async (req,res) => {
  const {token} = req.cookies;
  const {id, title,address,addedPhotos,description,extraInfo,parkingFrom,parkingUntil,price,walletAddress,} = req.body;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    const listingDoc = await Listing.findById(id);
    if (userData.id === listingDoc.owner.toString()) {
      listingDoc.set({
        title,address,photos:addedPhotos,description,extraInfo,parkingFrom,parkingUntil,price,walletAddress,
      });
      await listingDoc.save();
      res.json('ok');
    }
  });
});

app.get('/listings', async (req,res) => {
  res.json( await Listing.find() );
})

app.post('/bookings', async (req,res) => {
  const userData = await getUserDataFromToken(req);
  const {listing,parkingFrom,parkingUntil,name,phone,price,} = req.body;
  Booking.create({
    listing,parkingFrom,parkingUntil,name,phone,price,user:userData.id,
  }).then((doc) => {
    res.json(doc);
  }).catch((err) => {
    throw err;
  });
});

app.get('/bookings', async (req,res) => {
  const userData = await getUserDataFromToken(req);
  res.json( await Booking.find({user:userData.id}).populate('listing'));
});

app.listen(4000);
