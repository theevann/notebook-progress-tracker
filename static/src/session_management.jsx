
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
            return <div class="row row-sessm">
                <div class="col-sm-1 col-sessm">{part.number}</div>
                <div class="col-sm-2 col-sessm">{part.name}</div>
            </div>
        });
    }
}


const domContainer = document.querySelector('#session-parts');
let session_list = ReactDOM.render(React.createElement(SessionParts), domContainer);

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
    timeout = setTimeout(
        () => $.post("/update-session", { id: session_id, name: nameInput.value, description: descInput.value }, (d) => console.log(d)),
        500);
};