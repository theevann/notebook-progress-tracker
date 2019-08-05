"use strict";

class SessionList extends React.Component {
  constructor() {
    super();
    this.state = {
      'sessions': []
    };
  }

  componentDidMount() {
    this.update();
  }

  update() {
    jQuery.get("/get-sessions", data => {
      this.setState({
        'sessions': data
      });
    });
  }

  render() {
    let names = ['ID', 'Name', 'Description', 'Creation Date', 'Status'];
    let fields = ['id', 'name', 'description', 'f_creation_date'];
    return [React.createElement(SessionHeader, {
      key: "header",
      names: names
    }), this.state.sessions.map(session => React.createElement(SessionRow, {
      key: session.id,
      session: session,
      fields: fields,
      update: () => this.update()
    }))];
  }

}

class SessionHeader extends React.Component {
  render() {
    return React.createElement("div", {
      className: "row header row-session"
    }, this.props.names.map(name => React.createElement("div", {
      key: name,
      className: "col-sm col-session"
    }, name)), React.createElement("div", {
      className: "col-sm-1 col-session"
    }, "Edit"));
  }

}

class SessionRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  edit_session() {
    window.location = "/sessions/" + this.props.session.id;
  }

  toggle_session_state() {
    $.get("/toggle-session?id=" + this.props.session.id, this.props.update);
  }

  render() {
    let session = this.props.session;
    return React.createElement("div", {
      key: "fields",
      className: "row row-session"
    }, this.props.fields.map(field => React.createElement("div", {
      key: field,
      className: "col-sm col-session"
    }, session[field])), React.createElement("div", {
      className: "col-sm cliquable col-session",
      onClick: () => this.toggle_session_state()
    }, session.open ? "Open" : "Closed", React.createElement("i", {
      className: "fa fa-toggle-" + (session.open ? "on" : "off"),
      style: {
        "fontSize": "24px"
      }
    })), React.createElement("div", {
      className: "col-sm-1 cliquable col-session",
      onClick: () => this.edit_session()
    }, React.createElement("a", {
      href: "#",
      class: "btn btn-primary btn-default"
    }, React.createElement("span", {
      class: "glyphicon glyphicon-pencil"
    }))));
  }

}

const domContainer = document.querySelector('#session-list');
let session_list = ReactDOM.render(React.createElement(SessionList), domContainer);

var add_session = function (form) {
  $.post("/add-session", $(form).serialize(), () => session_list.update.call(session_list));
  form.reset();
};