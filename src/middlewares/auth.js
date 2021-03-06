const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth.json');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader)
    return res.status(499).send({ error: 'Nenhum token fornecido' });

  const parts = authHeader.split(' ');

  if (!parts.length === 2)
    return res.status(400).send({ error: 'Erro no Token fornecido' });
 
  const [ scheme, token ] = parts;

  if (!/^Bearer$/i.test(scheme))
    return res.status(400).send({ error: 'Token mal formatado' });

  jwt.verify(token, authConfig.secret, (err, decoded) => {
    if (err) return res.status(498).send({ error: 'Token Inválido' });

    req.userId = decoded.id;
    return next();
  });
}