const { uuidv4 } = require('./helpers');
const Client = require('./Client');

class Clients {
  clients = {};

  /**
   * Add client to server
   * @param socket
   */
  addClient = socket => {
    const id = uuidv4();
    this.clients = {
      ...this.clients,
      [id]: new Client(id, socket),
    };

    return id;
  };

  /**
   * Get a specific client
   * @param clientId
   * @returns {*}
   */
  getClient = clientId => this.clients[clientId];

  /**
   * Returns all clients
   * @returns {{}}
   */
  getClients = () => this.clients;

  /**
   * Get several clients by id
   * @param clientIds
   * @returns {Uint8Array | BigInt64Array | *[] | Float64Array | Int8Array | Float32Array | Int32Array | Uint32Array | Uint8ClampedArray | BigUint64Array | Int16Array | Uint16Array}
   */
  getClientsByIds = clientIds => clientIds.map(clientId => this.clients[clientId]);

  /**
   * Reconnect client
   * @param oldClientId
   * @param newId
   */
  reconnectClient = (oldClientId, newId) => {
    const {
      [newId]: newClient,
      [oldClientId]: oldClient,
      ...clients
    } = this.clients;

    return this.clients = {
      ...clients,
      [oldClientId]: oldClient.updateSocket(newClient.socket)
    };
  };

  /**
   * Set client belonging
   * @param clientId
   * @param room
   */
  setClientBelonging = (clientId, room) => {
    this.clients[clientId].belongsTo = room;
  }
}

module.exports = Clients;
