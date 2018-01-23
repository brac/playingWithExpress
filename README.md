# Live coding an Express server with a SQL backend
## [**Part 1**](https://www.youtube.com/watch?v=Uuk5pM4WgLE&list=PLcSbxZVkmW_j4vKYojC8iC1523e_x2FAQ)

A RESTful API is an API designed with a set on conventions, knows as [Representational state transfer](https://en.m.wikipedia.org/wiki/Representational_state_transfer). The idea is that applications should use ```HTTP``` as it was originally intended [source](https://stackoverflow.com/questions/671118/what-exactly-is-restful-programming). ```Lookups``` should use ```GET```, ```PUT```, ```POST```, and```DELETE``` requests should be used for **mutation**, **creation**, and **deletion** respectively.

* What is middlewear?
  A filter between the request and the response. It is in the 'middle' of a process. Express is a process, and does thing in a request repsonse cycle. bodyParser() is a tool to do some stuff with the data in the middle of that cycle.

bodyParser() will take a string and convert it into a json object. We use this becuase express lacks this feature.

Middlewear is the thing that happens in the middle of this express request cycle. You can add middlewear to an express server and it is something that happens after the request but before the response.

Steps:
npm init -y
npm i express
e server.js
```javascript
// 1st item
const express = require ('express');
// const router  = express.Router();

// 2nd item
const app = express();

app.get('/repeat/:word', (req, res) => {

  // old way
  // const word = req.params.word;

  // ES6 way, destructing
  // {} before = means we are using destructing
  const { word } = req.params;

  res.send(`I'm sending back ${word}`);
});

// 3rd item
app.listen(3000, () => {
  console.log('listening on port 3000');
});
```
Break it down:
* First we require the express library
* Then we instantiate the server
* Then we have the server start listening on a port and provide it with a callback that will announce it has started successfully.
* After that, we create our route with ```app.get()```.
  We specify what to what route we are going to respond, and provide a callback that will handle the response. The callback gets ```req``` and ```res```.
* Above we have two different ways of pulling out a paramter value from the query string, try to use the ES6 destructuring pattern, ```const { word } = req.params;```
* Finally we will ```res.send()``` the response.

Start the server:
```bash
node server.js
```
Then we open PostMan, querty to:
_http://localhost:3000/repeat/SomethingToRepeat_
It should respond. Moving on...

You can _chain_ multiple methods to ```res()```, like setting the status code first and then sending the response.
```javascript
res
  .status(200)
  .set('Content-Type', 'application/text')
  .send('Some response')
```
The above outlines the three things you should always respond with.
1. A status code
2. A content type
3. The response itself

Note that a nice quailty of life tool is ```nodemon```. You can use this Node Monitor application an express server file like our example here, and it will monitor the files and restart the server if anything changes.

Anyway, adding the above to our example will demonstate how we are adjusting the content type of the response. Test this with Postman. Also, be mindful of the resonse and error codes that you return.

Note that ```.send()``` needs to be the last method called.

So how do we connect to a SQL database with an express server? Think about it by seperating, or abstracting some of the functions into seperate modules. Meaning, you will have a database file that is responsible for connecting to the database, and the definitions of functions that will be responsible for quering and writing to the database. This file will handel the actualy SQL code, be it with knex or otherwise.

Then in our seperate ```server.js``` file we will require in that module and it's functions, so our express app need olny concern itself with what it will do when queried with particualr strings and use the exported functions from the database file for the actual file meddeling.

## [**Part 2:**](https://www.youtube.com/watch?v=mxsdHqEgvn4&list=PLcSbxZVkmW_j4vKYojC8iC1523e_x2FAQ&index=2)

**NODE_ENV**
You can set the Node environment variables, or query them within a ```server.js``` to determine wether the server is being run in a production, staging or development environment, and log or not log errors accordingly.
```javascript
if (NODE_ENV === 'development') {
  //log some errors
}
```

**npm scripts**
```npm start``` is one npm script. These appear in your ```package.json``` file after using ```npm init```.  For example, you could have ```npm test``` start up mocha if your package.json file had the following:
```json
"scripts": {
  "test": "mocha"
}
```
Or we could run ```npm start``` with the following in our ```package.json```
```javascript
"scripts": {
    "start": "nodemon server.js"
  }
