'use strict';

const mongo = require('./config/mongo');
const app = require('./config/app');
const admin = require('./src/users/user.controller')

mongo.mongoConnect();
app.initServer();
admin.createAdminDefaultUser();
