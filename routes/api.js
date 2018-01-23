const router = require('express').Router();

const {
  getAllContacts,
  getContact,
  deleteContact,
  createContact,
  updateContact,
  closeConnection
} = require('../database/database_utilities');

// get all contacts route
router.get('/contacts', (req, res) => {
  getAllContacts()
    .then((data) => {
      res.status(200)
         .json(data);
    })
    .catch((error) => {
      res.status(400)
         .json({error: 'There was an error'});
    });
});

// get one contact route
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

// create contact route
router.put('/contacts/', (req, res) => {
  const { first_name, last_name, phone_num } = req.body;

  createContact(first_name, last_name, phone_num)
    .then((data) => {
      const newid = data.contact_id;
      res.status(201)
         .json({new_contact: `http://localhost:3000/api/contacts/${newid}`});
    })
    .catch((error) => {
      res.status(400)
         .json({error: 'There was an error creating the contact'});
    });
});

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

















module.exports = router ;