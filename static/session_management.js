var _jsxFileName = 'static/src/session_management.jsx';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SessionParts = function (_React$Component) {
    _inherits(SessionParts, _React$Component);

    function SessionParts() {
        _classCallCheck(this, SessionParts);

        var _this = _possibleConstructorReturn(this, (SessionParts.__proto__ || Object.getPrototypeOf(SessionParts)).call(this));

        _this.state = { 'parts': [] };
        return _this;
    }

    _createClass(SessionParts, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.update();
        }
    }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate(prevProps, prevState) {
            $('#session-parts').sortable();
        }
    }, {
        key: 'update',
        value: function update() {
            var _this2 = this;

            var session_id = window.location.pathname.split('/').slice(-1)[0];
            jQuery.get("/get-session?id=" + session_id, function (data) {
                _this2.setState({ 'parts': data['parts'] });
            });
        }
    }, {
        key: 'render',
        value: function render() {
            var _this3 = this;

            var parts = this.state['parts'];
            return parts.map(function (part) {
                return React.createElement(
                    'div',
                    { 'class': 'row row-sessm', __source: {
                            fileName: _jsxFileName,
                            lineNumber: 26
                        },
                        __self: _this3
                    },
                    React.createElement(
                        'div',
                        { 'class': 'col-sm-1 col-sessm', __source: {
                                fileName: _jsxFileName,
                                lineNumber: 27
                            },
                            __self: _this3
                        },
                        part.number
                    ),
                    React.createElement(
                        'div',
                        { 'class': 'col-sm-2 col-sessm', __source: {
                                fileName: _jsxFileName,
                                lineNumber: 28
                            },
                            __self: _this3
                        },
                        part.name
                    )
                );
            });
        }
    }]);

    return SessionParts;
}(React.Component);

var domContainer = document.querySelector('#session-parts');
var session_list = ReactDOM.render(React.createElement(SessionParts), domContainer);

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