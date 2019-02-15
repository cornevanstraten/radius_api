const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer'); //bodyParser for files
const checkAuth = require('../middleware/check-auth');
const checkOwner = require('../middleware/check-owner');
const ListingsController = require('../controllers/listings')

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



router.get('/', ListingsController.geo_get);

router.get('/_all', ListingsController.get_all); //for internal dashboards etc. 

router.post('/', checkAuth, ListingsController.create_new);

router.get('/:listingId', ListingsController.get_listing);

router.patch('/:listingId', checkAuth, checkOwner, ListingsController.update_listing);

router.delete('/:listingId', checkAuth, checkOwner, ListingsController.destroy);



module.exports = router;
