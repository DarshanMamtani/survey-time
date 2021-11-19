const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userValidation = require('../util/userInputValidation');

// models
const User = require('../models/Users');

/** 
 * Here I used only one route/endpoint for Authentication
 * Because, login and signup has same fields and in assignment it was told to treat as mock authetication
 * 
 * If User Exists:
    * Check Password:
        * If password is correct -> generate jwt token
        * else -> send error
 
* If user does not exists:
    * Create new user and generate jwt token
*/

const userLogin = async (req, res) => {
    // validating the req object
    const { error } = userValidation(req.body);
    if (error) {
        res.status(400).send(error.details[0].message);
    }

    try {
        // getting user if exists
        const user = await User.findOne({
            where: { email: req.body.email }
        });

        // if user already exists, just generate jwt token
        // else create user
        if (user) {
            //checking password
            const validPass = await bcrypt.compare(req.body.password, user.password);

            // if password don't match
            if (!validPass) {
                return res.status(401).send({
                    message: 'Email or Password is wrong!'
                });
            }

            // creating jwt token
            const token = jwt.sign({ id: user.id }, process.env.TOKEN_SECRET);

            res.status(200).send({
                message: 'Login Successful',
                token: token
            });
        } else {
            // generating salt and hashing the password
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(req.body.password, salt);

            // Creating new  User
            const newUser = await User.create({
                email: req.body.email,
                password: hashPassword
            });

            // Creating jwt token
            const token = jwt.sign({ id: newUser.id }, process.env.TOKEN_SECRET);

            res.status(200).send({
                message: 'User Created and Logged In!',
                token: token
            });
        }
    } catch (error) {
        res.status(500).send({
            message: "Internal Error",
            error: error
        });
    }
}

module.exports = userLogin;