```
The scripts section will be explored if the npm command passed is not in the standard npm library.

* A **URL Parameter** is without an ```?```. You can pull variables off of this.
```http://localhost:3000/howdy```

* A **Query Parameter**, comes after the ```?```. You can pull variables off of this as well.
```http://localhose:3000/howdy?numberoftimes=5```

URL Parameters are good for end points. Querey parameters are good for options, like return json or xml.

## POST vs GET
Post requests always have bodies with them, get requests do not. You can use a post method to send form data to a server. You could also use a get method send that same data, but it would have to be in the query parameters, and thus visible to the user.


### app.use()
Almost everything within express can be boiled down to calling ```app.use()``` when the server gets to a certain route / request. This us also how we would get middlewear like ```bodyParser``` to work. You can put this at the top of our ```server.js``` example file, before any of our route definetions. This says, hey express, when you get a request, before you run that get route, use bodyParser to parse the body of any post requests.

Order matters in express, so put the ```app.use()``` before the ```post``` callback.
```javascript
app.use(bodyParser.json());
```
Under the hood, bodyParser is checking to see if the HTTP method is POST, PUT, or DELETE, then it takes the body of that request, parses it, and sets ```req.body``` to the result. In the above example it will only run ```bodyParser``` on a body that has a ```typeContent``` of json.

So, for an example we will add a post route to our express server. This will take a body object that we presume will be in json format. BodyParser will run to ensure that that is indeed how we will interact with it and we can access that data from ```req.body.key```.
```javascript
app.post('/weave', (req, res) => {
  // create two variables of the same name found in req.body
  const { a, b } = req.body;

  res
    .status(200)
    .set('Content-Type', 'application/text')
    .send(`${a} ${b} ${a} ${b}`);
});
```
Note that we have again use destructreing to define two variables in 1 line. We can do this because we want to call them by the same name as they are identified in ```req.body```

Then we respond.

To test this we open PostMan, change our request method to Post, and then click on the body tab. From there we can click on the ```raw``` radial button, and then change the formate to JSON(application/json). Then we enter some data for values ```a``` and ```b```, then hit send. Going back ot the authorizaion or headers tab will allow us to see the response from the server, in this case it should be a woven response of the variables.


## [**Part 2.5**](https://www.youtube.com/watch?v=eWXJnJ_sCbY&index=3&list=PLcSbxZVkmW_j4vKYojC8iC1523e_x2FAQ)

### How to contribute to someone elses code base
You got a link to a codebase but not permissions to merge.

First up, fork it. Do this one the web page. If you command line you will have clone first then fork.

You'll see a fork icon next to the repo on the gitHub web page where your repos are listed. Any changes you make you commit to your forked copy, then you make a pull request to the source database, and then they decide if they want to merge the changes.

Clone the forked copy locally if you haven't already. Since this is in npm project you can run ```npm install``` to get all the dependencies required for the project.

Presumably you'll make pull request.

### SQL
For this example we will create a database.
Open a new file, ```database.sql```, and create a table.
```sql
CREATE TABLE contacts (
  first_name TEXT,
  last_name TEXT,
  phone_num TEXT
)
```

Now we create the database before we put the table in:
```bash
createdb contacts
```
Then we create the table:
```bash
psql contacts < database.sql
// CREATE TABLE
```
Then you go into contacts and see whats up:
```bash
psql contacts
...

contacts=# SELECT * FROM contacts;
```
You should see an empty table. But wait, on no we didn't include a contact_id, or a primary key. So back into our ```database.sql``` we will add:
```sql
DROP TABLE contacts;
```
Which will drop a contact table if it exists. Then we add ```contact_id SERIAL PRIMARY KEY,``` to our contacts table creation.

In our example we've also moved the ```database.sql``` file to a new ```database/``` folder, as well as touched a ```seed.sql```. Finally, let's re-set our database with:
```bash
psql contacs < database/database.sql
```

