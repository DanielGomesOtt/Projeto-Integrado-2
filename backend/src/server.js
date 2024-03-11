require('./database');
require('dotenv').config()
const express = require('express');
const cors = require('cors');
const homeRoute = require('../src/routes/homeRoute');
const loginRoute = require('../src/routes/loginRoute');
const tokenRoute = require('../src/routes/tokenRoute');
const passwordRecoveryRoute = require('../src/routes/passwordRecoveryRoute');
const accountRoute = require('../src/routes/accountRoute');
const app = express();

app.use(cors());
app.use(express.json())
app.use(homeRoute);
app.use(loginRoute);
app.use(tokenRoute);
app.use(passwordRecoveryRoute);
app.use(express.urlencoded({ extended: true }));

app.listen(process.env.APP_PORT);