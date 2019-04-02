const multer = require('multer');

const upload = multer({
  //Set constrictions for security and performance purposes (prevent DDOS)
  limits: {
    fileSize: 4 * 1024 * 1024,
  },
});

module.exports.upload = upload;

module.exports.handleAvatar = avatars => async (req, res, next) => {
  //Make sure there is a file, and it is of the right format
  if(!req.file) return next();
  if(req.file.mimetype !== 'image/png' && req.file.mimetype !== 'image/jpeg') {
    return next(new Error('File format is not supported'));
  }

  req.file.storedFilename = await avatars.store(req.file.buffer);
  return next();
}