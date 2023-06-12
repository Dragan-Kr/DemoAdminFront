const express = require('express');
const app = express();//konekcija(izmedju ostalog)
const multer=require('multer');

var storage = multer.diskStorage({
    destination:(req,file,cb)=>{
      cb(null,'uploads/')
    },
    filename:(req,file,cb)=>{
      cb(null,file.originalname)
    }
  })
  var upload = multer({storage:storage});
  
//   app.use('/uploads', express.static('uploads'));


const uploadMultipleImages = (req, res) => {
    upload.array('images2', 20)(req, res, (err) => {

      console.log("MULTIPLE IMMMAGES")
      if (err instanceof multer.MulterError) {
        // Handle Multer errors
        return res.status(500).json({ code: 500, msg: 'Error uploading images' });
      } else if (err) {
        // Handle other errors
        return res.status(500).json({ code: 500, msg: 'Server error' });
      }
  
      // Check if no file was uploaded
      if (!req.files) {
        return res.status(500).json({ code: 500, msg: 'No file uploaded' });
      }
  
      // Process the uploaded files
      // Access the files using req.files array
      console.log('Uploaded files:', req.files);
  
      // Send response indicating successful upload
      return res.status(200).json({ code: 200, msg: 'Files uploaded successfully' });
    });
  };
  

  const uploadOneImage = (req, res) => {
    upload.single('file')(req, res, (err) => {
      console.log("ONE IMMMAGE")
      if (err instanceof multer.MulterError) {
        // Handle Multer errors
        return res.status(500).json({ code: 500, msg: 'Error uploading file' });
      } else if (err) {
        // Handle other errors
        return res.status(500).json({ code: 500, msg: 'Server error' });
      }
  
      // Check if no file was uploaded
      if (!req.file) {
        return res.status(500).json({ code: 500, msg: 'No file uploaded' });
      }
  
      // Process the uploaded file
      // Access the file using req.file object
      console.log('Uploaded file:', req.file);
  
      // Send response indicating successful upload
      return res.status(200).json({ code: 200, msg: 'File uploaded successfully' });
    });
  };

  module.exports = { uploadMultipleImages,uploadOneImage };