import React from 'react';

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
        let onClick = this.props.onClick || (() => {});

        return <button onClick={onClick} className={`btn btn-${btnClass} ${classes}`} title={title}>
            <span class="d-none d-md-inline">{text}</span>
            {faClass !== "" ? <span style={{lineHeight: 1.5}} className={`fa fa-${faClass} d-inline ${faDisplay}`}></span> : ""}
        </button>
    }
}
