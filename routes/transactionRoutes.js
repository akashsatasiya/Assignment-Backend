const express = require("express");
const transactionController = require("../controllers/transControllers");
const router = express.Router();

// routes for view, save or update transaction 
router.route("/transaction/:transaction_id").get(transactionController.getTransactionById).put(transactionController.saveOrUpdateTransaction);


// route for view transaction of same type
router.route("/types/:type").get(transactionController.getAllIdByType);

// route for obtaining sum
router.route("/sum/:transaction_id").get(transactionController.getTotalSum);

module.exports = router;