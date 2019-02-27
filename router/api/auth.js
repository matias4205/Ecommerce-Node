const express = require('express');
const passport = require('passport');
const boom = require('boom');
const jwt = require('jsonwebtoken');
const api = express.Router();

const { config } = require('../../config');

//Basic strategy
require('../../utils/auth/strategies/basic');

api.post('/token', (req, res, next) => {
    passport.authenticate('basic', (err, user) => {

        if (err || !user){
            next(boom.unauthorized());
        }

        req.logIn(user, { session: false }, (error) => { //Inicia sesion con el usuario dado, si hay error lo reporta sin el boom
            if (error) {
                next(error);
            }
            
            const payload = { sub: user.username, email: user.email }; // Si no hay error el payload se crea con el user recien creado recibido en el callback
            const token = jwt.sign(payload, config.authJwtSecret, { // Firma de json web tokens
                expiresIn: '15m'
            });
            
            return res.status(200).json({ access_token: token });
        });

    })(req, res, next);
});

module.exports = api;