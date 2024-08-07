const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Folder = require('./folder');

const ShareSchema = new Schema({
    expiresIn: {type: Date, required: true},
    folder: {type: Schema.Types.ObjectId, ref: Folder},
    url: {type: String, required: true}
});

module.exports = mongoose.model("Share", ShareSchema);