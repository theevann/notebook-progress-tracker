import React from "../_snowpack/pkg/react.js";
export default class Button extends React.Component {
  constructor() {
    super();
    this.state = {};
  }
  render() {
    let text = this.props.text || "";
    let title = this.props.title || "";
    let classes = this.props.classes || "";
    let faClass = this.props.faClass || "";
    let faDisplay = this.props.faHideBig ? "d-md-none" : "";
    let btnClass = this.props.btnClass || "primary";
    let onClick = this.props.onClick || (() => {
    });
    return /* @__PURE__ */ React.createElement("button", {
      onClick,
      className: `btn btn-${btnClass} ${classes}`,
      title
    }, /* @__PURE__ */ React.createElement("span", {
      class: "d-none d-md-inline"
    }, text), faClass !== "" ? /* @__PURE__ */ React.createElement("span", {
      style: {lineHeight: 1.5},
      className: `fa fa-${faClass} d-inline ${faDisplay}`
    }) : "");
  }
}
