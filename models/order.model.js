const db = require('../utils/db');

module.exports = {
  async add(order){
    const [rows, fields] = await db.add(order,'orders');
    return rows;
  },

  async countSell0(idUser){
    const sql = `SELECT COUNT(orderID) AS NumberOrder FROM orders join book on orders.bookID = book.bookID where book.sellerID = '${idUser}' and orders.status = 0`;
    const [rows,fields] = await db.load(sql);
    return rows;
  },

  async AllBySellStatus(idUser, status){
    const sql = `SELECT orders.*, book.bookName FROM orders join book on orders.bookID = book.bookID where book.sellerID = '${idUser}' and orders.status = '${status}'` ;
    const [rows,fields] = await db.load(sql);
    return rows;
  },

  async OrderBuyQuantity(idOrder){
    const sql = `SELECT orders.bookID, orders.quantity as buy, book.quantity FROM orders join book on orders.bookID = book.bookID where orders.orderID = '${idOrder}' and orders.status = 0 ` ;
    const [rows,fields] = await db.load(sql);
    return rows;
  },

  async updateStatus(entity){
    const condition =  {
       orderID: entity.orderID
    };
    delete (entity.orderID);
    const [rows, fields] = await db.update(entity, condition,'orders');
    return rows;
  },

  async AllByBuyStatus(idUser, status){
    const sql = `SELECT orders.*, book.bookName, user.fullName FROM orders join book on orders.bookID = book.bookID join user on book.sellerID = user.userID where orders.buyerID = '${idUser}' and orders.status = '${status}'`;
    const [rows,fields] = await db.load(sql);
    return rows;
  },

  async delOrder(id){
    const condition =  {
       orderID: id
    };
    const [rows, fields] = await db.del(condition,'orders');
    return rows;
}
};
