const User = require('../models/user');
const File = require('../models/file');
const Folder = require('../models/folder');
const Share = require('../models/share');
require('../auth/passport');
const passport = require('passport');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const upload = require('../config/multer');
const confirmShare = require('../middleware/confirmShare');
const cloudinary = require('../config/cloudinary');

exports.signup = [
    body("username", "Username must be at least 3 characters long.")
        .trim()
        .isLength({ min: 3 })
        .escape(),
    body("password", "Password must be at least 8 characters long.")
        .trim()
        .isLength({ min: 8 })
        .escape(),
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: "error",
                message: errors.array()[0].msg
            });
        }
        const user = await User.findOne({ username: req.body.username });
        if (user !== null) {
            return res.status(400).json({
                status: "error",
                message: `Username ${req.body.username} already exists`
            });
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = new User({
            username: req.body.username,
            password: hashedPassword
        });

        await newUser.save();
        jwt.sign({
            id: newUser._id,
            username: req.body.username
        }, process.env.JWT_SECRET, { expiresIn: '7d' }, (err, token) => {
            if (err) {
                return res.status(500).json({
                    status: "error",
                    message: "Error generating token"
                });
            }
            return res.status(200).json({
                status: "success",
                token: `Bearer ${token}`,
                message: "Account created successfully."
            });
        });
    })
];

exports.signin = [
    body("username", "Username must be at least 3 characters long.")
        .trim()
        .isLength({ min: 3 })
        .escape(),
    body("password", "Password must be at least 8 characters long.")
        .trim()
        .isLength({ min: 8 })
        .escape(),
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: "error",
                message: errors.array()[0].msg
            });
        }
        const user = await User.findOne({ username: req.body.username });
        if (user === null) {
            return res.status(400).json({
                status: "error",
                message: "Incorrect username."
            });
        }
        const isCorrectPassword = await bcrypt.compare(req.body.password, user.password);

        if (isCorrectPassword) {
            jwt.sign({
                id: user._id,
                username: req.body.username
            }, process.env.JWT_SECRET, { expiresIn: '7d' }, (err, token) => {
                if (err) {
                    return res.status(500).json({
                        status: "error",
                        message: "Error generating token"
                    });
                }
                return res.status(200).json({
                    status: "success",
                    token: `Bearer ${token}`,
                    message: "Signin successful."
                });
            });
        } else {
            return res.status(400).json({
                status: "error",
                message: "Incorrect password."
            });
        }
    })
];

exports.home = [passport.authenticate('jwt', { session: false }), asyncHandler(async (req, res, next) => {
    const photos = await File.find({ user: req.user._id }).populate("folder", "name").select("name createdAt imageUrl folder").limit(8);
    return res.status(200).json({
        status: "success",
        photos,
        message: photos.length === 0 ? "No photos yet." : "Photos retrieved successfully."
    });
})];

exports.user_info = [passport.authenticate('jwt', { session: false }), asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('username');
    if (!user) {
        return res.status(404).json({
            status: "error",
            message: "User not found."
        });
    }
    return res.status(200).json({
        status: "success",
        user: {
            id: user._id,
            username: user.username
        }
    });
})];

exports.storage = [passport.authenticate('jwt', { session: false }), asyncHandler(async (req, res, next) => {
    const photos = await File.find({ user: req.user._id }).populate("folder", "name").select("name createdAt imageUrl folder");
    return res.status(200).json({
        status: "success",
        photos,
        message: photos.length === 0 ? "No photos yet." : "Photos retrieved successfully."
    });
})];

exports.storage_detail = [passport.authenticate('jwt', { session: false }), asyncHandler(async (req, res, next) => {
    const photo = await File.findOne({ _id: req.params.id, user: req.user._id }).select("name createdAt imageUrl folder size").populate("folder", "name");
    if (!photo) {
        return res.status(404).json({
            status: "error",
            message: "Photo not found."
        });
    }
    return res.status(200).json({
        status: "success",
        photo,
        message: "Photo retrieved successfully."
    });
})];

