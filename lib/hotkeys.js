'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hotkey_display = exports.hotkeys = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _mousetrap = require('mousetrap');

var _mousetrap2 = _interopRequireDefault(_mousetrap);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

_mousetrap2.default.prototype.stopCallback = function () {
  return false;
};

var default_options = {
  hot_key_property_name: 'hot_keys'
};

var global_hotkeys = {};

var hotkey_get_handler = function hotkey_get_handler(hotkey) {
  return function (e, combo) {
    var handlers = global_hotkeys[hotkey];
    var propagate = true;
    _lodash2.default.forEach(handlers, function (_ref) {
      var handler = _ref.handler;

      if (!propagate) return;
      propagate = handler(e, combo);
    });
    return !propagate;
  };
};

var load_hotkeys = function load_hotkeys(handlers) {
  _lodash2.default.forEach(handlers, function (response, hotkey) {
    if (global_hotkeys[hotkey] == null) {
      global_hotkeys[hotkey] = [response];
      _mousetrap2.default.bind(hotkey, hotkey_get_handler(hotkey));
    } else {
      global_hotkeys[hotkey].push(response);
      global_hotkeys[hotkey] = _lodash2.default.sortBy(global_hotkeys[hotkey], 'priority').reverse();
    }
  });
};
var unload_hotkeys = function unload_hotkeys(handlers) {
  _lodash2.default.forEach(handlers, function (response, hotkey) {
    _lodash2.default.remove(global_hotkeys[hotkey], response);
    if (global_hotkeys[hotkey].length === 0) {
      _mousetrap2.default.unbind(hotkey);
    }
  });
};

var hotkeys = exports.hotkeys = function hotkeys(Component) {
  var overwrites = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var options = _extends({}, default_options, overwrites);

  var HotKeysWrapper = function (_React$PureComponent) {
    _inherits(HotKeysWrapper, _React$PureComponent);

    function HotKeysWrapper() {
      var _ref2;

      var _temp, _this, _ret;

      _classCallCheck(this, HotKeysWrapper);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref2 = HotKeysWrapper.__proto__ || Object.getPrototypeOf(HotKeysWrapper)).call.apply(_ref2, [this].concat(args))), _this), _this.getWrappedComponent = function () {
        return _this.wrapped_component;
      }, _this.on_ref_update = function (ref) {
        _this.wrapped_component = ref;
      }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(HotKeysWrapper, [{
      key: 'componentDidMount',
      value: function componentDidMount() {
        var handlers = this.wrapped_component[options.hot_key_property_name];
        if (handlers == null) {
          console.warn('Component: ' + Component.displayName + ' did not provide hotkey handlers');
          return;
        }
        load_hotkeys(handlers);
      }
    }, {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        var handlers = this.wrapped_component[options.hot_key_property_name];
        if (handlers == null) return;
        unload_hotkeys(handlers);
      }
    }, {
      key: 'render',
      value: function render() {
        return _react2.default.createElement(Component, _extends({ ref: this.on_ref_update }, this.props));
      }
    }]);

    return HotKeysWrapper;
  }(_react2.default.PureComponent);

  return HotKeysWrapper;
};

exports.default = hotkeys;
var hotkey_display = exports.hotkey_display = function hotkey_display(shortcut) {
  var am_mac = window.navigator.appVersion.indexOf('Mac') !== -1;
  if (!am_mac) return shortcut;
  var mac_shortcut = shortcut.replace('alt', 'option');
  return mac_shortcut.replace('meta', '⌘');
};