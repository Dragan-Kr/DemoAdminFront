const jwt = require("jsonwebtoken");

const verifyRoles = (allowedRoles) => {
  return (req, res, next) => {
    // if (!req?.roles) return res.sendStatus(401);
    const rolesArray = Array.isArray(allowedRoles) ? allowedRoles.map(role => role.toString()) : [allowedRoles.toString()];
     console.log("verifyRoles->req.cookies",req.roles)
    const result = req.roles.map(role => rolesArray.includes(role)).find(val => val === true);
    if (!result) return res.sendStatus(401);
    next();
  };
};


module.exports = verifyRoles