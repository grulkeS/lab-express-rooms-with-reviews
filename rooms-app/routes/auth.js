const express = require('express');
const router = express.Router();
const User = require('../models/user.js');

const bcrypt = require("bcryptjs");
const bcryptSalt = 10;

router.get('/signup', (req, res, next) => {
    res.render('auth/signup');
})

router.post('/signup', (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const fullName = req.body.fullName;
    if (email === "" || password === "") {
        res.render("auth/signup", {
            errorMessage: "Indicate a email and a password to sign up"
        });
        return;
    }
    User.findOne({ "email": email })
        .then(data => {
            if (data !== null) {
                res.render("auth/signup", {
                    errorMessage: "The account with this " + email + " already exists!"
                });
                return;
            }
            const salt = bcrypt.genSaltSync(bcryptSalt);
            const hashPass = bcrypt.hashSync(password, salt);
            
            const newUser = new User({ email: email, password: hashPass, fullName: fullName });
            newUser.save()
                .then((user) => {
                    res.redirect('/');
                })
                .catch((err) => {
                    res.redirect('/signup')
                    console.log(err);
                })
        })
    });
    router.get('/login', (req, res, next) => {
        res.render('auth/login')
    });
    router.post('/login', (req, res, next) => {
        const email = req.body.email;
        const password = req.body.password;

    
  if (email === "" || password === "") {
    res.render("auth/login", {
      errorMessage: "Please enter both, email and password to sign up."
    });
    return;
  }

  User.findOne({ "email": email })
  .then(user => {
      if (!user) {
        res.render("auth/login", {
          errorMessage: `The account by this ` + email + ` doesn't exist.`
        });
        return;
      }
      if (bcrypt.compareSync(password, user.password)) {
        // Save the login in the session!
        req.session.currentUser = user;
        
        res.redirect("/");
      } else {
        res.render("auth/login", {
          errorMessage: "Incorrect password"
        });
      }
  })
  .catch(error => {
    next(error);
  })
});

router.get(`/logout`, (req, res, next) => {
    req.session.destroy((err) => {
        res.redirect(`/`);
    })
})

        module.exports = router;