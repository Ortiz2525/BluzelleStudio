'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _withContentRect = require('./with-content-rect');

var _withContentRect2 = _interopRequireDefault(_withContentRect);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Measure(_ref) {
  var measure = _ref.measure,
      measureRef = _ref.measureRef,
      contentRect = _ref.contentRect,
      children = _ref.children;

  return children({ measure: measure, measureRef: measureRef, contentRect: contentRect });
}

exports.default = (0, _withContentRect2.default)()(Measure);