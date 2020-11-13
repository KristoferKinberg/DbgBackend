const { uuidv4 } = require('./helpers');

class Clients {
  clients = {};

  /**
   * Add player to server
   * @param socket
   */
  addPlayer = socket => {
    const clientId = `cid_${uuidv4()}`;
    this.clients = {
      ...this.clients,
      [clientId]: {
        id: clientId,
        socket,
      }
    }

    return clientId;
  };

  /**
   * Get a specific player
   * @param clientId
   * @returns {*}
   */
  getPlayer = clientId => this.clients[clientId];

  /**
   * Get several players by id
   * @param clientIds
   * @returns {Uint8Array | BigInt64Array | *[] | Float64Array | Int8Array | Float32Array | Int32Array | Uint32Array | Uint8ClampedArray | BigUint64Array | Int16Array | Uint16Array}
   */
  getPlayersByIds = clientIds => clientIds.map(clientId => this.clients[clientId]);
}

module.exports = Clients;
