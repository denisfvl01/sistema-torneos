'use strict';

const mongoose = require('mongoose');

exports.mongoConnect = async () => {
  try {
    const uriMongo = `${process.env.MONGO_HOST}${process.env.MONGO_DB}`;
    await mongoose.connect(uriMongo);
    console.log('Connected to DB successfully');
  } catch (err) {
    console.log(err);
  }
}
