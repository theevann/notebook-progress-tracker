import Button from "./Button.js"
import ConfirmModal from "./ConfirmModal.js";


class Sharing extends React.Component {
    constructor() {
        super();
        this.state = {
            session: null,
            session_id: window.location.pathname.split('/').slice(-1)[0]
        };
    }

    componentDidMount() {
        this.update();
    }

    update() {
        jQuery.get("/get-session?id=" + this.state.session_id, (data) => {
            this.setState({ session: data });
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
        let users = this.state.session && this.state.session['f_shared_users'] || [];

        return <div>
            <div className="row mt-3">
                <div className="col-6 col-lg-3">
                    <h3>Sharing <span className="fa fa-users"></span></h3>
                </div>
            </div>
            {users.map(user => {
                return <div className="row my-1">
                    <div className="col-4 col-lg-2 text-center">{user}</div>
                    <div className="col-2 col-lg-1">
                        <ConfirmModal onClick={() => this.deleteShare(user)} textBody="Are you sure to cancel this share ?" >
                            <Button faClass="trash" btnClass="danger" classes="w-100" title="Cancel share with this user" />
                        </ConfirmModal>
                    </div>
                </div>
            })}
            <div className="row">
                <div className="col-4 col-lg-2">
                    <input id='username-input' className="form-control w-100" type="text" />
                </div>
                <div className="col-2 col-lg-1">
                    <Button faClass="user-plus" btnClass="primary" classes="w-100" title="Share current session with this user" onClick={() => this.createShare()}/>
                </div>
            </div>
        </div>
    }
}


const sharingContainer = document.querySelector('#sharing');
let sharing = ReactDOM.render(React.createElement(Sharing), sharingContainer);







class SessionParts extends React.Component {
    constructor() {
        super();
        this.state = { 'parts': [] };
    }

    componentDidMount() {
      this.update();
    }

    componentDidUpdate(prevProps, prevState) {
        $('#session-parts').sortable();
    }

    update() {
        var session_id = window.location.pathname.split('/').slice(-1)[0]
        jQuery.get("/get-session?id=" + session_id, (data) => {
            this.setState({ 'parts': data['parts'] });
        });
    }

    render() {
        let parts = this.state['parts'];
        return parts.map(part => {
            return <div className="row row-sessm">
                <div className="col-sm-1 col-sessm">{part.number}</div>
                <div className="col-sm-2 col-sessm">{part.name}</div>
            </div>
        });
    }
}


// const domContainer = document.querySelector('#session-parts');
// let session_list = ReactDOM.render(React.createElement(SessionParts), domContainer);

let session_id = window.location.pathname.split('/').slice(-1)[0];



/* Toggle session state */

$('#toggle-session').change(function () {
    $.get("/toggle-session?id=" + session_id);
});



/* Save name and description on change */

let nameInput = document.getElementById('name-input');
let descInput = document.getElementById('desc-input');
let timeout = null;

descInput.onkeyup = nameInput.onkeyup = function (e) {
    clearTimeout(timeout);
    timeout = setTimeout(postChanges, 500);
};

window.onbeforeunload = function () {
    if (timeout !== null)
        postChanges();
}

function postChanges() {
    $.ajax({
        type: 'POST',
        url: "/update-session",
        data: {
            id: session_id,
            name: nameInput.value,
            description: descInput.value
        },
        async: false
    });
}
