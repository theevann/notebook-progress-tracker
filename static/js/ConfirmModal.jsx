import React from 'react';

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
        let onClick = this.props.onClick || (() => {});

        let modalId = "confirm-delete-" + this.state.id;

        return [
        <span data-toggle="modal" data-target={`#${modalId}`}>
            {this.props.children}
        </span>,
        <div className="modal fade" id={modalId} tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content text-left" style={{"fontSize": "1.1rem"}}>
                    {textHeader !== "" ? <div className="modal-header">{textHeader}</div> : ""}
                    {textBody !== "" ? <div className="modal-body">{textBody}</div> : ""}
                    <div className="modal-footer">
                        <button type="button" className="btn btn-default" data-dismiss="modal">Cancel</button>
                        <span data-dismiss="modal" onClick={onClick}>
                            {this.props.children}
                        </span>
                    </div>
                </div>
            </div>
        </div>
        ]
    }
}
