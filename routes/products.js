var express = require('express');
const { assert } = require('superstruct');
const { CreateDto } = require('../dtos/products.dto');
const { db } = require('../utils/db');

const router = express.Router();



router.post('/create', async (req, res, next) => {
  try{
    assert(req.body, CreateDto);

  } catch {}
  
});

module.exports = router;
