const Transaction = require("../models/Transaction");

exports.getTransactionById = async(req, res, next) => {
    try {
        let transaction_id = req.params.transaction_id;
        let [transaction, _] = await Transaction.findById(transaction_id);

        // check if transaction_id present
        if(transaction.length == 0) {
            res.status(404).json("Transaction with Given ID Not Found");
        }
        else {
            res.status(200).json({amount : transaction[0].amount, type : transaction[0].type, parent : transaction[0].parent_id});
        }
    }
    catch (error){
        next(error);
    }
};

exports.getAllIdByType = async(req, res, next) => {
    try {
        let transaction_type = req.params.type;
        let [id_list, _] = await Transaction.findByType(transaction_type);
        
        //Create array of transactions of same type
        const final_id_list = [];
        for(let i = 0; i < id_list.length; i++) {
            final_id_list.push(id_list[i].transaction_id);
        }

        res.status(200).json(final_id_list);
    }
    catch(error) {
        next(error);
    }
};

exports.getTotalSum = async(req, res, next) => {
    try {
        let transaction_id = req.params.transaction_id;
        let [sum, _] = await Transaction.getTotalSum(transaction_id);
        sum = sum[0].amount;

        res.status(200).json({"amount" : Number(sum)});
    }
    catch(error) {
        next(error);
    }
};

exports.saveOrUpdateTransaction = async(req, res, next) => {
    try {
        //create new transaction objects from inputs
        let transaction_id = req.params.transaction_id;
        let {type, amount} = req.body;

        let parent_id = null;
        //check if parent_id property passed
        if(req.body.hasOwnProperty("parent_id")) {
            parent_id = req.body.parent_id;
        }
        let new_transaction = new Transaction(transaction_id, type, amount, parent_id);

        let [transaction, _] = await Transaction.findById(transaction_id);
        // if transaction_id not present then create new entry in Database Table
        if(transaction.length == 0) {
            new_transaction = await new_transaction.save();
        }
        // if transaction_id present update the existing entry
        else {
            new_transaction = await new_transaction.update();
        }

        res.status(201).json({status : "ok"});
    }
    catch (error) {
        next(error);
    }
};  