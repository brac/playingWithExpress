const express            = require('express');
const bodyParser         = require('body-parser');
const app                = express();
const { getAllContacts } = require('./database/database_utilities.js');
const apiRouter          = require('./routes/api');


app.use(bodyParser.json());
app.use('/api', apiRouter);


// Get route
app.get('/repeat/:word', (req, res) => {
  // ES6 way, destructing
  // {} before = means we are using destructing
  const { word } = req.params;
  res
    .status(200)
    .set('Content-Type', 'application/text')
    .send(`I'm sending back ${word}`);
});

// Post route
app.post('/weave', (req, res) => {
  // create two variables of the same name found in req.body
  const { a, b } = req.body;

  res
    .status(200)
    .set('Content-Type', 'application/text')
    .send(`${a} ${b} ${a} ${b}`);
});

// display all contacts in the db
app.get('/contacts', (req, res) => {
  // indicate the response is JSON
  res.setHeader('Content-Type', 'application/json');

  getAllContacts()
    .then((data) => {
      res.send(JSON.stringify(data));
    })
    .catch((error) => {
      res.send(JSON.stringify({message: `An error occured ${error.toString()}`}));
    });
});







app.listen(3000, () => {
  console.log('listening on port 3000');
});



