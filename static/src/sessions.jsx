"use strict";

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
            <SessionHeader key="header" names={names} />,
            this.state.sessions.map((session) => <SessionRow key={session.id} session={session} fields={fields} update={() => this.update()} />)
        ];
    }
}


class SessionHeader extends React.Component {
    render() {
        return (
            <div className="row header row-session">
                {this.props.names.map(name =>
                    <div key={name} className='col-sm'>{name}</div>
                )}
                <div className="col-sm-1">
                    Delete
                </div>
            </div>
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
            <div key="fields" className="row row-session">
                {this.props.fields.map(field =>
                    <div key={field} className='col-sm'>{session[field]}</div>
                )}
                <div className="col-sm cliquable" onClick={() => this.toggle_session_state()}>
                    { session.open ? "Open" : "Closed" }
                    <i className={"fa fa-toggle-" + (session.open ? "on" : "off") } style={{"fontSize": "24px"}}></i>
                </div>
                <div className="col-sm-1 cliquable" onClick={() => this.delete_session()}>
                    <i className="fa fa-trash"></i>
                </div>
            </div>
        );
    }
}


const domContainer = document.querySelector('#session-list');
let session_list = ReactDOM.render(React.createElement(SessionList), domContainer);

var add_session = function (form) {
    $.post("/add-session", $(form).serialize(), () => session_list.update.call(session_list));
    form.reset();
};
