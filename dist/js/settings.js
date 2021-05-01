import React from "../_snowpack/pkg/react.js";
import ReactDOM from "../_snowpack/pkg/react-dom.js";
import Button from "./Button.js";
import ConfirmModal from "./ConfirmModal.js";
class DeleteButton extends React.Component {
  deleteShare() {
    jQuery.get(`/delete-account`);
  }
  render() {
    return /* @__PURE__ */ React.createElement("div", {
      class: "text-center"
    }, /* @__PURE__ */ React.createElement("div", {
      class: "col"
    }, /* @__PURE__ */ React.createElement("div", {
      class: "mb-5"
    }, /* @__PURE__ */ React.createElement(ConfirmModal, {
      onClick: this.deleteShare,
      textHeader: "Account deletion",
      textBody: "Are you sure that you want to delete your account ? This cannot be undone."
    }, /* @__PURE__ */ React.createElement(Button, {
      btnClass: "danger",
      text: "Delete",
      classes: "px-5",
      title: "Delete your account",
      faHideBig: false
    })))));
  }
}
const deleteButtonContainer = document.querySelector("#delete-button-container");
ReactDOM.render(React.createElement(DeleteButton), deleteButtonContainer);
