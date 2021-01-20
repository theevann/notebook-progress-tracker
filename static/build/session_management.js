var _jsxFileName = "static/src/session_management.jsx";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import Button from "./Button.js";
import ConfirmModal from "./ConfirmModal.js";

var Sharing = function (_React$Component) {
    _inherits(Sharing, _React$Component);

    function Sharing() {
        _classCallCheck(this, Sharing);

        var _this = _possibleConstructorReturn(this, (Sharing.__proto__ || Object.getPrototypeOf(Sharing)).call(this));

        _this.state = {
            session: null,
            session_id: window.location.pathname.split('/').slice(-1)[0]
        };
        return _this;
    }

    _createClass(Sharing, [{
        key: "componentDidMount",
        value: function componentDidMount() {
            this.update();
        }
    }, {
        key: "update",
        value: function update() {
            var _this2 = this;

            jQuery.get("/get-session?id=" + this.state.session_id, function (data) {
                _this2.setState({ session: data });
            });
        }
    }, {
        key: "createShare",
        value: function createShare() {
            var _this3 = this;

            var user = $("#username-input").val();
            jQuery.get("/add-share?sid=" + this.state.session_id + "&username=" + user, function () {
                return _this3.update();
            });
        }
    }, {
        key: "deleteShare",
        value: function deleteShare(user) {
            var _this4 = this;

            jQuery.get("/del-share?sid=" + this.state.session_id + "&username=" + user, function () {
                return _this4.update();
            });
        }
    }, {
        key: "render",
        value: function render() {
            var _this5 = this;

            var users = this.state.session && this.state.session['f_shared_users'] || [];

            return React.createElement(
                "div",
                {
                    __source: {
                        fileName: _jsxFileName,
                        lineNumber: 36
                    },
                    __self: this
                },
                React.createElement(
                    "div",
                    { className: "row mt-3", __source: {
                            fileName: _jsxFileName,
                            lineNumber: 37
                        },
                        __self: this
                    },
                    React.createElement(
                        "div",
                        { className: "col-6 col-lg-3", __source: {
                                fileName: _jsxFileName,
                                lineNumber: 38
                            },
                            __self: this
                        },
                        React.createElement(
                            "h3",
                            {
                                __source: {
                                    fileName: _jsxFileName,
                                    lineNumber: 39
                                },
                                __self: this
                            },
                            "Sharing ",
                            React.createElement("span", { className: "fa fa-users", __source: {
                                    fileName: _jsxFileName,
                                    lineNumber: 39
                                },
                                __self: this
                            })
                        )
                    )
                ),
                users.map(function (user) {
                    return React.createElement(
                        "div",
                        { className: "row my-1", __source: {
                                fileName: _jsxFileName,
                                lineNumber: 43
                            },
                            __self: _this5
                        },
                        React.createElement(
                            "div",
                            { className: "col-4 col-lg-2 text-center", __source: {
                                    fileName: _jsxFileName,
                                    lineNumber: 44
                                },
                                __self: _this5
                            },
                            user
                        ),
                        React.createElement(
                            "div",
                            { className: "col-2 col-lg-1", __source: {
                                    fileName: _jsxFileName,
                                    lineNumber: 45
                                },
                                __self: _this5
                            },
                            React.createElement(
                                ConfirmModal,
                                { onClick: function onClick() {
                                        return _this5.deleteShare(user);
                                    }, textBody: "Are you sure to cancel this share ?", __source: {
                                        fileName: _jsxFileName,
                                        lineNumber: 46
                                    },
                                    __self: _this5
                                },
                                React.createElement(Button, { faClass: "trash", btnClass: "danger", classes: "w-100", title: "Cancel share with this user", __source: {
                                        fileName: _jsxFileName,
                                        lineNumber: 47
                                    },
                                    __self: _this5
                                })
                            )
                        )
                    );
                }),
                React.createElement(
                    "div",
                    { className: "row", __source: {
                            fileName: _jsxFileName,
                            lineNumber: 52
                        },
                        __self: this
                    },
                    React.createElement(
                        "div",
                        { className: "col-4 col-lg-2", __source: {
                                fileName: _jsxFileName,
                                lineNumber: 53
                            },
                            __self: this
                        },
                        React.createElement("input", { id: "username-input", className: "form-control w-100", type: "text", __source: {
                                fileName: _jsxFileName,
                                lineNumber: 54
                            },
                            __self: this
                        })
                    ),
                    React.createElement(
                        "div",
                        { className: "col-2 col-lg-1", __source: {
                                fileName: _jsxFileName,
                                lineNumber: 56
                            },
                            __self: this
                        },
                        React.createElement(Button, { faClass: "user-plus", btnClass: "primary", classes: "w-100", title: "Share current session with this user", onClick: function onClick() {
                                return _this5.createShare();
                            }, __source: {
                                fileName: _jsxFileName,
                                lineNumber: 57
                            },
                            __self: this
                        })
                    )
                )
            );
        }
    }]);

    return Sharing;
}(React.Component);

