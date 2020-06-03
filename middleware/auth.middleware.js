const db = require("../db");
const getNumOfItems = require("../getNumOfItems");

module.exports = {
  //Require Auth
  requireAuth: (req, res, next) => {
    if (!req.signedCookies.userId) {
      res.redirect("/auth/login");
      return;
    }
    const user =  db.get("users")
                  .find({ id: req.signedCookies.userId })
                  .value();
    if (!user) {
      res.redirect("/auth/login");
      return;
    }
    
    const items = db.get("sessions").value()[0].cart;
    const numOfItems = getNumOfItems(items);

    res.locals.user = user;
    res.locals.numOfItems = numOfItems;
    
    next();
  }
}