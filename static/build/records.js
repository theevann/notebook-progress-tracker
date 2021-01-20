"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _jsxFileName = "static/src/records.jsx";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import Button from "./Button.js";
import ConfirmModal from "./ConfirmModal.js";

var RecordsList = function (_React$Component) {
    _inherits(RecordsList, _React$Component);

    function RecordsList() {
        _classCallCheck(this, RecordsList);

        var _this = _possibleConstructorReturn(this, (RecordsList.__proto__ || Object.getPrototypeOf(RecordsList)).call(this));

        _this.state = {
            'session_id': null,
            'sessions': [],
            'records': [],
            'visible_records': [],
            'name_visible': true,
            'filters': {
                'sender_name': '',
                'f_time': '',
                'question_nb': ''
            }
        };
        return _this;
    }

    _createClass(RecordsList, [{
        key: "getSession",
        value: function getSession(session_id) {
            var session = session_id && this.state.sessions.find(function (s) {
                return s.id == session_id;
            });
            return session;
        }
    }, {
        key: "componentDidMount",
        value: function componentDidMount() {
            var _this2 = this;

            jQuery.get("/get-sessions", function (data) {
                _this2.setState({ 'sessions': data });
            });

            var sid = localStorage.getItem("sid");
            if (sid !== null) this.setState({ "session_id": sid }, this.update);
        }
    }, {
        key: "componentDidUpdate",
        value: function componentDidUpdate(prevProps, prevState) {
            MathJax && MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
            Rainbow.color();
        }
    }, {
        key: "changeSession",
        value: function changeSession(sid) {
            localStorage.setItem("sid", sid);
            this.setState({ "session_id": sid }, this.update);
        }
    }, {
        key: "update",
        value: function update() {
            var _this3 = this;

            console.log("Update");
            jQuery.get("/get-records?sid=" + this.state.session_id, function (data) {
                _this3.setState({ 'records': data }, _this3.updateVisibleRecords);
            });
        }
    }, {
        key: "onFilterChange",
        value: function onFilterChange(name, value) {
            var filters = this.state.filters;
            filters[name] = value;
            this.setState({ 'filters': filters }, this.updateVisibleRecords);
        }
    }, {
        key: "updateVisibleRecords",
        value: function updateVisibleRecords() {
            var filters = this.state.filters;
            var visible_records = [];

            try {
                this.state.records.forEach(function (record) {
                    if (!Object.keys(filters).every(function (key) {
                        if (key == "question_nb" && filters[key].toString() != "") return record[key].toString() === filters[key];
                        return record[key].toString().match(new RegExp(filters[key], "i"));
                    })) return;

                    visible_records.push(record);
                });
            } catch (e) {
                visible_records = this.state.records;
            }

            this.setState({ 'visible_records': visible_records });
        }
    }, {
        key: "clearFilters",
        value: function clearFilters(name, value) {
            var filters = {
                'sender_name': '',
                'f_time': '',
                'question_nb': ''
            };
            this.setState({ 'filters': filters }, this.updateVisibleRecords);
        }
    }, {
        key: "deleteRecords",
        value: function deleteRecords() {
            $.ajax({
                type: 'DELETE',
                url: "/del-records",
                data: { record_ids: this.state.visible_records.map(function (r) {
                        return r.id;
                    }) },
                success: this.update.bind(this)
            });
        }
    }, {
        key: "toggleName",
        value: function toggleName() {
            this.setState({
                name_visible: !this.state.name_visible
            });
        }
    }, {
        key: "render",
        value: function render() {
            var _this4 = this;

            var records = this.state.visible_records.map(function (record) {
                return React.createElement(RecordsRow, { key: record.id + "-" + record.f_time, record: record, update: _this4.update.bind(_this4), name_visible: _this4.state.name_visible, __source: {
                        fileName: _jsxFileName,
                        lineNumber: 108
                    },
                    __self: _this4
                });
            });

            var session_id = this.state.session_id;
            var session = this.getSession(session_id);
            var session_name = session && "[" + session_id + "] " + session.name || "Choose a session";

            return [React.createElement(
                "div",
                { key: "session_dropdown", className: "row dropdown mb-2", style: { display: "block", textAlign: "center" }, __source: {
                        fileName: _jsxFileName,
                        lineNumber: 116
                    },
                    __self: this
                },
                React.createElement(
                    "button",
                    { className: "btn btn-secondary dropdown-toggle", type: "button", id: "dropdownMenuButton", "data-toggle": "dropdown", "aria-haspopup": "true", "aria-expanded": "false", __source: {
                            fileName: _jsxFileName,
                            lineNumber: 117
                        },
                        __self: this
                    },
                    session_name
                ),
                React.createElement(
                    "div",
                    {
                        __source: {
                            fileName: _jsxFileName,
                            lineNumber: 120
                        },
                        __self: this
                    },
                    React.createElement(
                        "div",
                        { className: "dropdown-menu", "aria-labelledby": "dropdownMenuButton", __source: {
                                fileName: _jsxFileName,
                                lineNumber: 121
                            },
                            __self: this
                        },
                        this.state.sessions.map(function (_ref) {
                            var id = _ref.id,
                                name = _ref.name;
                            return React.createElement(
                                "a",
                                { key: id, className: "dropdown-item", href: "#", onClick: function onClick() {
                                        return _this4.changeSession(id);
                                    }, __source: {
                                        fileName: _jsxFileName,
                                        lineNumber: 123
                                    },
                                    __self: _this4
                                },
                                "[",
                                id,
                                "] ",
                                name
                            );
                        })
                    )
                )
            ), React.createElement(RecordsHeader, { key: "header", toggleName: this.toggleName.bind(this), name_visible: this.state.name_visible, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 128
                },
                __self: this
            }), React.createElement(RecordsSearchbar, { key: "searchbar", session: this.getSession(this.state.session_id), update: this.update.bind(this), "delete": this.deleteRecords.bind(this), clearFilters: this.clearFilters.bind(this), onFilterChange: this.onFilterChange.bind(this), __source: {
                    fileName: _jsxFileName,
                    lineNumber: 129
                },
                __self: this
            }), React.createElement(
                "div",
                { className: "row", style: { overflowY: "auto" }, __source: {
                        fileName: _jsxFileName,
                        lineNumber: 130
                    },
                    __self: this
                },
                React.createElement(
                    "div",
                    { className: "col", __source: {
                            fileName: _jsxFileName,
                            lineNumber: 132
                        },
                        __self: this
                    },
                    records
                )
            )];
        }
    }]);

    return RecordsList;
}(React.Component);

