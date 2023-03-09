/*const express = require('express');
const multer = require('multer');

const router = express.Router();

router.get('/editor', function (req, res) {
  res.render('vwDemo/editor');
})

router.post('/editor', function (req, res) {
  console.log(req.body.desc);
  res.render('vwDemo/editor');
})

router.get('/upload', function (req, res) {
  res.render('vwDemo/upload');
})

router.post('/upload', function (req, res) {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/imgs');
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
      // cb(null, file.fieldname + '-' + Date.now())
    }
  });
  const upload = multer({ storage: storage });
  upload.array('fuMain', 3)(req, res, function (err) {
    console.log(req.body);
    if (err) {
      console.log(err);
    } else {
      res.render('vwDemo/upload');
    }
  });
})

module.exports = router;
*/