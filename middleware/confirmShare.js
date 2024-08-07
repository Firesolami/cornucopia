const asyncHandler = require('express-async-handler');
const Share = require('../models/share');
module.exports = asyncHandler( async (req, res, next) => {
    const confirmShare = await Share.findOne({ url: req.params.shareId });
    if (!confirmShare) {
        return res.status(400).json({
            status: "error",
            message: "Share URL does not exist"
        });
    }
    if (Date.now() > confirmShare.expiresIn) {
        return res.status(400).json({
            status: "error",
            message: "Share URL has expired"
        });
    } 
    next();
});