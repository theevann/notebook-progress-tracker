
class SessionList extends React.Component {
    constructor() {
        super();
        this.state = { 'sessions': [] };
    }

    componentDidMount() {
      this.update();
    }

    update() {
        jQuery.get("/get-sessions", (data) => {
            this.setState({ 'sessions': data });
        });
    }

    render() {
        let names = ['ID', 'Name', 'Description', 'Creation Date', 'Status'];
        let fields = ['id', 'name', 'description', 'f_creation_date'];

        return [
            React.createElement(SessionHeader, {key: "header", names: names}),
            this.state.sessions.map((session) => React.createElement(SessionRow, {key: session.id, session: session, fields: fields, update: () => this.update()}))
        ];
    }
}


class SessionHeader extends React.Component {
    render() {
        return (
            React.createElement("div", {className: "row header"}, 
                this.props.names.map(name =>
                    React.createElement("div", {key: name, className: "col-sm"}, name)
                ), 
                React.createElement("div", {className: "col-sm-1"}, 
                    "Delete"
                )
            )
        );
    }
}


class SessionRow extends React.Component {
    constructor(props) {
        super(props);
        this.state = { };
    }

    delete_session() {
        $.get("/del-session?id=" + this.props.session.id, this.props.update);
    }

    toggle_session_state() {
        $.get("/toggle-session?id=" + this.props.session.id, this.props.update);
    }

    render() {
        let session = this.props.session;
        return (
            React.createElement("div", {key: "fields", className: "row"}, 
                this.props.fields.map(field =>
                    React.createElement("div", {key: field, className: "col-sm"}, session[field])
                ), 
                React.createElement("div", {className: "col-sm cliquable", onClick: () => this.toggle_session_state()}, 
                     session.open ? "Open" : "Closed", 
                    React.createElement("i", {className: "fa fa-toggle-" + (session.open ? "on" : "off"), style: {"fontSize": "24px"}})
                ), 
                React.createElement("div", {className: "col-sm-1 cliquable", onClick: () => this.delete_session()}, 
                    React.createElement("i", {className: "fa fa-trash"})
                )
            )
        );
    }
}


const domContainer = document.querySelector('#session-list');
let session_list = ReactDOM.render(React.createElement(SessionList), domContainer);

var add_session = function (form) {
    $.post("/add-session", $(form).serialize(), () => session_list.update.call(session_list));
    form.reset();
};