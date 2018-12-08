const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer'); //bodyParser for files
const checkAuth = require('../middleware/check-auth');
const checkOwner = require('../middleware/check-owner');
const HelpersController = require('../controllers/helpers')

var storage = multer.diskStorage({
  filename: function(req, file, cb) {
    cb(null, Date.now() + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
    cb(null, true); //save
  } else {
    cb(null, false); //ignore
  }
}

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, //5MB
  fileFilter: fileFilter
});


router.post('/image', checkAuth, upload.single('image'), HelpersController.upload_image);

// router.patch('/image/:public_id', checkAuth, upload.single('image'), HelpersController.update_image);

router.post('/geocode', HelpersController.geocode);


module.exports = router;
