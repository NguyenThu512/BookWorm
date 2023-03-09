const mysql = require('mysql2');
const mysql_opts=require('../config/default.json').mysql;

const pool = mysql.createPool(mysql_opts);

const promisePool = pool.promise();

module.exports={
    load(sql)
    {
        return promisePool.query(sql); //[rows,fields]
    },

    add(entity, tableName){
        
        const sql = "insert into " + tableName + " set ?" ;
        return promisePool.query(sql, entity);
    },

    del(condition, tableName){
        const sql = "delete from " + tableName + " where ?";
        return promisePool.query(sql, condition);
    },

    update(newData, condition,tableName){
        const sql = "update " + tableName + " set ? where ?";
        return promisePool.query(sql,[newData, condition]);
    }
};