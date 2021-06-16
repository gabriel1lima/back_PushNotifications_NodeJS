const Todo = require("../models/Todo");
const send = require('../notification/send')

class TodoController {

  async getAll(req, res) {
    const todos = await Todo.find({}).sort('-createdAt');

    return res.json({todos});
  }

  async getByUserID(req, res) {
    const todos = await Todo.find({ id_user: req.params.id_user }).sort('-createdAt');
    
    return res.json({todos});
  }

  async create(req, res) {
    const todo = await Todo.create(req.body);

    send(todo);
    
    return res.json({todo});
  }
  
  async delete(req, res) {
    await Todo.findByIdAndDelete({_id: req.params.id});

    return res.json({msg: 'todo removido'});
  }

  // async delete(req, res) {

  //   req.body.map(async function (elm) {
  //     await Todo.findByIdAndDelete({_id: elm._id})
  //   })

  //   return res.json({msg: 'todo removido'});
  // }

  async update(req, res) {
    const todo = await Todo.findByIdAndUpdate({_id: req.params.id}, req.body);

    return res.json({todo});
  }
}

module.exports = new TodoController();