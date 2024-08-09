const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();
const index = require('./routes/index');
const cors = require('cors');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true
};

app.use(cors(corsOptions));

const RateLimit = require("express-rate-limit");
const limiter = RateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 500,
});

app.use(limiter);

const mongoDB = process.env.MONGODB_URI;

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

app.use('/api', index);

app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.listen(3000, () => {
    console.log('App listening on port 3000');
});

app.use((err, req, res, next) => {
    res.status = process.env.NODE_ENV === "production" ? 500 : err.status;
    return res.json({
        status: "error",
        message: process.env.NODE_ENV === "production" ? "Internal server error" : err.message
    });
});