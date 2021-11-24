const jwt = require("jsonwebtoken");
require("dotenv").config();



const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    let decodedData = jwt.verify(token, process.env.jwtSecret);

    req.userId = decodedData?.id;

    next();
  } catch (error) {
    console.log(error);
  }
};

module.exports = auth;
