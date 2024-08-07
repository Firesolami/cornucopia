const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user');

const FolderSchema = new Schema({
    name: {type: String, required: true},
    createdAt: {type: Date, required: true},
    size: {type: Number, default: 0},
    user: {type: Schema.Types.ObjectId, ref: User, required: true},
    publicId: [String],
});

FolderSchema.virtual("url").get(function() {
    return `/folders/${this._id}`;
});

FolderSchema.set('toJSON', { virtuals: true });
FolderSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model("Folder", FolderSchema);