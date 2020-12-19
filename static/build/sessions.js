"use strict";

var _jsxFileName = "static/src/sessions.jsx";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SessionList = function (_React$Component) {
    _inherits(SessionList, _React$Component);

    function SessionList() {
        _classCallCheck(this, SessionList);

        var _this = _possibleConstructorReturn(this, (SessionList.__proto__ || Object.getPrototypeOf(SessionList)).call(this));

        _this.state = { 'sessions': [] };
        return _this;
    }

    _createClass(SessionList, [{
        key: "componentDidMount",
        value: function componentDidMount() {
            this.update();
        }
    }, {
        key: "update",
        value: function update() {
            var _this2 = this;

            jQuery.get("/get-sessions", function (data) {
                _this2.setState({ 'sessions': data });
            });
        }
    }, {
        key: "render",
        value: function render() {
            var _this3 = this;

            var names = ['ID', 'Name', 'Description', 'Creation Date', 'Status'];
            var fields = ['id', 'name', 'description', 'f_creation_date'];

            return [React.createElement(SessionHeader, { key: "header", names: names, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 24
                },
                __self: this
            }), this.state.sessions.map(function (session) {
                var Row = session.sharing ? SharedSessionRow : SessionRow;
                return React.createElement(Row, { key: session.id, session: session, fields: fields, update: function update() {
                        return _this3.update();
                    }, __source: {
                        fileName: _jsxFileName,
                        lineNumber: 27
                    },
                    __self: _this3
                });
            })];
        }
    }]);

    return SessionList;
}(React.Component);

var SessionHeader = function (_React$Component2) {
    _inherits(SessionHeader, _React$Component2);

    function SessionHeader() {
        _classCallCheck(this, SessionHeader);

        return _possibleConstructorReturn(this, (SessionHeader.__proto__ || Object.getPrototypeOf(SessionHeader)).apply(this, arguments));
    }

    _createClass(SessionHeader, [{
        key: "render",
        value: function render() {
            var _this5 = this;

            return React.createElement(
                "div",
                { className: "row header row-session", __source: {
                        fileName: _jsxFileName,
                        lineNumber: 37
                    },
                    __self: this
                },
                this.props.names.map(function (name) {
                    return React.createElement(
                        "div",
                        { key: name, className: "col-sm col-session", __source: {
                                fileName: _jsxFileName,
                                lineNumber: 39
                            },
                            __self: _this5
                        },
                        name
                    );
                }),
                React.createElement(
                    "div",
                    { className: "col-sm-1 col-session", __source: {
                            fileName: _jsxFileName,
                            lineNumber: 41
                        },
                        __self: this
                    },
                    "Action"
                )
            );
        }
    }]);

    return SessionHeader;
}(React.Component);

var SessionRow = function (_React$Component3) {
    _inherits(SessionRow, _React$Component3);

    function SessionRow() {
        _classCallCheck(this, SessionRow);

        return _possibleConstructorReturn(this, (SessionRow.__proto__ || Object.getPrototypeOf(SessionRow)).apply(this, arguments));
    }

    _createClass(SessionRow, [{
        key: "edit_session",
        value: function edit_session() {
            window.location = "/sessions/" + this.props.session.id;
        }
    }, {
        key: "toggle_session_state",
        value: function toggle_session_state() {
            $.get("/toggle-session?id=" + this.props.session.id, this.props.update);
        }
    }, {
        key: "render",
        value: function render() {
            var _this7 = this;

            var session = this.props.session;
            return React.createElement(
                "div",
                { key: "fields", className: "row row-session", __source: {
                        fileName: _jsxFileName,
                        lineNumber: 62
                    },
                    __self: this
                },
                this.props.fields.map(function (field) {
                    return React.createElement(
                        "div",
                        { key: field, className: "col-sm col-session", __source: {
                                fileName: _jsxFileName,
                                lineNumber: 64
                            },
                            __self: _this7
                        },
                        session[field]
                    );
                }),
                React.createElement(
                    "div",
                    { className: "col-sm cliquable col-session", onClick: function onClick() {
                            return _this7.toggle_session_state();
                        }, __source: {
                            fileName: _jsxFileName,
                            lineNumber: 66
                        },
                        __self: this
                    },
                    session.open ? React.createElement(
                        "button",
                        { className: "btn btn-success", __source: {
                                fileName: _jsxFileName,
                                lineNumber: 68
                            },
                            __self: this
                        },
                        "Open  ",
                        React.createElement("i", { "class": "fa fa-unlock", __source: {
                                fileName: _jsxFileName,
                                lineNumber: 68
                            },
                            __self: this
                        })
                    ) : React.createElement(
                        "button",
                        { className: "btn btn-secondary", __source: {
                                fileName: _jsxFileName,
                                lineNumber: 69
                            },
                            __self: this
                        },
                        "Closed ",
                        React.createElement("i", { "class": "fa fa-lock", __source: {
                                fileName: _jsxFileName,
                                lineNumber: 69
                            },
                            __self: this
                        })
                    )
                ),
                React.createElement(
                    "div",
                    { className: "col-sm-1 cliquable col-session", onClick: function onClick() {
                            return _this7.edit_session();
                        }, __source: {
                            fileName: _jsxFileName,
                            lineNumber: 71
                        },
                        __self: this
                    },
                    React.createElement(
                        "a",
                        { href: "#", "class": "btn btn-primary btn-default", title: "Edit", __source: {
                                fileName: _jsxFileName,
                                lineNumber: 72
                            },
                            __self: this
                        },
                        React.createElement("span", { "class": "fa fa-pencil", __source: {
                                fileName: _jsxFileName,
                                lineNumber: 72
                            },
                            __self: this
                        })
                    )
                )
            );
        }
    }]);

    return SessionRow;
}(React.Component);

