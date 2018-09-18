'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getTypes;
var types = ['client', 'offset', 'scroll', 'bounds', 'margin'];

function getTypes(props) {
  var allowedTypes = [];
  types.forEach(function (type) {
    if (props[type]) {
      allowedTypes.push(type);
    }
  });
  return allowedTypes;
}