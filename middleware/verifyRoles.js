
const verifyRoles = (allowedRoles) => {
  return (req, res, next) => {
    console.log("verifyRoles->AllowedRoles",allowedRoles)
    // if (!req?.roles) return res.sendStatus(401);
    const rolesArray = Array.isArray(allowedRoles) ? allowedRoles.map(role => role.toString()) : [allowedRoles.toString()];
    console.log("verifyRoles->rolesArray",rolesArray)
     console.log("verifyRoles->req.roles",req.roles)
    const result = req.roles.map(role => rolesArray.includes(role)).find(val => val === true);
    console.log("verifyRoles->result",result)
    if (!result) return res.sendStatus(401);
    next();
  };
};


module.exports = verifyRoles