var SharedSessionRow = function (_React$Component4) {
    _inherits(SharedSessionRow, _React$Component4);

    function SharedSessionRow() {
        _classCallCheck(this, SharedSessionRow);

        return _possibleConstructorReturn(this, (SharedSessionRow.__proto__ || Object.getPrototypeOf(SharedSessionRow)).apply(this, arguments));
    }

    _createClass(SharedSessionRow, [{
        key: "unlink_session",
        value: function unlink_session() {
            $.get("/del-share?sid=" + this.props.session.id, this.props.update);
        }
    }, {
        key: "render",
        value: function render() {
            var _this9 = this;

            var session = this.props.session;
            return React.createElement(
                "div",
                { key: "fields", className: "row row-session", __source: {
                        fileName: _jsxFileName,
                        lineNumber: 88
                    },
                    __self: this
                },
                this.props.fields.map(function (field) {
                    return React.createElement(
                        "div",
                        { key: field, className: "col-sm col-session col-session-shared", __source: {
                                fileName: _jsxFileName,
                                lineNumber: 90
                            },
                            __self: _this9
                        },
                        session[field]
                    );
                }),
                React.createElement(
                    "div",
                    { className: "col-sm col-session col-session-shared", __source: {
                            fileName: _jsxFileName,
                            lineNumber: 92
                        },
                        __self: this
                    },
                    session.open ? React.createElement(
                        "button",
                        { className: "btn btn-success btn-disabled", disabled: true, __source: {
                                fileName: _jsxFileName,
                                lineNumber: 94
                            },
                            __self: this
                        },
                        "Open  ",
                        React.createElement("i", { "class": "fa fa-unlock", __source: {
                                fileName: _jsxFileName,
                                lineNumber: 94
                            },
                            __self: this
                        })
                    ) : React.createElement(
                        "button",
                        { className: "btn btn-secondary btn-disabled", disabled: true, __source: {
                                fileName: _jsxFileName,
                                lineNumber: 95
                            },
                            __self: this
                        },
                        "Closed ",
                        React.createElement("i", { "class": "fa fa-lock", __source: {
                                fileName: _jsxFileName,
                                lineNumber: 95
                            },
                            __self: this
                        })
                    )
                ),
                React.createElement(
                    "div",
                    { className: "col-sm-1 cliquable col-session col-session-shared", onClick: function onClick() {
                            return _this9.unlink_session();
                        }, __source: {
                            fileName: _jsxFileName,
                            lineNumber: 97
                        },
                        __self: this
                    },
                    React.createElement(
                        "a",
                        { href: "#", "class": "btn btn-primary btn-default", title: "End sharing", __source: {
                                fileName: _jsxFileName,
                                lineNumber: 98
                            },
                            __self: this
                        },
                        React.createElement("span", { "class": "fa fa-unlink", __source: {
                                fileName: _jsxFileName,
                                lineNumber: 98
                            },
                            __self: this
                        })
                    )
                )
            );
        }
    }]);

    return SharedSessionRow;
}(React.Component);

var domContainer = document.querySelector('#session-list');
var session_list = ReactDOM.render(React.createElement(SessionList), domContainer);

var add_session = function add_session(form) {
    $.post("/add-session", $(form).serialize(), function () {
        return session_list.update.call(session_list);
    });
    form.reset();
};