"use strict";
import Button from "./button.js";

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
            this.state.sessions.map((session) => {
                let Row = session.sharing ? SharedSessionRow : SessionRow;
                return <Row key={session.id} session={session} fields={fields} update={() => this.update()} />
            })
        ];
    }
}


class SessionHeader extends React.Component {
    render() {
        return (
            <div className="row header row-session">
                {this.props.names.map(name =>
                    <div key={name} className='col-sm col-session'>{name}</div>
                )}
                <div className="col-sm-1 col-session">
                    Action
                </div>
            </div>
        );
    }
}


class SessionRow extends React.Component {
    edit_session() {
        window.location = "/sessions/" + this.props.session.id;
    }

    toggle_session_state() {
        $.get("/toggle-session?id=" + this.props.session.id, this.props.update);
    }

    render() {
        let session = this.props.session;
        return (
            <div key="fields" className="row row-session">
                {this.props.fields.map(field =>
                    <div key={field} className='col-sm col-session'>{session[field]}</div>
                )}
                <div className="col-sm col-session" onClick={() => this.toggle_session_state()}>
                    {session.open ?
                    <Button faClass="unlock" btnClass="success" text="Open  " /> :
                    <Button faClass="lock" btnClass="secondary" text="Closed " />}
                </div>
                <div className="col-sm-1 cliquable col-session" onClick={() => this.edit_session()}>
                    <Button faClass="pencil" btnClass="primary" title="Edit"/>
                </div>
            </div>
        );
    }
}

class SharedSessionRow extends React.Component {
    unlink_session() {
        $.get("/del-share?sid=" + this.props.session.id, this.props.update);
    }

    render() {
        let session = this.props.session;
        return (
            <div key="fields" className="row row-session">
                {this.props.fields.map(field =>
                    <div key={field} className='col-sm col-session col-session-shared'>{session[field]}</div>
                )}
                <div className="col-sm col-session col-session-shared">
                    {session.open ?
                        <button className="btn btn-success btn-disabled" disabled>Open  <i class="fa fa-unlock"></i></button> :
                        <button className="btn btn-secondary btn-disabled" disabled>Closed <i class="fa fa-lock"></i></button>}
                </div>
                <div className="col-sm-1 cliquable col-session col-session-shared" onClick={() => this.unlink_session()}>
                    <a href="#" class="btn btn-primary btn-default" title="End sharing"><span class="fa fa-unlink"></span></a>
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
