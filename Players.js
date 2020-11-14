const { uuidv4 } = require('./helpers');

class Clients {
  clients = {};

  /**
   * Add client to server
   * @param socket
   */
  addClient = socket => {
    const clientId = `cid-${uuidv4()}`;
    this.clients = {
      ...this.clients,
      [clientId]: {
        id: clientId,
        belongsTo: '',
        socket,
      }
    }

    return clientId;
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
      [newId]: client,
      [oldClientId]: oldConnection,
      ...clients
    } = this.clients;

    return this.clients = { ...clients, [oldClientId]: { ...client, id: oldClientId}};
  };

  /**
   * Update client
   * @param clientId
   * @param data
   */
  updateClient = (clientId, data) => {
    this.clients = {
      ...this.clients,
      [clientId]: {
        ...this.getClient(clientId),
        ...data
      }
    }
  }

  /**
   * Set client belonging
   * @param clientId
   * @param roomId
   */
  setClientBelonging = (clientId, roomId) => {
    this.updateClient(clientId, { belongsTo: roomId });
  }
}

module.exports = Clients;
