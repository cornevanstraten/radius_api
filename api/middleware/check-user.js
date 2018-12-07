const Listing = require('../models/listing');


module.exports = (req, res, next) => {
  const userId = req.params.userId;
  if(userId == req.userData.userId){
    console.log("Authorized")
    next()
  } else {
    res.status(201).json({
      message: 'You are not authorized'
    })
  }
}
