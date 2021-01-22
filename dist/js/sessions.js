"use strict";
import React from "../_snowpack/pkg/react.js";
import ReactDOM from "../_snowpack/pkg/react-dom.js";
import Button from "./Button.js";
class SessionList extends React.Component {
  constructor() {
    super();
    this.state = {sessions: []};
  }
  componentDidMount() {
    this.update();
  }
  update() {
    jQuery.get("/get-sessions", (data) => {
      this.setState({sessions: data});
    });
  }
  render() {
    let names = ["ID", "Name", "Description", "Creation Date", "Status"];
    let fields = ["id", "name", "description", "f_creation_date"];
    return [
      /* @__PURE__ */ React.createElement(SessionHeader, {
        key: "header",
        names
      }),
      this.state.sessions.map((session) => {
        let Row = session.sharing ? SharedSessionRow : SessionRow;
        return /* @__PURE__ */ React.createElement(Row, {
          key: session.id,
          session,
          fields,
          update: () => this.update()
        });
      })
    ];
  }
}
class SessionHeader extends React.Component {
  render() {
    return /* @__PURE__ */ React.createElement("div", {
      className: "row header row-session"
    }, this.props.names.map((name) => /* @__PURE__ */ React.createElement("div", {
      key: name,
      className: "col-sm col-session"
    }, name)), /* @__PURE__ */ React.createElement("div", {
      className: "col-sm-1 col-session"
    }, "Action"));
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
    return /* @__PURE__ */ React.createElement("div", {
      key: "fields",
      className: "row row-session"
    }, this.props.fields.map((field) => /* @__PURE__ */ React.createElement("div", {
      key: field,
      className: "col-sm col-session"
    }, session[field])), /* @__PURE__ */ React.createElement("div", {
      className: "col-sm col-session",
      onClick: () => this.toggle_session_state()
    }, session.open ? /* @__PURE__ */ React.createElement(Button, {
      faClass: "unlock",
      btnClass: "success",
      text: "Open  "
    }) : /* @__PURE__ */ React.createElement(Button, {
      faClass: "lock",
      btnClass: "secondary",
      text: "Closed "
    })), /* @__PURE__ */ React.createElement("div", {
      className: "col-sm-1 cliquable col-session",
      onClick: () => this.edit_session()
    }, /* @__PURE__ */ React.createElement(Button, {
      faClass: "pencil",
      btnClass: "primary",
      title: "Edit"
    })));
  }
}
class SharedSessionRow extends React.Component {
  unlink_session() {
    $.get("/del-share?sid=" + this.props.session.id, this.props.update);
  }
  render() {
    let session = this.props.session;
    return /* @__PURE__ */ React.createElement("div", {
      key: "fields",
      className: "row row-session"
    }, this.props.fields.map((field) => /* @__PURE__ */ React.createElement("div", {
      key: field,
      className: "col-sm col-session col-session-shared"
    }, session[field])), /* @__PURE__ */ React.createElement("div", {
      className: "col-sm col-session col-session-shared"
    }, session.open ? /* @__PURE__ */ React.createElement("button", {
      className: "btn btn-success btn-disabled",
      disabled: true
    }, "Open  ", /* @__PURE__ */ React.createElement("i", {
      class: "fa fa-unlock"
    })) : /* @__PURE__ */ React.createElement("button", {
      className: "btn btn-secondary btn-disabled",
      disabled: true
    }, "Closed ", /* @__PURE__ */ React.createElement("i", {
      class: "fa fa-lock"
    }))), /* @__PURE__ */ React.createElement("div", {
      className: "col-sm-1 cliquable col-session col-session-shared",
      onClick: () => this.unlink_session()
    }, /* @__PURE__ */ React.createElement("a", {
      href: "#",
      class: "btn btn-primary btn-default",
      title: "End sharing"
    }, /* @__PURE__ */ React.createElement("span", {
      class: "fa fa-unlink"
    }))));
  }
}
const domContainer = document.querySelector("#session-list");
let session_list = ReactDOM.render(React.createElement(SessionList), domContainer);
window.add_session = function(form) {
  $.post("/add-session", $(form).serialize(), () => session_list.update.call(session_list));
  form.reset();
};