var RecordsSearchbar = function (_React$Component2) {
    _inherits(RecordsSearchbar, _React$Component2);

    function RecordsSearchbar() {
        _classCallCheck(this, RecordsSearchbar);

        var _this5 = _possibleConstructorReturn(this, (RecordsSearchbar.__proto__ || Object.getPrototypeOf(RecordsSearchbar)).call(this));

        _this5.state = {};
        return _this5;
    }

    _createClass(RecordsSearchbar, [{
        key: "handleFilterTextChange",
        value: function handleFilterTextChange(e) {
            this.props.onFilterChange(e.target.name, e.target.value);
        }
    }, {
        key: "clearFilters",
        value: function clearFilters() {
            document.querySelectorAll(".search input").forEach(function (input) {
                return input.value = '';
            });
            this.props.clearFilters();
        }
    }, {
        key: "render",
        value: function render() {
            var _this6 = this;

            var fields = [['Name', 'sender_name'], ['Date', 'f_time'], ['Question nb', 'question_nb']];
            var is_sharing = this.props.session && this.props.session.sharing;
            return React.createElement(
                "div",
                {
                    __source: {
                        fileName: _jsxFileName,
                        lineNumber: 161
                    },
                    __self: this
                },
                React.createElement(
                    "div",
                    { className: "row search row-record", __source: {
                            fileName: _jsxFileName,
                            lineNumber: 162
                        },
                        __self: this
                    },
                    fields.map(function (_ref2) {
                        var _ref3 = _slicedToArray(_ref2, 2),
                            name = _ref3[0],
                            field = _ref3[1];

                        return React.createElement(
                            "div",
                            { key: name, className: "col-sm col-record", __source: {
                                    fileName: _jsxFileName,
                                    lineNumber: 164
                                },
                                __self: _this6
                            },
                            React.createElement("input", { type: "text", name: field, placeholder: name, style: { 'width': '100%' }, onChange: _this6.handleFilterTextChange.bind(_this6), __source: {
                                    fileName: _jsxFileName,
                                    lineNumber: 165
                                },
                                __self: _this6
                            })
                        );
                    }),
                    React.createElement(
                        "div",
                        { className: "col-sm-5 col-record", __source: {
                                fileName: _jsxFileName,
                                lineNumber: 168
                            },
                            __self: this
                        },
                        React.createElement(
                            "button",
                            { onClick: this.clearFilters.bind(this), className: "btn btn-secondary", __source: {
                                    fileName: _jsxFileName,
                                    lineNumber: 169
                                },
                                __self: this
                            },
                            "Clear Filters"
                        ),
                        React.createElement(
                            "button",
                            { onClick: this.props.update, className: "btn btn-secondary", __source: {
                                    fileName: _jsxFileName,
                                    lineNumber: 170
                                },
                                __self: this
                            },
                            "Reload"
                        ),
                        is_sharing ? "" : React.createElement(
                            ConfirmModal,
                            { onClick: this.props.delete, textBody: "Do you want to delete the currently filtered records ?", __source: {
                                    fileName: _jsxFileName,
                                    lineNumber: 174
                                },
                                __self: this
                            },
                            React.createElement(Button, { btnClass: "danger", text: "Delete", title: "Delete visible records", faClass: "trash", faHideBig: true, __source: {
                                    fileName: _jsxFileName,
                                    lineNumber: 175
                                },
                                __self: this
                            })
                        )
                    )
                )
            );
        }
    }]);

    return RecordsSearchbar;
}(React.Component);

