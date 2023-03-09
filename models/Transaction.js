// Database Table Schema
// Table Name : transactionStore
// Fields for table :
// 1) transaction_id (long & primary key)
// 2) type (string)
// 3) amount (long)
// 4) parent_id (long)

const db = require("../config/db");

class Transaction {
    constructor(transaction_id, type, amount, parent_id) {
        this.transaction_id = transaction_id;
        this.type = type;
        this.amount = amount;
        this.parent_id = parent_id;
    }

    // save details in Database Table
    save() {
        let sql = `INSERT INTO transactionStore
                    (transaction_id, type, amount, parent_id)
                    VALUES
                    (${this.transaction_id}, '${this.type}','${this.amount}',${this.parent_id})`;

        return db.execute(sql);
    } 

    //update details in Database Table
    update() {
        let sql = `UPDATE store.transactionStore 
                    SET type = '${this.type}', amount = ${this.amount}, parent_id = ${this.parent_id} 
                    WHERE transaction_id = ${this.transaction_id};`;

        return db.execute(sql);
    }

    static findById(transaction_id) {
        let sql = `SELECT * FROM transactionStore WHERE transaction_id = ${transaction_id};`;
        return db.execute(sql);
    }

    static findByType(type) {
        let sql = `SELECT transaction_id FROM transactionStore WHERE type = "${type}";`;
        return db.execute(sql);
    }

    // recursively calculate sum for transaction_id 
    static getTotalSum(transaction_id) {
        let sql = `WITH RECURSIVE descendants AS (
            SELECT transaction_id, parent_id, amount
            FROM store.transactionStore
            WHERE transaction_id = ${transaction_id}
          
            UNION ALL
          
            SELECT store.transactionStore.transaction_id, store.transactionStore.parent_id, store.transactionStore.amount
            FROM store.transactionStore
            JOIN descendants ON store.transactionStore.parent_id = descendants.transaction_id
          )
          SELECT SUM(amount) as amount
          FROM descendants;`;

        return db.execute(sql);
    }
}

module.exports = Transaction;