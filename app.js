const express = require('express');
const morgan = require('morgan');

require('express-async-errors');

const app = express();

app.use(morgan('dev'));

app.use('/BookWorm', express.static('BookWorm'));

require('./middlewares/session.mds')(app);
require('./middlewares/view.mds')(app);
//require('./middlewares/auth.mds')(app);
require('./middlewares/locals.mds')(app);
require('./middlewares/routes.mds')(app);

app.use(function(err,req, res,next){
  console.error(err.stack)
  //res.status(500).send('Something broke!');
  res.render('500',{layout: false});
})

const PORT = 3000;
app.listen(PORT, function () {
  console.log(`Bookworm app is listening at http://localhost:${PORT}`)
})