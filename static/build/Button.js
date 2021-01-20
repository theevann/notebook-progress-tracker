var _jsxFileName = "static/src/Button.jsx";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Button = function (_React$Component) {
    _inherits(Button, _React$Component);

    function Button() {
        _classCallCheck(this, Button);

        var _this = _possibleConstructorReturn(this, (Button.__proto__ || Object.getPrototypeOf(Button)).call(this));

        _this.state = {};
        return _this;
    }

    _createClass(Button, [{
        key: "render",
        value: function render() {
            var text = this.props.text || "";
            var title = this.props.title || "";
            var classes = this.props.classes || "";
            var faClass = this.props.faClass || "";
            var faDisplay = this.props.faHideBig ? "d-md-none" : "";
            var btnClass = this.props.btnClass || "primary";
            var onClick = this.props.onClick || function () {};

            return React.createElement(
                "button",
                { onClick: onClick, className: "btn btn-" + btnClass + " " + classes, title: title, __source: {
                        fileName: _jsxFileName,
                        lineNumber: 16
                    },
                    __self: this
                },
                React.createElement(
                    "span",
                    { "class": "d-none d-md-inline", __source: {
                            fileName: _jsxFileName,
                            lineNumber: 17
                        },
                        __self: this
                    },
                    text
                ),
                faClass !== "" ? React.createElement("span", { style: { lineHeight: 1.5 }, className: "fa fa-" + faClass + " d-inline " + faDisplay, __source: {
                        fileName: _jsxFileName,
                        lineNumber: 18
                    },
                    __self: this
                }) : ""
            );
        }
    }]);

    return Button;
}(React.Component);

export default Button;