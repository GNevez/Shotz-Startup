const { verify } = require('jsonwebtoken');
const { connection } = require('./db')

function authenticate(req, res, next) {

  const token = req.cookies['token'];
  if (!token) {
    return res.status(401).send('Token não fornecido');
  }

  try {
    const decoded = verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    console.log(req.user);
    next();
  } catch (err) {
    return res.status(401).send('Token inválido');
  }
}

module.exports = authenticate;
