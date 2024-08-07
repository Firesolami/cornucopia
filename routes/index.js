const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller');

/*
 POST /signin
 POST /signup
 GET /home
 GET /storage
 POST /upload-photo
 GET /folders
 POST /create-folder
 POST /upload-to-folder
 GET /user-info
 GET /folder-names
 GET /storage/:id
 GET /folders/:id
 PATCH /folders/:id/update
 PATCH /storage/:id/update
 DELETE /storage/:id/delete
 DELETE /folders/:id/delete
 POST /generate-share-url
 GET /share/:shareId
 GET /share/:shareId/storage/:id
*/

router.post('/signup', controller.signup);

router.post('/signin', controller.signin);

router.get('/home', controller.home);

router.get('/user-info', controller.user_info);

router.get('/storage', controller.storage);

router.get('/storage/:id', controller.storage_detail);

router.post('/upload-to-folder', controller.upload_to_folder);

router.post('/upload-photo', controller.upload_photo);

router.patch('/update-photo', controller.update_photo);

router.get('/folders', controller.folders);

router.get('/folders/:id', controller.folder_detail);

router.get('/folder-names', controller.folder_names);

router.post('/create-folder', controller.create_folder);

router.patch('/update-folder', controller.update_folder);

router.delete('/storage/:id/delete', controller.delete_photo);

router.delete('/folders/:id/delete', controller.delete_folder);

router.post('/generate-share-url', controller.generate_share_url);

router.get('/share/:shareId', controller.share_folder_detail);

router.get('/share/:shareId/storage/:id', controller.share_folder_photo);

module.exports = router;