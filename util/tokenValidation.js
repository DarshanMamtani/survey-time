const jwt = require("jsonwebtoken");
const User = require('../models/Users');


const verifyToken = async (req, res, next) => {
    // Get auth header value
    const bearerHeader = req.headers["authorization"];

    // Check if bearer is undefined
    if (bearerHeader) {
        // Split the header
        const bearer = bearerHeader.split(" ");
        // Get the token
        const bearerToken = bearer[1];

        try {
            // verify jwt
            const data = await jwt.verify(bearerToken, process.env.TOKEN_SECRET)

            const user = await User.findOne({
                where: { id: data.id }
            });

            // if user doesn't exist send error else add user to req object
            if (!user) {
                return res.status(400).json({
                    message: "No user exists with given id"
                });
            } else {
                req.user = user;
                next();
            }
        }
        catch (error) {
            return res.status(500).json({ message: "Error finding user", error: error });
        }
    } else {
        // if no token given
        return res.status(401).json({ message: "Access Denied!" });
    }
}

module.exports = verifyToken;