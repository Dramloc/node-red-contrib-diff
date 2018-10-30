const get = require("lodash/get");

module.exports = RED => {
  function diff(config) {
    RED.nodes.createNode(this, config);
    const node = this;
    const { keyPath } = config;
    node.lastPayload = null;

    const diffPayloads = (previous, current) => {
      return current.reduce((result, item) => {
        if (
          previous.some(other => get(other, keyPath) === get(item, keyPath))
        ) {
          return result;
        }
        return [...result, item];
      }, []);
    };

    node.on("input", msg => {
      const { payload } = msg;
      if (node.lastPayload === null) {
        node.lastPayload = payload;
        return;
      }
      const result = diffPayloads(node.lastPayload, payload);
      node.lastPayload = payload;
      return node.send({ payload: result });
    });
  }
  RED.nodes.registerType("diff", diff);
};
