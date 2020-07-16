const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const port = process.env.PORT || 8888

// configure routes
var usersRouter = require('./routes/users.js');

// configure middleware
app.use(express.static('./public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

app.use('/users', usersRouter);

// api routes
app.get('/', (req, res) => {
    res.send('Techhunt 2020 api');
});

app.listen(port, () => console.log(`Server listening on port ${port}!`))
