var _jsxFileName = "static/src/ConfirmModal.jsx";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var modalId = 0;

var ConfirmModal = function (_React$Component) {
    _inherits(ConfirmModal, _React$Component);

    function ConfirmModal() {
        _classCallCheck(this, ConfirmModal);

        var _this = _possibleConstructorReturn(this, (ConfirmModal.__proto__ || Object.getPrototypeOf(ConfirmModal)).call(this));

        _this.state = {
            id: modalId++
        };
        return _this;
    }

    _createClass(ConfirmModal, [{
        key: "render",
        value: function render() {
            var textBody = this.props.textBody || "";
            var textHeader = this.props.textHeader || "";
            var onClick = this.props.onClick || function () {};

            var modalId = "confirm-delete-" + this.state.id;

            return [React.createElement(
                "span",
                { "data-toggle": "modal", "data-target": "#" + modalId, __source: {
                        fileName: _jsxFileName,
                        lineNumber: 19
                    },
                    __self: this
                },
                this.props.children
            ), React.createElement(
                "div",
                { className: "modal fade", id: modalId, tabIndex: "-1", role: "dialog", "aria-labelledby": "myModalLabel", "aria-hidden": "true", __source: {
                        fileName: _jsxFileName,
                        lineNumber: 22
                    },
                    __self: this
                },
                React.createElement(
                    "div",
                    { className: "modal-dialog", __source: {
                            fileName: _jsxFileName,
                            lineNumber: 23
                        },
                        __self: this
                    },
                    React.createElement(
                        "div",
                        { className: "modal-content text-left", style: { "fontSize": "1.1rem" }, __source: {
                                fileName: _jsxFileName,
                                lineNumber: 24
                            },
                            __self: this
                        },
                        textHeader !== "" ? React.createElement(
                            "div",
                            { className: "modal-header", __source: {
                                    fileName: _jsxFileName,
                                    lineNumber: 25
                                },
                                __self: this
                            },
                            textHeader
                        ) : "",
                        textBody !== "" ? React.createElement(
                            "div",
                            { className: "modal-body", __source: {
                                    fileName: _jsxFileName,
                                    lineNumber: 26
                                },
                                __self: this
                            },
                            textBody
                        ) : "",
                        React.createElement(
                            "div",
                            { className: "modal-footer", __source: {
                                    fileName: _jsxFileName,
                                    lineNumber: 27
                                },
                                __self: this
                            },
                            React.createElement(
                                "button",
                                { type: "button", className: "btn btn-default", "data-dismiss": "modal", __source: {
                                        fileName: _jsxFileName,
                                        lineNumber: 28
                                    },
                                    __self: this
                                },
                                "Cancel"
                            ),
                            React.createElement(
                                "span",
                                { "data-dismiss": "modal", onClick: onClick, __source: {
                                        fileName: _jsxFileName,
                                        lineNumber: 29
                                    },
                                    __self: this
                                },
                                this.props.children
                            )
                        )
                    )
                )
            )];
        }
    }]);

    return ConfirmModal;
}(React.Component);

export default ConfirmModal;