const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller');

router.post('/signup', controller.signup);

router.post('/signin', controller.signin);

router.get('/home', controller.home);

router.get('/user-info', controller.user_info);

router.get('/storage', controller.storage);

router.get('/storage/:id', controller.storage_detail);

router.post('/folders/:id', controller.upload_to_folder);

router.post('/storage', controller.upload_photo);

router.patch('/storage/:id', controller.update_photo);

router.get('/folders', controller.folders);

router.get('/folders/:id', controller.folder_detail);

router.get('/folder-names', controller.folder_names);

router.post('/folders', controller.create_folder);

router.patch('/folders/:id', controller.update_folder);

router.delete('/storage/:id', controller.delete_photo);

router.delete('/folders/:id', controller.delete_folder);

router.post('/generate-share-url', controller.generate_share_url);

router.get('/share/:shareId', controller.share_folder_detail);

router.get('/share/:shareId/storage/:id', controller.share_folder_photo);

module.exports = router;