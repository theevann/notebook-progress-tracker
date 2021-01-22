import React from "../_snowpack/pkg/react.js";
import ReactDOM from "../_snowpack/pkg/react-dom.js";
import Button from "./Button.js";
import ConfirmModal from "./ConfirmModal.js";
class Sharing extends React.Component {
  constructor() {
    super();
    this.state = {
      session: null,
      session_id: window.location.pathname.split("/").slice(-1)[0]
    };
  }
  componentDidMount() {
    this.update();
  }
  update() {
    jQuery.get("/get-session?id=" + this.state.session_id, (data) => {
      this.setState({session: data});
    });
  }
  createShare() {
    let user = $("#username-input").val();
    jQuery.get(`/add-share?sid=${this.state.session_id}&username=${user}`, () => this.update());
  }
  deleteShare(user) {
    jQuery.get(`/del-share?sid=${this.state.session_id}&username=${user}`, () => this.update());
  }
  render() {
    let users = this.state.session && this.state.session["f_shared_users"] || [];
    return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", {
      className: "row mt-3"
    }, /* @__PURE__ */ React.createElement("div", {
      className: "col-6 col-lg-3"
    }, /* @__PURE__ */ React.createElement("h3", null, "Sharing ", /* @__PURE__ */ React.createElement("span", {
      className: "fa fa-users"
    })))), users.map((user) => {
      return /* @__PURE__ */ React.createElement("div", {
        className: "row my-1"
      }, /* @__PURE__ */ React.createElement("div", {
        className: "col-4 col-lg-2 text-center"
      }, user), /* @__PURE__ */ React.createElement("div", {
        className: "col-2 col-lg-1"
      }, /* @__PURE__ */ React.createElement(ConfirmModal, {
        onClick: () => this.deleteShare(user),
        textBody: "Are you sure to delete this share ?"
      }, /* @__PURE__ */ React.createElement(Button, {
        faClass: "trash",
        btnClass: "danger",
        classes: "w-100",
        title: "Cancel share with this user"
      }))));
    }), /* @__PURE__ */ React.createElement("div", {
      className: "row"
    }, /* @__PURE__ */ React.createElement("div", {
      className: "col-4 col-lg-2"
    }, /* @__PURE__ */ React.createElement("input", {
      id: "username-input",
      className: "form-control w-100",
      type: "text"
    })), /* @__PURE__ */ React.createElement("div", {
      className: "col-2 col-lg-1"
    }, /* @__PURE__ */ React.createElement(Button, {
      faClass: "user-plus",
      btnClass: "primary",
      classes: "w-100",
      title: "Share current session with this user",
      onClick: () => this.createShare()
    }))));
  }
}
const sharingContainer = document.querySelector("#sharing");
let sharing = ReactDOM.render(React.createElement(Sharing), sharingContainer);
class SessionParts extends React.Component {
  constructor() {
    super();
    this.state = {parts: []};
  }
  componentDidMount() {
    this.update();
  }
  componentDidUpdate(prevProps, prevState) {
    $("#session-parts").sortable();
  }
  update() {
    var session_id2 = window.location.pathname.split("/").slice(-1)[0];
    jQuery.get("/get-session?id=" + session_id2, (data) => {
      this.setState({parts: data["parts"]});
    });
  }
  render() {
    let parts = this.state["parts"];
    return parts.map((part) => {
      return /* @__PURE__ */ React.createElement("div", {
        className: "row row-sessm"
      }, /* @__PURE__ */ React.createElement("div", {
        className: "col-sm-1 col-sessm"
      }, part.number), /* @__PURE__ */ React.createElement("div", {
        className: "col-sm-2 col-sessm"
      }, part.name));
    });
  }
}
let session_id = window.location.pathname.split("/").slice(-1)[0];
$("#toggle-session").change(function() {
  $.get("/toggle-session?id=" + session_id);
});
let nameInput = document.getElementById("name-input");
let descInput = document.getElementById("desc-input");
let timeout = null;
descInput.onkeyup = nameInput.onkeyup = function(e) {
  clearTimeout(timeout);
  timeout = setTimeout(postChanges, 500);
};
window.onbeforeunload = function() {
  if (timeout !== null)
    postChanges();
};
function postChanges() {
  $.ajax({
    type: "POST",
    url: "/update-session",
    data: {
      id: session_id,
      name: nameInput.value,
      description: descInput.value
    },
    async: false
  });
}
