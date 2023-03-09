const db = require("../utils/db");
const { paginate } = require('./../config/default.json');

module.exports = {
    async All(){
        const sql = 'select * from book';
        const [rows,fields] = await db.load(sql);
        return rows;
    },

    async single(id){
        const sql = "select book.*,user.fullName from book join user on book.sellerID = user.userID where bookID = " + id;
        const [rows,fields] = await db.load(sql);
        if(rows.length===0)
            return null;
        return rows[0];
    },

    async AllByCat(idCat){
        const sql = "select * from book where catID = " + idCat;
        const [rows,fields] = await db.load(sql);
        return rows;
    },

    async AllByUser(idUser){
        const sql = "select * from book where sellerID = " + idUser;
        const [rows,fields] = await db.load(sql);
        return rows;
    },

    async pageByCat(idCat, offset){
        const sql = "select * from book where catID = " + idCat +" limit "+ paginate.limit + " offset " + offset;
        const [rows,fields] = await db.load(sql);
        return rows;
    },

    async countByCat(idCat){
        const sql = "select count(*) as total from book where catID = " + idCat;
        const [rows,fields] = await db.load(sql);
        return rows[0].total;
    },

    async add(book){
        const [rows, fields] = await db.add(book,'book');
        return rows;
    },

    async del(id){
        const condition =  {
           bookID: id
        };
        const [rows, fields] = await db.del(condition,'book');
        return rows;
    },

    async update(entity){
        const condition =  {
           bookID: entity.bookID
        };
        delete (entity.bookID);
        const [rows, fields] = await db.update(entity, condition,'book');
        return rows;
    },

    async searchBook(search){
        const sql = `select * from bookworm.book where match(bookName, authorName) AGAINST('${search}' WITH QUERY EXPANSION)`;
        const [rows,fields] = await db.load(sql);
        return rows;
    },
    
    async bestSell(limit, offset){
        const sql = "SELECT book.* FROM orders join book on orders.bookID = book.bookID group by orders.bookID order by count(orders.orderID) DESC limit " + limit + " offset " + offset;
        const [rows,fields] = await db.load(sql);
        return rows;
    },

    async newSell(limit, offset){
        const sql = "SELECT book.* FROM orders join book on orders.bookID = book.bookID group by orders.bookID order by book.datePublished DESC limit " + limit + " offset " + offset;
        const [rows,fields] = await db.load(sql);
        return rows;
    },

    async commonSell(limit, offset){
        const sql = "SELECT book.* FROM orders join book on orders.bookID = book.bookID group by orders.bookID order by sum(orders.quantity) DESC limit " + limit + " offset " + offset;
        const [rows,fields] = await db.load(sql);
        return rows;
    },

    async highSell(limit, offset){
        const sql = "SELECT * FROM book order by book.bookPrice DESC limit " + limit + " offset " + offset;
        const [rows,fields] = await db.load(sql);
        return rows;
    },

    async lowSell(limit, offset){
        const sql = "SELECT * FROM book order by book.bookPrice ASC limit " + limit + " offset " + offset;
        const [rows,fields] = await db.load(sql);
        return rows;
    }
};