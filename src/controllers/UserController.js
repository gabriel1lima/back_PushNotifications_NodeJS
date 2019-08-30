const User = require("../models/User");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authConfig = require('../config/auth');


function generateToken(params = {}) {
  return jwt.sign(params, authConfig.secret, {
    expiresIn: 86400
  })
}
class UserController {

  async getAll(req, res) {
    const users = await User.find({});

    return res.json(users);
  }

  async register(req, res) {
    try {

      if (await User.findOne({ username: req.body.username }))
        return res.status(400).send({ error: 'Usuário já cadastrado' });
         
      const user = await User.create(req.body);

      user.password = undefined
      user.fcmtoken = undefined;

      res.send({
        user,
        token: generateToken({ id: user._id }),
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
    
    user.password = undefined;

    await User.findOneAndUpdate({username: req.body.username}, { fcmtoken: req.body.fcmtoken });

    res.send({
      user,
      token: generateToken({ id: user._id }),
    });
    
  }

  async delete(req, res) {
    try {
      
      await User.findByIdAndDelete({_id: req.params.id});
  
      return res.json({msg: 'Usuário removido!'});
    } catch (error) {

      return res.status(400).send({ error: 'Erro ao remover usuário' });
    }
  }

}

module.exports = new UserController();