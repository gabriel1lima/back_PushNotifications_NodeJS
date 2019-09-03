const User = require("../models/User");

class UserController {

  async getAll(req, res) {
    const users = await User.find({});

    return res.json(users);
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