exports.upload_photo = [passport.authenticate('jwt', { session: false }), upload.single('file'), asyncHandler(async (req, res, next) => {
    if (req.file) {
        const duplicate = await File.findOne({ name: req.file.originalname, user: req.user._id });
        if (duplicate) {
            await cloudinary.uploader.destroy(req.file.filename);
            return res.status(400).json({
                status: "error",
                message: "Name already in use."
            })
        }
        const photo = new File({
            name: req.file.originalname,
            createdAt: Date.now() + 3600000,
            size: req.file.size,
            imageUrl: req.file.path,
            user: req.user._id,
            publicId: req.file.filename
        });
        await photo.save();

        const selectedPhoto = await File.findById(photo._id).select("name createdAt imageUrl");
        return res.status(201).json({
            status: "success",
            photo: selectedPhoto,
            message: "Photo uploaded successfully."
        });
    } else {
        return res.status(400).json({
            status: "error",
            message: "No photo selected."
        });
    }
})];

exports.update_photo = [passport.authenticate('jwt', { session: false }), asyncHandler(async (req, res, next) => {
    if (req.body.photoName) {
        const duplicate = await File.findOne({ name: req.body.photoName, user: req.user._id });
        if (duplicate) {
            return res.status(400).json({
                status: "error",
                message: "Name already in use."
            })
        }
        await File.findByIdAndUpdate(req.params.id, { $set : { name: req.body.photoName } });
        return res.status(200).json({
            status: "success",
            message: "Photo updated successfully."
        });
    } else {
        return res.status(400).json({
            status: "error",
            message: "Photo name required."
        });
    }
})];

exports.folders = [passport.authenticate('jwt', { session: false }), asyncHandler(async (req, res, next) => {
    const folders = await Folder.find({ user: req.user._id }).select("name createdAt");
    return res.status(200).json({
        status: "success",
        folders,
        message: folders.length === 0 ? "No folders yet." : "Folders retrieved successfully."
    });
})];

exports.folder_detail = [passport.authenticate('jwt', { session: false }), asyncHandler(async (req, res, next) => {
    const folder = await Folder.findOne({ _id: req.params.id, user: req.user._id }).select("name createdAt size");
    if (!folder) {
        return res.status(404).json({
            status: "error",
            message: "Folder not found."
        });
    }
    const photos = await File.find({ folder: req.params.id }).select("name createdAt imageUrl");
    return res.status(200).json({
        status: "success",
        folder,
        photos,
        message: "Folder retrieved successfully."
    });
})];

exports.update_folder = [passport.authenticate('jwt', { session: false }), asyncHandler(async (req, res, next) => {
    if (req.body.folderName) {
        const duplicate = await Folder.findOne({ name: req.body.folderName, user: req.user._id });
        if (duplicate) {
            return res.status(400).json({
                status: "error",
                message: "Name already in use."
            })
        }
        await Folder.findByIdAndUpdate(req.params.id, { $set : { name: req.body.folderName } });
        return res.status(200).json({
            status: "success",
            message: "Folder updated successfully."
        });
    } else {
        return res.status(400).json({
            status: "error",
            message: "Folder name required."
        });
    }
})];

exports.folder_names = [passport.authenticate('jwt', { session: false }), asyncHandler(async (req, res, next) => {
    const folders = await Folder.find({ user: req.user._id }).select("name");
    return res.status(200).json({
        status: "success",
        folders,
        message: folders.length === 0 ? "No folders yet." : "Folders retrieved successfully."
    });
})];

exports.create_folder = [passport.authenticate('jwt', { session: false }), asyncHandler(async (req, res, next) => {
    const { folderName } = req.body;
    if (folderName) {
        const duplicate = await Folder.findOne({ name: folderName, user: req.user._id });
        if (duplicate) {
            return res.status(400).json({
                status: "error",
                message: "Folder name already in use."
            });
        }
        const folder = new Folder({
            name: folderName,
            createdAt: Date.now() + 3600000,
            user: req.user._id,
        });
        await folder.save();

        const selectedFolder = await Folder.findById(folder._id).select('name createdAt');

        return res.status(201).json({
            status: "success",
            folder: selectedFolder,
            message: "Folder created successfully."
        });
    } else {
        return res.status(400).json({
            status: "error",
            message: "No folder name provided."
        });
    }
})];

