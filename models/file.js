const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user');
const Folder = require('./folder');

const FileSchema = new Schema({
    name: {type: String, required: true},
    createdAt: {type: Date, required: true},
    size: {type: Number, required: true},
    imageUrl: {type: String, required: true},
    publicId: {type: String, required: true},
    user: {type: Schema.Types.ObjectId, ref: User, required: true},
    folder: {type: Schema.Types.ObjectId, ref: Folder},
});

FileSchema.virtual("url").get(function() {
    return `/storage/${this._id}`;
});

FileSchema.set('toJSON', { virtuals: true });
FileSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model("File", FileSchema);