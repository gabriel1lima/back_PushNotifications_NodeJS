const User = require("../models/User");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');
const refreshTokenList = {}

function generateToken(params = {}, expiresIn, type) {
  return jwt.sign(params, type == "token" ? authConfig.secret : authConfig.secretRefresh, { expiresIn });
}

class AuthController {
  async register(req, res) {
    try {

      if (await User.findOne({ username: req.body.username }))
        return res.status(400).send({ error: 'Usuário já cadastrado' });
         
      const user = await User.create(req.body);
      const token = generateToken({ id: user._id }, "1d", "token");
      const refreshToken = generateToken({ id: user._id }, "7d", 'refresh');

      refreshTokenList[refreshToken] = user.username;

      user.password = undefined
      user.fcmtoken = undefined;

      res.send({
        user,
        token,
        refreshToken,
      });

    } catch (error) {
      return res.status(400).send({ error: 'Erro no registro' });
    }
  }

  async login(req, res) {
    const { username, password } = req.body;

    const user = await User.findOne({ username }).select('+password');

    if (!user)
      return res.status(400).send({ error: "Usuário não encontrado!" });
      
    if (!await bcrypt.compare(password, user.password))
      return res.status(400).send({ error: "Senha inválida!" });
    
    const token = generateToken({ id: user._id }, "1d", "token");
    const refreshToken = generateToken({ id: user._id }, "7d", 'refresh');

    // refreshTokenList[user.username] = refreshToken;
    refreshTokenList[refreshToken] = user.username;
    
    console.log('refreshTokenList ->\n', refreshTokenList)

    user.password = undefined;

    await User.findOneAndUpdate({username: req.body.username}, { fcmtoken: req.body.fcmtoken });

    res.send({
      user,
      token,
      refreshToken,
    });
    
  }

  async token(req, res) {
    const { username, refreshToken } = req.body;

    // if(refreshToken && (refreshTokenList[username] == refreshToken)) {
    if(refreshToken && (refreshToken in refreshTokenList) && (refreshTokenList[refreshToken] == username)) {
      jwt.verify(refreshToken, authConfig.secretRefresh, (error, decoded) => {
        if (error)
          return res.status(498).send({ error: 'Token de atualização inválido' });
    
        const token = generateToken({ id: decoded.id }, "1d", "token");
        res.send({ token });
      });
    } else {
      res.status(498).send({ error: 'Erro no Token de atualização fornecido' });
    } 
    
  }
}

module.exports = new AuthController();