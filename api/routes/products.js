const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer'); //bodyParser for files
const checkAuth = require('../middleware/check-auth');
const ProductsController = require('../controllers/products')


const storage = multer.diskStorage({
  destination: function(req, file, cb){//cb: callback
    cb(null, './uploads/')
  },
  filename: function(req, file, cb){
    cb(null, new Date() + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  //reject a files
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


router.get('/', ProductsController.get_all);

router.post('/', checkAuth, upload.single('productImage'), ProductsController.create_new);

router.get('/:productId', ProductsController.get_product);

router.patch('/:productId', checkAuth, ProductsController.update_product);

router.delete('/:productId', checkAuth, ProductsController.destroy);



module.exports = router;
