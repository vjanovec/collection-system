const express = require("express");
const router = express.Router();
const bodyParser = require('body-parser');
const mainController = require('../controllers/main');

router.get('/orders/:branchId', mainController.getOrders); 

router.get('/last-order/:branchId', mainController.getLastOrder);
//router.get('/last-order/:branchId', mainController.getLastOrder);

router.post('/add-order', mainController.postAddOrder);

router.put('/update-order/:id', mainController.putUpdateOrder);

router.delete('/delete-order/:id', mainController.deleteOrderById);

router.post('/login', mainController.login);

router.get('/branch-id/:id', mainController.getBranchById);



module.exports = router;