exports.upload_to_folder = [passport.authenticate('jwt', { session: false }), upload.single('file'), asyncHandler(async (req, res, next) => {
    const confirmFolder = await Folder.findOne({ _id: req.params.id, user: req.user._id });
    if (!confirmFolder) {
        if (req.file) {
            await cloudinary.uploader.destroy(req.file.filename);
        }
        return res.status(400).json({
            status: "error",
            message: "Invalid folder ID."
        });
    }

    const duplicate = await File.findOne({
        name: req.file.originalname,
        user: req.user._id,
        folder: req.params.id
    });

    if (duplicate) {
        if (req.file) {
            await cloudinary.uploader.destroy(req.file.filename);
        }
        return res.status(400).json({
            status: "error",
            message: "Name already in use."
        });
    }

    if (req.file) {
        const photo = new File({
            name: req.file.originalname,
            createdAt: Date.now() + 3600000,
            size: req.file.size,
            imageUrl: req.file.path,
            publicId: req.file.filename,
            user: req.user._id,
            folder: req.params.id,
        });

        await photo.save();

        const folder = await Folder.findOne({ _id: req.params.id }).select("size");
        const newSize = folder.size + req.file.size;

        await Folder.findByIdAndUpdate(req.params.id, {
            $push: { publicId: req.file.filename },
            $set: { size: newSize }
        });

        const selectedPhoto = await File.findById(photo._id).select("name createdAt imageUrl").populate("folder", "name");

        return res.status(201).json({
            status: "success",
            photo: selectedPhoto,
            message: `Photo uploaded successfully.`
        });
    } else {
        return res.status(400).json({
            status: "error",
            message: "No photo selected."
        });
    }
})];

exports.delete_photo = [passport.authenticate('jwt', { session: false }), asyncHandler(async (req, res, next) => {
    const photo = await File.findOne({ _id: req.params.id, user: req.user._id });
    if (!photo) {
        return res.status(404).json({
            status: "error",
            message: "Photo not found."
        });
    }
    await cloudinary.uploader.destroy(photo.publicId);
    await File.findByIdAndDelete(req.params.id);
    return res.status(200).json({
        status: "success",
        message: "Photo deleted successfully."
    })
})];

exports.delete_folder = [passport.authenticate('jwt', { session: false }), asyncHandler(async (req, res, next) => {
    const folder = await Folder.findOne({ _id: req.params.id, user: req.user._id });
    if (!folder) {
        return res.status(404).json({
            status: "error",
            message: "Folder not found."
        });
    }
    await cloudinary.api.delete_resources(folder.publicId);
    await File.deleteMany({ folder: req.params.id });
    await Folder.findByIdAndDelete(req.params.id);

    return res.status(200).json({
        status: "success",
        message: "Folder deleted successfully."
    })
})];

exports.generate_share_url = [passport.authenticate('jwt', { session: false }), asyncHandler(async (req, res, next) => {
    const { id, expiresIn } = req.body;
    if (id && expiresIn) {
        const expiresIn_obj = {
            "1d": 1,
            "7d": 7,
            "30d": 30
        };
        const expiresIn_num = expiresIn_obj[expiresIn];
        if (!expiresIn_num) {
            return res.status(400).json({
                status: "error",
                message: "Accepted values for expiresIn are 1d, 7d and 30d."
            });
        }
        const uuid = uuidv4();
        const share = new Share({
            expiresIn: Date.now() + (expiresIn_num * 24 * 60 * 60 * 1000),
            folder: id,
            url: uuid
        });
        await share.save();

        return res.status(201).json({
            status: "success",
            shareUrl: `/share/${uuid}`,
            message: "Share URL generated successfully."
        })
    } else {
        return res.status(400).json({
            status: "error",
            message: "ID and expiresIn required."
        });
    }
})];

exports.share_folder_detail = [confirmShare, asyncHandler(async (req, res, next) => {
    const confirmShare = await Share.findOne({ url: req.params.shareId });
    const folder = await Folder.findOne({ _id: confirmShare.folder }).select("name createdAt size");
    if (!folder) {
        return res.status(404).json({
            status: "error",
            message: "Folder not found."
        });
    }
    const photos = await File.find({ folder: confirmShare.folder }).select("name createdAt imageUrl");
    return res.status(200).json({
        status: "success",
        folder,
        photos,
        message: "Folder retrieved successfully."
    });
})];

exports.share_folder_photo = [confirmShare, asyncHandler(async (req, res, next) => {
    const photo = await File.findOne({ _id: req.params.id }).select("name createdAt imageUrl size");
    if (!photo) {
        return res.status(404).json({
            status: "error",
            message: "Photo not found."
        });
    }
    return res.status(200).json({
        status: "success",
        photo,
        message: "Photo retrieved successfully."
    });
})];
