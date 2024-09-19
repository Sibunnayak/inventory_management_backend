const express = require('express');
const router = express.Router();
const { ensureAuthenticated, checkRole } = require('../Middlewares/Auth');
const {
    createItem,
    getItems,
    updateItem,
    deleteItem,
    scanQRCode
} = require('../Controllers/itemController');

// Route to create a new item
router.post('/inventory-create', ensureAuthenticated, checkRole(['admin']), createItem);

// Route to get all items
router.get('/inventory-list', ensureAuthenticated, getItems);

// Route to update an item
router.put('/inventory/:id', ensureAuthenticated, checkRole(['admin']), updateItem);

// Route to delete an item
router.delete('/inventory/:id', ensureAuthenticated, checkRole(['admin']), deleteItem);

// Route to scan a QR code
router.post('/scan-qrCode', ensureAuthenticated, checkRole(['user']), scanQRCode);

module.exports = router;
