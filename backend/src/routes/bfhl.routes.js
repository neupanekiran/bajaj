// bfhl.routes.js for defining the /bfhl endpoint and routing logic
const express = require('express');
const { handleBfhlRequest } = require('../controllers/bfhl.controller');

const router = express.Router();

router.post('/', handleBfhlRequest);

module.exports = router;