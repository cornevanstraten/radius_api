const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); //securing hashing of passwords
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const hostname = process.env.HOSTNAME;
const cloudinary = require('cloudinary');

cloudinary.config({
  cloud_name: 'openclassroom',
  api_key: process.env.CLAPIKEY,
  api_secret: process.env.CLAPISECRET
});



exports.register = (req, res, next) => {
  User.find({email: req.body.email})
  .exec()
  .then(foundUser => {//returns an array of found users
    if(foundUser.length > 0){
      return res.status(409).json({
        message: "This email already exists"
      })
    } else {
      bcrypt.hash(req.body.password, 10, (err, hash) => { //10 rounds of salt
        if (err) {
          return res.status(500).json({
            error: err
          });
        } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              firstName: req.body.firstName,
              lastName: req.body.lastName,
              email: req.body.email,
              password: hash
            })
            user.save()
            .then(newUser => {
              console.log(newUser)
              res.status(201).json({
                message: 'User created'
              })
            })
            .catch(err => {
              console.log(err)
              res.status(500).json({
                error: err
              })
            });
        }
      })
    }
  });
}

exports.login = (req, res, next) => {
  User.find({email: req.body.email})
  .exec()
  .then(foundUser => {
    if(foundUser.length < 1) {
      return res.status(401).json({
        message: "Authorization failed"
      })
    }
    bcrypt.compare(req.body.password, foundUser[0].password, (err, result) => {
      if(err){
        return res.status(401).json({
          message: "Authorization failed"
          })
        }
      if (result) {
        const token = jwt.sign(
          {
          firstName: foundUser[0].firstName,
          lastName: foundUser[0].lastName,
          avatar: foundUser[0].avatar.public_id,
          email: foundUser[0].email,
          userId: foundUser[0]._id
          },
          process.env.JWT_KEY,
          {
            expiresIn: "8h",
          }
        );
        return res.status(200).json({
          message: "Authorization successful",
          token: token
        })
      }
      return res.status(401).json({
        message: "Authorization failed"
      })
    })
  })
  .catch(err => {
    console.log(err)
    res.status(500).json({
      error: err
    })
  });
}


exports.get_user = (req, res, next) => {
  const id = req.params.userId;
  User.findById(id)
  .select('firstName lastName email avatar bio')
  .exec()
  .then(foundUser => {
    console.log(foundUser);
    if(foundUser){
      res.status(200).json(foundUser);
    } else {
      res.status(404).json({
        message: 'No user found'
      })
    }
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({error: err});
  });
}

exports.avatar = (req, res, next) => {
    const id = req.params.userId;
    if(!req.file){
      return res.status(500).json({ error: "Image file required" })
    }
    cloudinary.v2.uploader.upload(req.file.path, {public_id: req.userData.avatar})
    .then(response => {
      console.log(response)
      return User.updateOne({_id: id}, { $set: {
                avatar: {
                  public_id: response.public_id,
                  version: response.version,
                  url: response.secure_url
                }
          }
        }).exec()
    })
    .then(result => {
      res.status(200).json({
        message: 'Avatar updated!',
        request: {
          type: 'GET',
          url: hostname + '/users/' + id
        }
      })
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      })
    });
}

exports.update = (req, res, next) => {
  const id = req.params.userId;
  const updateOps = {};
  for (const ops of req.body){
    updateOps[ops.propName] = ops.value;
  }
  console.log(updateOps)
  User.updateOne({_id: id}, {$set: updateOps})
  .exec()
  .then(result => {
    res.status(200).json({
      message: 'User successfully updated!',
      request: {
        type: 'GET',
        url: hostname + '/users/' + id
      }
    })
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({
      error: err
    })
  });
}



exports.destroy = (req, res, next) => {
  User.remove({_id: req.params.userId}).exec()
  .then(result => {
    res.status(200).json({
      message: "User deleted"
    });
  })
  .catch(err => {
    console.log(err)
    res.status(500).json({
      error: err
    });
  })
}