var sharingContainer = document.querySelector('#sharing');
var sharing = ReactDOM.render(React.createElement(Sharing), sharingContainer);

var SessionParts = function (_React$Component2) {
    _inherits(SessionParts, _React$Component2);

    function SessionParts() {
        _classCallCheck(this, SessionParts);

        var _this6 = _possibleConstructorReturn(this, (SessionParts.__proto__ || Object.getPrototypeOf(SessionParts)).call(this));

        _this6.state = { 'parts': [] };
        return _this6;
    }

    _createClass(SessionParts, [{
        key: "componentDidMount",
        value: function componentDidMount() {
            this.update();
        }
    }, {
        key: "componentDidUpdate",
        value: function componentDidUpdate(prevProps, prevState) {
            $('#session-parts').sortable();
        }
    }, {
        key: "update",
        value: function update() {
            var _this7 = this;

            var session_id = window.location.pathname.split('/').slice(-1)[0];
            jQuery.get("/get-session?id=" + session_id, function (data) {
                _this7.setState({ 'parts': data['parts'] });
            });
        }
    }, {
        key: "render",
        value: function render() {
            var _this8 = this;

            var parts = this.state['parts'];
            return parts.map(function (part) {
                return React.createElement(
                    "div",
                    { className: "row row-sessm", __source: {
                            fileName: _jsxFileName,
                            lineNumber: 98
                        },
                        __self: _this8
                    },
                    React.createElement(
                        "div",
                        { className: "col-sm-1 col-sessm", __source: {
                                fileName: _jsxFileName,
                                lineNumber: 99
                            },
                            __self: _this8
                        },
                        part.number
                    ),
                    React.createElement(
                        "div",
                        { className: "col-sm-2 col-sessm", __source: {
                                fileName: _jsxFileName,
                                lineNumber: 100
                            },
                            __self: _this8
                        },
                        part.name
                    )
                );
            });
        }
    }]);

    return SessionParts;
}(React.Component);

// const domContainer = document.querySelector('#session-parts');
// let session_list = ReactDOM.render(React.createElement(SessionParts), domContainer);

var session_id = window.location.pathname.split('/').slice(-1)[0];

/* Toggle session state */

$('#toggle-session').change(function () {
    $.get("/toggle-session?id=" + session_id);
});

/* Save name and description on change */

var nameInput = document.getElementById('name-input');
var descInput = document.getElementById('desc-input');
var timeout = null;

descInput.onkeyup = nameInput.onkeyup = function (e) {
    clearTimeout(timeout);
    timeout = setTimeout(postChanges, 500);
};

window.onbeforeunload = function () {
    if (timeout !== null) postChanges();
};

function postChanges() {
    $.ajax({
        type: 'POST',
        url: "/update-session",
        data: {
            id: session_id,
            name: nameInput.value,
            description: descInput.value
        },
        async: false
    });
}