var RecordsHeader = function (_React$Component3) {
    _inherits(RecordsHeader, _React$Component3);

    function RecordsHeader() {
        _classCallCheck(this, RecordsHeader);

        return _possibleConstructorReturn(this, (RecordsHeader.__proto__ || Object.getPrototypeOf(RecordsHeader)).apply(this, arguments));
    }

    _createClass(RecordsHeader, [{
        key: "render",
        value: function render() {
            var _this8 = this;

            var names = ['Date', 'Question number'];
            return React.createElement(
                "div",
                { className: "row header row-record", __source: {
                        fileName: _jsxFileName,
                        lineNumber: 190
                    },
                    __self: this
                },
                React.createElement(
                    "div",
                    { className: "col-sm col-record", __source: {
                            fileName: _jsxFileName,
                            lineNumber: 191
                        },
                        __self: this
                    },
                    "Name  ",
                    React.createElement("i", { onClick: this.props.toggleName, className: "fa fa-eye" + (this.props.name_visible ? "" : "-slash"), style: { "fontSize": "15px" }, __source: {
                            fileName: _jsxFileName,
                            lineNumber: 191
                        },
                        __self: this
                    })
                ),
                names.map(function (name) {
                    return React.createElement(
                        "div",
                        { key: name, className: "col-sm col-record", __source: {
                                fileName: _jsxFileName,
                                lineNumber: 193
                            },
                            __self: _this8
                        },
                        name
                    );
                }),
                React.createElement(
                    "div",
                    { className: "col-sm-5 col-record", __source: {
                            fileName: _jsxFileName,
                            lineNumber: 195
                        },
                        __self: this
                    },
                    "Answer"
                )
            );
        }
    }]);

    return RecordsHeader;
}(React.Component);

