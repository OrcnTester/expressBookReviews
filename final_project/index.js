
const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');

const registered = require('./router/auth_users.js').authenticated;
const public = require('./router/general.js').general;

const app = express();
const port = 5000;

app.use(express.json());



app.use(
    '/customer',
    session({
        secret: 'secretOrPrivateKey',
        saveUninitialized: true,
        resave: true
    })
);

app.use("/customer/auth/*", function auth(req, res, next) {
    if (req.session.authorization) {
        const token = req.session.authorization["accessToken"];

        jwt.verify(token, "access", (err, user) => {
            if (!err) {
                req.user = user;
                next();
            } else {
                return res.status(403).json({ message: "User not authenticated" });
            }
        });
    } else {
        return res.status(403).json({ message: "User not logged in" });
    }
});



app.use('/customer', registered);
app.use('/', public);

app.listen(port, () => console.log('Server is running'));
