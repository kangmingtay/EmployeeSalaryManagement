var express = require('express')
var router = express.Router()

const createHandler = require('../handlers/userHandler').handleCreateRequest;
const showHandler = require('../handlers/userHandler').handleShowRequest;
const showAllUsersHandler = require('../handlers/userHandler').handleShowAllRequest;
const deleteHandler = require('../handlers/userHandler').handleDeleteRequest;
const editHandler = require('../handlers/userHandler').handleEditRequest;
const uploadHandler = require('../handlers/userHandler').handleUploadFileRequest;

router.get('/:id', (req, res) => showHandler(req, res));
router.post('/:id', (req, res) => createHandler(req, res));
router.patch('/:id', (req, res) => editHandler(req, res));
router.delete('/:id', (req, res) => deleteHandler(req, res));
router.get('/', (req, res) => showAllUsersHandler(req, res));
router.post('/upload', (req, res) => uploadHandler(req, res));

module.exports = router
