'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.arraysEqual = exports.fontSizeConverter = exports.includeProps = exports.omitProps = undefined;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Creates new object from target excluding given properties.
 */
var omitProps = exports.omitProps = function omitProps(target, props) {
  return Object.keys(target).reduce(function (r, key) {
    if (!~props.indexOf(key)) {
      r[key] = target[key];
    }
    return r;
  }, {});
};

/**
 * Creates new object from target including all available properties.
 */
var includeProps = exports.includeProps = function includeProps(target, props) {
  return Object.keys(target).reduce(function (r, key) {
    if (~props.indexOf(key) && key in target) {
      r[key] = target[key];
    }
    return r;
  }, {});
};

/**
 * Computes appropriate font size of tag.
 */
var fontSizeConverter = exports.fontSizeConverter = function fontSizeConverter(count, min, max, minSize, maxSize) {
  return Math.round((count - min) * (maxSize - minSize) / (max - min) + minSize);
};

/**
 * Returns true if arrays contains the same elements.
 */
var arraysEqual = exports.arraysEqual = function arraysEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return false;
  }
  return arr1.every(function (o, i) {
    return _lodash2.default.isEqual(o, arr2[i]);
  });
};