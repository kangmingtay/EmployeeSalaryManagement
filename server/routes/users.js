var express = require('express')
var router = express.Router()

const showAllUsersHandler = require('../handlers/userHandler').handleShowAllRequest;
const updateHandler = require('../handlers/userHandler').handleUploadFileRequest;

router.get('/', (req, res) => showAllUsersHandler(req, res));
router.post('/update', (req, res) => updateHandler(req, res));


module.exports = router
