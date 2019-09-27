const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const Room = require('../models/room.js');

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get(`/main`, (req, res, next) => {
  Room.find()
    .then((data) => {
      res.render(`main`, { room: data });
    })
});

router.post(`/createRoom`, (req, res, next) => {
  const name=req.body.roomName;
  const description=req.body.roomName;
  const imageUrl=req.body.imgURL;
  const owner = req.session.currentUser._id;
  
  const reviews = [];
  const newRoom = new Room({ name: name, description: description, imageUrl: imageUrl, owner: owner, reviews: reviews});
  newRoom.save()
  .then((room) => {
      res.redirect('/main');
  })
  .catch((err) => {
      res.redirect('/main')
      console.log(err);
  })
})

router.use((req, res, next) => {
  if (req.session.currentUser) { // <== if there's user in the session (user is logged in)
    next(); // ==> go to the next route ---
  } else {                          //    |
    res.redirect("/login");         //    |
  }                                 //    |
}); // ------------------------------------                                
//     | 
//     V

router.get(`/createRoom`, (req, res, next) => {
  res.render(`createRoom`);
});
router.post(`/createRoom`, (req, res, next) => {
  const name=req.body.roomName;
  const description=req.body.roomName;
  const imageUrl=req.body.imgURL;
  const owner = req.session.currentUser._id;
  
  const reviews = [];
  const newRoom = new Room({ name: name, description: description, imageUrl: imageUrl, owner: owner, reviews: reviews});
  newRoom.create()
  .then(() => {
      res.redirect('/');
  })
  .catch((err) => {
      res.redirect('/main')
      console.log(err);
  })
})

/*router.use((req, res, next) => {
  if (req.session.currentUser) { // <== if there's user in the session (user is logged in)
    next(); // ==> go to the next route ---
  } else {                          //    |
    res.redirect("/login");         //    |
  }                                 //    |
}); // ------------------------------------                                
//     | 
//     V
router.get("/secret", (req, res, next) => {
  res.render("secret");
});*/

module.exports = router;
