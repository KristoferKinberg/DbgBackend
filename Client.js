class Client {
  id;
  socket;
  belongsTo;

  constructor(id, socket) {
    this.id = id;
    this.socket = socket;
  }

  get socket(){
    return this.socket;
  }

  get id() {
    return this.id;
  }

  set id(id) {
    this.id = id;
    return this;
  }

  get belongsTo(){
    return this.belongsTo;
  }

  set belongsTo(belongsTo) {
    this.belongsTo = belongsTo;
    return this;
  }
}

module.exports = Client;
