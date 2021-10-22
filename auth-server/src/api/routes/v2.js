'use strict';

const express = require('express');
const dataModules = require('../../auth/models/index');
const basic = require('../../auth/middleware/basic');
const bearer = require('../../auth/middleware/bearer');
const acl = require('../../auth/middleware/acl')

const router = express.Router();

// Tokens
// Octane user eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ik9jdGFuZSIsImlhdCI6MTYzNDg1MDkzNX0.s1KkB0q6AsWB1UrfBpCQam7iMeH-RnPwntaTwwnOmI8
// Gibby writer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkdpYmJ5IiwiaWF0IjoxNjM0ODUxMDEwfQ.Fo2h52cDu9bQWQqh0M4DOz-OVibYo1GQLulDtnrHJrY
// Loba editor eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkxvYmEiLCJpYXQiOjE2MzQ4NTEwMzV9.wsgnFp58OcEYy-95UNDDZM_cA7H11E0hIu65o1Y5DEc
// Oreo admin eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ik9yZW8iLCJpYXQiOjE2MzQ4NTA5MDV9.FsBv4xab4TETsiOhQgLIld-O2z-CcMBS74eZAXV7L5k

router.param('model', (req, res, next) => {
  const modelName = req.params.model;
  if (dataModules[modelName]) {
    req.model = dataModules[modelName];
    next();
  } else {
    next('Invalid Model');
  }
});

router.get('/:model', basic, handleGetAll);
router.get('/:model/:id', basic, handleGetOne);
router.post('/:model', bearer, acl('create'), handleCreate);
router.put('/:model/:id', bearer, acl('update'), handleUpdate);
router.delete('/:model/:id', bearer, acl('delete'), handleDelete);

async function handleGetAll(req, res) {
  let allRecords = await req.model.get();
  res.status(200).json(allRecords);
}

async function handleGetOne(req, res) {
  const id = req.params.id;
  let theRecord = await req.model.get(id);
  // let theRecord = await findOne({where:{id:id}});
  console.log('inside get one', req.model);
  res.status(200).json(theRecord);
}

async function handleCreate(req, res) {
  let obj = req.body;
  let newRecord = await req.model.create(obj);
  res.status(201).json(newRecord);
}

async function handleUpdate(req, res) {
  const id = req.params.id;
  const obj = req.body;
  let updatedRecord = await req.model.update(id, obj);
  res.status(200).json(updatedRecord);
}

async function handleDelete(req, res) {
  let id = req.params.id;
  let deletedRecord = await req.model.delete(id);
  res.status(200).json(deletedRecord);
}

module.exports = router;
