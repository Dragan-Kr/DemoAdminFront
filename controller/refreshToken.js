const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require("../model/User");


const handleRefreshToken = (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;

    const foundUser = User.find(user => user.refreshToken === refreshToken);
    if (!foundUser) return res.sendStatus(403); //Forbidden 
    // evaluate jwt 
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || foundUser.userName !== decoded.userName) return res.sendStatus(403);
            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "username": decoded.username,
                        "roles": decoded.roles
                    }
                },
                process.env.JWT_SECRET,
                { expiresIn: process.env.REFRESH_TOKEN_LIFETIME }
            );
            res.json({ accessToken })
        }
    );
}

module.exports =  {handleRefreshToken}