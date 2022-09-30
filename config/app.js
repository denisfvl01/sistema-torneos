'use strict';

require('dotenv').config();
/****** IMPORT MODULES ******/
const express = require('express');

const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');

const port = process.env.PORT || 3200;

/****** IMPORT ROUTES ******/
const userRoutes = require('../src/users/user.route');
const tournamentRoutes = require('../src/tournaments/tournament.route');

/****** MODULES IMPLEMENTATIONS ******/
const app = express();

/****** MIDDLEWARES CONFIGURATIONS ******/
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('combined'));

/****** IMPLLEMENT ROUTES ******/
app.use('/usuarios', userRoutes);
app.use('/torneos', tournamentRoutes);

/****** EXPORT SERVER INITIALIZATION ******/
exports.initServer = () => {
  app.listen(port)
  console.log(`Server http running in port ${port}`)
}
