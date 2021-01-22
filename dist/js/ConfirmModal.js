import React from "../_snowpack/pkg/react.js";
let modalId = 0;
export default class ConfirmModal extends React.Component {
  constructor() {
    super();
    this.state = {
      id: modalId++
    };
  }
  render() {
    let textBody = this.props.textBody || "";
    let textHeader = this.props.textHeader || "";
    let onClick = this.props.onClick || (() => {
    });
    let modalId2 = "confirm-delete-" + this.state.id;
    return [
      /* @__PURE__ */ React.createElement("span", {
        "data-toggle": "modal",
        "data-target": `#${modalId2}`
      }, this.props.children),
      /* @__PURE__ */ React.createElement("div", {
        className: "modal fade",
        id: modalId2,
        tabIndex: "-1",
        role: "dialog",
        "aria-labelledby": "myModalLabel",
        "aria-hidden": "true"
      }, /* @__PURE__ */ React.createElement("div", {
        className: "modal-dialog"
      }, /* @__PURE__ */ React.createElement("div", {
        className: "modal-content text-left",
        style: {fontSize: "1.1rem"}
      }, textHeader !== "" ? /* @__PURE__ */ React.createElement("div", {
        className: "modal-header"
      }, textHeader) : "", textBody !== "" ? /* @__PURE__ */ React.createElement("div", {
        className: "modal-body"
      }, textBody) : "", /* @__PURE__ */ React.createElement("div", {
        className: "modal-footer"
      }, /* @__PURE__ */ React.createElement("button", {
        type: "button",
        className: "btn btn-default",
        "data-dismiss": "modal"
      }, "Cancel"), /* @__PURE__ */ React.createElement("span", {
        "data-dismiss": "modal",
        onClick
      }, this.props.children)))))
    ];
  }
}
