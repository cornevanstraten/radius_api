const express = require('express');
const router = express.Router();
const multer = require('multer'); //bodyParser for files
const UserController = require('../controllers/users');
const checkAuth = require('../middleware/check-auth');
const checkUser = require('../middleware/check-user');

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


router.post('/register', UserController.register);

router.post('/login', UserController.login)

router.get('/:userId', UserController.get_user);

router.patch('/:userId', checkAuth, checkUser, UserController.update);

router.patch('/:userId/avatar', checkAuth, checkUser, upload.single('avatar'), UserController.avatar);

router.delete('/:userId', checkAuth, checkUser, UserController.destroy)


module.exports = router;


//logout route is not needed, because there is no session to delete. Tokens expire by themselves after a set amount of time. We could eventually create a token blacklist to provide logout functionality. For example:
// blacklistedToken.find('token').then(result => if(result.length > 0){Auth failed}
