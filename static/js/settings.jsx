import React from 'react';
import ReactDOM from 'react-dom';
import Button from "./Button.jsx";
import ConfirmModal from "./ConfirmModal.jsx";


class DeleteButton extends React.Component {
    deleteShare() {
        jQuery.get(`/delete-account`);
    }

    render() {
        return <div class="text-center">
            <div class="col">
                <div class="mb-5">
                    <ConfirmModal onClick={this.deleteShare} textHeader="Account deletion" textBody="Are you sure that you want to delete your account ? This cannot be undone." >
                        <Button btnClass="danger" text="Delete" classes="px-5" title="Delete your account" faHideBig={false} />
                    </ConfirmModal>
                </div>
            </div>
        </div>
    }
}


const deleteButtonContainer = document.querySelector('#delete-button-container');
ReactDOM.render(React.createElement(DeleteButton), deleteButtonContainer);