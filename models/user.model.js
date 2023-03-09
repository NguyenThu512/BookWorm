//const {  } = require("../controllers/user.route");

const { update } = require("../utils/db");
const db = require("../utils/db");

module.exports = {

    /*async single(id) {
        const sql = `select * from users where id = ${id}`;
        const [rows, fields] = await db.load(sql);
        if (rows.length === 0)
          return null;
    
        return rows[0];
      },*/

    async add(user){
        const [rows, fields] = await db.add(user,'user');
        return rows;
    },

    async singleByUserName(username){
        const sql = 'select * from user where userName = ' + '"' + username + '"';
        const [rows,fields] = await db.load(sql);
        if(rows.length===0)
            return null;
        return rows[0];
    },

    async update(entity){
        const condition =  {
           userID: entity.userID
        };
        delete (entity.userID);
        const [rows, fields] = await db.update(entity, condition,'user');
        return rows;
    }
}