Now we add our seed data. You could do it one by one, or you could do it as bulk.  Add the following to ```database/seed.sql```:
```sql
INSERT INTO contacts (first_name, last_name, phone_num) VALUES
  ('Bracamonte', 'Ben', '707-217-4527'),
  ('Bracamonte', 'Jenna', '651-428-5454'),
  ('Wieden', 'John', '651-428-4823'),
  ('Drommerhausen', 'Scotty', '651-458-8842'),
  ('Runk', 'Jessie', '651-478-4812'),
  ('Grippe', 'Jared', '481-408-4258');
```
And now our database has some data.


Next up we build our route. Since we are just getting information and not creating or modifying any artifacts, a ```GET``` request would be appropriate.

Before we get started we should think about what we are doing and how we are going to do it. IN this case we are going to access and change information in a database using a library called ```pg-promise```. This is basically a way to interface with a database through promises instead of callbacks.

Also, let's keep this database stuff seperate from our express server. So create a new file at ```database/database_utilities.js```.
```javascript
const pgp = require('pg-promise')();
const db  = pgp('postgress://localhost:5432/contacts');

// get all contacts
const getAllContacts = () => {
  db.any('SELECT * FROM contacts')
    .then(function(data) {
      console.log(data);
    })
    .catch(function(error) {
      console.error(error);
  });
};

const closeConnection = () => {
  pgp.end();
};

module.exports = {
  getAllContacts,
  closeConnection
};
```
With our initial draft we do the following:
1. Require the library. Docs say its needs ```()``` at the end.
2. Open the connection to the database. Note that the default postgres port is ```5432```.
3. Define our ```getAllContacts``` method.
4. Note how we use the ```db``` that is now an open connection. We pass it the same sql syntax and presumalby the success message that returns will be the results of the query.
5. Then we create a```closeConnection``` method. This is necessary because without explicitly telling pg-promise to close the connection to the database, it will remain open and the program will hang until a timeout has been reached.
6. Finally we export our methods.

You can test the above through the command line, by calling the ```getAllContacts``` method, but the instructor seems to dislike this method of testing.

Ok so now to get that data back into our server app and do something with it. since we are using ```pg-promise``` we know that the result of ```db.any()``` is a promise, that's why we're able to call ```.then()``` on it immediatly afterwards. So instead of doing that here in database utilities, we will just return that promise and do the thing with it back in our sever. That's how we get the data from one file to the other, but really it's not transfering files, as our server app is referencing the code in ```database_utilities.js``` and using it's scope accordingly.

Anyway, we change our ```getAllContacts()``` method to this:
```javascript
const getAllContacts = () => {
  return db.any('SELECT * FROM contacts');
};
```
Then we require our method back in our server:
```javascript
const { getAllContacts } = require('./database/database_utilities.js');
```

Then we build our route:
```javascript
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
```
**Line by line breakdown**
1. It's a ```.get()``` request, with the ```/contacts``` route.
2. First we set our response header to be json, so apps know what to expect.
3. We fire our ```getAllContacts()``` function, which we know returns a promise, so we can call ```.then()``` right away. It takes what should be the success data, and...
4. We send the data back as a string.
5. If we get an error, then we send back an error object that we first turn into a string.

Now, you can test this functionality by either using postman or pointing your browser to ```localhost:3000/contacts``` and you will get a display of all the contacts that have been seeded to the database.

In Summation:
* We used ```.sql``` files as a SQL command script, inputing SQL commands into our psql application.
  * These files lived in a seperate folder
  * One was responsible for creating the initial database
  * Another was responsible for entering in a bunch of starter data.
  * One was responsible for accessing and returning that data outside of it's scope.
* The last file mentioned above used ```pg-promise``` to access the data and return a promise.
* Back in our server App we require the database utility that will return all the contacts and call it. Since it returns a promise we call ```then()``` and do stuff to the data.
* Since this is a get request to ```/contacts``` we can actually have the data that was read from the database displayed on a web browser! _neat_