// shared session
// settings change pwd

var RecordsRow = function (_React$Component4) {
    _inherits(RecordsRow, _React$Component4);

    function RecordsRow() {
        _classCallCheck(this, RecordsRow);

        return _possibleConstructorReturn(this, (RecordsRow.__proto__ || Object.getPrototypeOf(RecordsRow)).apply(this, arguments));
    }

    _createClass(RecordsRow, [{
        key: "render",
        value: function render() {
            var _this10 = this;

            var record = this.props.record;
            var fields = ['f_time', 'question_nb'];
            var data = record.f_data;

            if (record.type == 'image') {
                data = React.createElement("img", { className: "image", src: "data:;base64," + data, style: { 'maxWidth': '100%', 'maxHeight': '100%' }, __source: {
                        fileName: _jsxFileName,
                        lineNumber: 212
                    },
                    __self: this
                });
            } else if (record.type == 'ndarray') {
                data = "$$ " + data + " $$";
            } else if (record.type == 'ndarray' && !data.startsWith("\\begin")) {
                data = data.split('\n').map(function (text, key) {
                    return React.createElement(
                        "span",
                        { key: key, __source: {
                                fileName: _jsxFileName,
                                lineNumber: 216
                            },
                            __self: _this10
                        },
                        text,
                        React.createElement("br", {
                            __source: {
                                fileName: _jsxFileName,
                                lineNumber: 216
                            },
                            __self: _this10
                        })
                    );
                }); //TODO
            } else if (['code', 'list'].includes(record.type)) {
                if (record.type === 'list') data = JSON.stringify(data, null);
                data = React.createElement(
                    "pre",
                    {
                        __source: {
                            fileName: _jsxFileName,
                            lineNumber: 219
                        },
                        __self: this
                    },
                    React.createElement(
                        "code",
                        { className: "", "data-language": "python", __source: {
                                fileName: _jsxFileName,
                                lineNumber: 219
                            },
                            __self: this
                        },
                        data
                    )
                );
            } else {
                data = React.createElement(
                    "p",
                    {
                        __source: {
                            fileName: _jsxFileName,
                            lineNumber: 221
                        },
                        __self: this
                    },
                    data
                );
            }

            return React.createElement(
                "div",
                { className: "row row-record", __source: {
                        fileName: _jsxFileName,
                        lineNumber: 225
                    },
                    __self: this
                },
                React.createElement(
                    "div",
                    { className: "col-sm col-record", __source: {
                            fileName: _jsxFileName,
                            lineNumber: 226
                        },
                        __self: this
                    },
                    this.props.name_visible ? record["sender_name"] : ""
                ),
                fields.map(function (field) {
                    return React.createElement(
                        "div",
                        { key: field, className: "col-sm col-record", __source: {
                                fileName: _jsxFileName,
                                lineNumber: 230
                            },
                            __self: _this10
                        },
                        React.createElement(
                            "p",
                            {
                                __source: {
                                    fileName: _jsxFileName,
                                    lineNumber: 231
                                },
                                __self: _this10
                            },
                            record[field]
                        )
                    );
                }),
                React.createElement(
                    "div",
                    { className: "col-sm-5 col-record", __source: {
                            fileName: _jsxFileName,
                            lineNumber: 234
                        },
                        __self: this
                    },
                    data
                )
            );
        }
    }]);

    return RecordsRow;
}(React.Component);

var domContainer = document.querySelector('#records-list');
var record_list = ReactDOM.render(React.createElement(RecordsList), domContainer);
MathJax.Hub.Queue(["Typeset", MathJax.Hub]);

document.onfocus = function () {
    return record_list.update();
};
setInterval(function () {
    if (document.hasFocus()) record_list.update();
}, 30000);