[**Part 3**](https://www.youtube.com/watch?v=OzNAQURyiVo&list=PLcSbxZVkmW_j4vKYojC8iC1523e_x2FAQ&index=4)
**What _is_ a REST api?**
Representational State Transfer, an archictextural standard.

**CRUD**
Create
Read
Update
Delete

You do these using the HTTP methods, GET POST PUT DELETE, etc. These are not 1 to 1, while you could read with a GET, you could create with a PUT or a POST. Which is better? You decide! Good API developers do a thing that makes a good api nice to work with, whatever that nebelous thing means.

Note that POST and PUT are different. PUT is indempedant, meaning that if you only provide 1 of 10 data values, then the item you are adjusting with PUT will not only have 1 of 10 data values. Where as POST, which is not indempedant, will accept just a single data value and only update that one on the object in question, while preserving the rest of the already existing values.

What is an API? It's an interface that 'others' can use to ineract with our data. A use case of an API would be a news reader, Facebook, etc.

If you're creating a full stack app, you'll want to create an API on the backend that your front end interacts with. If you have a todo list and database, then you have a front-end that creates and displays the tasks. So you go to an API that you created to get the task data that get plugged into your front end. That's a full stack app.

Once example of an API would get gitHub. Check out their docs and you will see how to interact with it and what to expect in the responses. You can test this stuff with PostMan with queries like ```https://api.github.com/users/brac/repos```

The JSON repsonse would be an array with information about the repos and in addition GitHub is anticipating that we may want more information about the repos or the user, so it provides a bunch of extra information like followers, user links, URLs, all sorts of stuff.

When creating your API, try and think about giving it general functionality and lots of flexibility. Let the user of the API figure out how they want to use the API.

REST APIs are built around exposing resources. Nones not verbs. Your routes should be nounes, people places and things, and not verbs like delete user. The verb part is the method like ```GET /users```. That is a collection resource. ```GET /users/brac``` is an instance resource. When you build your API think about what thing do you want to expose.

Ok so now that we know we are going to be creating an api, we can create a router. This is another express functin that will handle a bunch of routes that we can define. Let's start by creating a new folder and file, ```routes/api.js```.
```javascript
const router = require('express').Router();

router.get('/', (req, res) => {
  res.send('hello');
});

module.exports = router ;
```
We require our ```Router()``` from express and then we define a route for a GET request to ```/```. It will send back a simple 'hello'. Lastly we export this.

Back in our server we require our new router:
```javascript
const apiRouter          = require('./routes/api');
```
And then we ```.use()``` it for any routes that start with ```/api```:
```javascript
app.use('/api', apiRouter);
```
Now when a user goes to ```localhost:3000/api/``` they will get a hello message.

* **Summing it up**
- RESTful APIs are concerned with resources, nouns not verbs and exposing those resources.
- GitHub is a good example of a REST API.
- APIs are interfaces for other applications or users to get access to your data.
- You can create a router with express that will handel specific routes.
- You can create multiple routers to handel different kinds of requests, thus organizing your code base.
- You can then tell you server to use these routers whenever they encouter a particular URL request.


[**Part 4**](https://www.youtube.com/watch?v=Ce7In19oF4o&index=5&list=PLcSbxZVkmW_j4vKYojC8iC1523e_x2FAQ)
Be mindful of organizing your dependencies and code base. Put all the tools that someone would need to start developing on your work in the dev dependencies, and put all the tools and librarays that a user would need to get the application up and running. You can ```npm i someModule --save-dev``` to save things to the developer dependencies.

Be sure to check these things in ```pacakge.json``` as well as include any scripts that would get the user up and running quickly. To aid this in our own project we have added the following scripts as well as ensured that nodeMon is part of the dev dependencies:
```json
  "scripts": {
    "start": "nodemon server.js",
    "db:create" : "createdb contactsrestapi",
    "db:init" : "npm run db:loadschema && npm run db:seed",
    "db:loadschema" : "psql contactsrestapi < ./database/schema.sql",
    "db:seed" : "psql contactsrestapi < ./database/seed.sql"
  },
```
Note how we are able to call scripts that have not been defined yet by other scripts. Because of function hoisting (maybe) we can say that ```db:init``` will fire ```db:seed``` even if we have yet to define exactly what ```db:seed``` actually does until the last script line.

Also note that in our work files we have changed the database name to reflect these scripts, and as such needed to re-initialize our database. Be sure that all your scripts and modules line up with where they thing various databases are going to be.

### What is our REST api going to look like?
Let's plan some routes:
CRUD model

- GET /contacts               -  collection resource
- GET /contacts/:id           -  instacnce resource
- (create) PUT /contacts      -  create entire contact
- (update) POST /contacts/:id -  not idempotent, see below
    {
      "phone number" : 555-584-3864
    }
- (delete) DELETE / contacts/:id


### Idempotency
1. You PUT an application with a first name, and the resources now has a first name
2. You PUT on that same application jut a last name. The resource now has a first and last name.
3. You PUT on that resource a first name again, but the resource has a first and last name. This breaks idempotency because steps 1 and 3 should yield the same thing.

- (update) PUT /contacts/1  - idempotent, run it n times, always get the same result, so you have to send everything or else.
    {
      "first_name" : "John",
      "last_name" : "Smith",
      "phone number" : 555-584-3864
    }

Take away; when you use PUT, include everything.

With the above outline we go to our ```database_utilities.js``` file an start building our database interaction.

Here we add our function that will return a single contact:
```javascript
const getContact = (id) => {
  // note the way to paste data into the query.
  // We use pg-promise built in parameterized query
  // ability. For the second argument we pass an array
  // with the data we want pasted. This protects against
  // malicious sql injection

  // we use `` just to put it on multiple lines
  return db.one(`
    SELECT *
    FROM
    contacts
    WHERE contact_id=$1
    LIMIT 1
  `,
  [id]);
};
```
There are a couple of things to notice.
- We are using back ticks to get the query onto multiple lines for readability
- We are using pg-pormises built in _parameterizaed query ability_ to paste variable data into the sql query.
  - This is done by providing a second argument to ```.one()``` in the form of an array, where each ```$n``` matches the id number of the array. This protects against some malicious sql injection.

Next up we define our create contact function:
```javascript
const createContact = (first_name, last_name, phone_num) => {
  return db.one(`
    INSERT into
      contacts (first_name, last_name, phone_num)
    VALUES
      ($1, $2, $3)
    RETURNING
      *
  `,
  [first_name, last_name, phone_num]);
};
```
Similar setup to the one above with parameterized query, but we are also ```RETURNING *``` at the end. This is because we are using ```.one()``` which may not return something and thus we include the above to prevent and error thrown. We could instaed use ```.any()``` and omit the ```RETURNING * ``` but this way we have the option to see if anything is returned or not. More info is better I guess?

We can test this by simply calling the ```createContact()``` function wihtin the ```database_utilities.js``` file and restarting the server. Be syre to clear out the extra contacts with one tool or another.

Next up we define our delete contact function:
```javascript
// delete contact
const deleteContact = (id) => {
  return db.any(`
    DELETE FROM
      contacts
    WHERE
      contact_id=$1
    RETURNING
      *
  `,
  [id]);
};
```
Same as the others.

Following the videos we postpone writing the update function and instead write a route.

Back intp ```api.js``` we modify our route to this:
```javascript
router.get('/contacts', (req, res) => {
  getAllContacts()
    .then((data) => {
      res.status(200)
         .send(data);
    })
    .catch((error) => {
      res.status(400)
         .send('There was an error');

    });
});
```
This will be our get all contacts route for our api. We can test this by looking at postman or a web browser.

Note that since ```getAllContacts()``` is returning a pgp promise object we can chain on ```.then()``` to handel our response and error handeling. Note also how we changed the ```res.xx()``` calls one after another. This is just personal preference apparently.


[**Part 5**](https://www.youtube.com/watch?v=aLc9D91MsCU&list=PLcSbxZVkmW_j4vKYojC8iC1523e_x2FAQ&index=6)
Before we get started we do just a little addition. We are going to add ```pg-monitor``` to our ```database_utilites.js``` module, allowing for logging of db queries during our development.

In addition we are going to change the way that we are connecting to our database by providing a ```connection_options``` object when we call ```pgp()```. So make sure the top of your file looks like this:
```javascript
const pg_options = {};
const pgp        = require('pg-promise')(pg_options);
const monitor    = require('pg-monitor');

// Adds db query logging to console
monitor.attach(pg_options);

const connection_options = {
  host: 'localhost',
  port: 5432,
  database: 'contactsrestapi'
};

const db = pgp(connection_options);
```

Next up we write our db utilite for updating a contact:
```javascript
// update contact
const updateContact = (id, first_name, last_name, phone_num) => {
  // optional: do some logic here to figure out WHICH fields to update
  return db.one(`
    UPDATE
      contacts
    SET
      (first_name, last_name, phone_num)=($2, $3, $4)
    WHERE
      contact_id=$1
    RETURNING
      *
  `,
  [id, first_name, last_name, phone_num]);
};
```
For simplicity we are expecting the be provided the entire contents of the item to be updated. Looks pretty straight forward but look how we are updating a bunch of properties at the same time while still using paramiterized notation.

Next up we write our routes. Don't forget to import the functions from your ```database_utilities.js``` file.
We will start with our get single contact route:
```javascript
// get one contact
router.get('/contacts/:id', (req, res) => {
  const { id } = req.params;

  getContact(id)
    .then((data) => {
      res.status(200)
         .json(data);
    })
    .catch((error) => {
      res.status(400)
         .json({error: 'There was an error'});
    });
});
```
Note that we aer calling ```.json()``` in place of ```.send()``` which apparently will set the headers to JSON and send the data back as a JSON object. This is suppose to make sense because we are accepting JSON, so we should reply with JSON.

We can check the above with postman or a browser since they are simple get request. We can confirm the data with Postico or a terminal window.

Next up we are defining our create contact route:
```javascript
router.put('/contacts/', (req, res) => {
  const { first_name, last_name, phone_num } = req.body;

  createContact(first_name, last_name, phone_num)
    .then((data) => {
      const newid = data.contact_id;
      res.status(200)
         .json({new_contact: `http://localhost:3000/api/contacts/${newid}`});
    })
    .catch((error) => {
      res.status(400)
         .json({error: 'There was an error creating the contact'});
    });
});
```
Things to notice here:
- We are pulling out provided variable data and names from req.body. This is only possible because we have required ```bodyParser``` in the module that will be requiring this, ```api.js``` file. So even tho we didn't require bodyParser this will still work.
- We fire our ```createContact``` method and pass it the data we pulled from ```req.body```.
- We di a little logice to find what the new id name is, and then return to the user the location of that new id in the database API.
- Catch them errors.

Next route is our Update Route. We will use POST for this, but b/c of how we implemeneted the function, we have to take all the values. POST could be set up to figure out which field is being updated, but not for this example.
```javascript
// update contact route
router.post('/contacts/:id', (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, phone_num } = req.body;
  // TODO: write some code to allow them to update not all fields.

  updateContact(id, first_name, last_name, phone_num)
    .then((data) => {

      res.status(201)
         .json(data);
    })
    .catch((error) => {
      res.status(400)
         .json({error: 'There was an error updating the contact'});
    });
});
```
That should do it for this function. Note that we are sending back a success code of ```201```, meaning success thing created. Pay attention to these codes.

You can test the above with PostMan.

Now here is our delete route:
```javascript
// delete contact route
router.delete('/contacts/:id', (req, res) => {
  const { id } = req.params;

  deleteContact(id)
    .then((data) => {

      res.status(200)
         .json(data);
    })
    .catch((error) => {
      res.status(400)
         .json({error: 'There was an error deleting the contact'});
    });
});
```
Much the same as the previous ones. Tested and working with PostMan.

Lastly we changed the deleteContact method in ```database_utilities.js``` to ```db.one()``` so the delete route will return an object and not an array of objects.
