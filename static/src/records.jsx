"use strict";

class RecordsList extends React.Component {
    constructor() {
        super();
        this.state = {
            'session_id': null,
            'sessions': [],
            'records': [],
            'visible_records': [],
            'name_visible': true,
            'filters': {
                'sender_name': '',
                'f_time': '',
                'question_nb': ''
            }
        };
    }

    componentDidMount() {
        jQuery.get("/get-sessions", (data) => {
            this.setState({ 'sessions': data });
        });

        let sid = localStorage.getItem("sid");
        if (sid !== null)
            this.setState({ "session_id" : sid}, this.update);
    }

    componentDidUpdate(prevProps, prevState) {
        MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
        Rainbow.color();
    }

    changeSession(sid) {
        localStorage.setItem("sid", sid);
        this.setState({ "session_id": sid }, this.update);
    }

    update() {
        console.log("Update");
        jQuery.get("/get-records?sid=" + this.state.session_id, (data) => {
            this.setState({ 'records': data }, this.updateVisibleRecords);
        });
    }

    onFilterChange(name, value) {
        let filters = this.state.filters;
        filters[name] = value;
        this.setState({ 'filters': filters }, this.updateVisibleRecords);
    }

    updateVisibleRecords() {
        let filters = this.state.filters;
        let visible_records = [];

        try {
            this.state.records.forEach(record => {
                if (!Object.keys(filters).every(key => {
                    if (key == "question_nb" && filters[key].toString() != "")
                        return record[key].toString() === filters[key];
                    return record[key].toString().match(new RegExp(filters[key], "i"));
                }))
                return;
                
                visible_records.push(record);
            })
        } catch(e) {
            visible_records = this.state.records;
        }

        this.setState({ 'visible_records': visible_records });
    }

    clearFilters(name, value) {
        let filters = {
            'sender_name': '',
            'f_time': '',
            'question_nb': ''
        };
        this.setState({ 'filters': filters }, this.updateVisibleRecords);
    }

    deleteRecords() {
        $.ajax({
            type: 'DELETE',
            url: "/del-records",
            data: { record_ids: this.state.visible_records.map(r => r.id) },
            success: this.update.bind(this)
        });
    }

    toggleName() {
        this.setState({
            name_visible: !this.state.name_visible
        });
    }

    render() {
        let records = this.state.visible_records.map(record => {
            return <RecordsRow key={`${record.id}-${record.f_time}`} record={record} update={this.update.bind(this)} name_visible={this.state.name_visible} />;
        })

        let session_id = this.state.session_id;
        let session = session_id && this.state.sessions.find(s => s.id == session_id);
        let session_name = session && `[${session_id}] ${session.name}` || "Choose a session";

        return [
            <div key="session_dropdown" className="row dropdown mb-2" style={{display: "block", textAlign: "center"}}>
                <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    {session_name}
                </button>
                <div>
                    <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    {this.state.sessions.map(({ id, name }) => 
                        <a key={id} className="dropdown-item" href="#" onClick={() => this.changeSession(id)}>[{ id }] { name }</a>
                    )}
                    </div>
                </div>
            </div>,
            <RecordsHeader key="header" toggleName={this.toggleName.bind(this)} name_visible={this.state.name_visible} />,
            <RecordsSearchbar key="searchbar" update={this.update.bind(this)} delete={this.deleteRecords.bind(this)} clearFilters={this.clearFilters.bind(this)} onFilterChange={this.onFilterChange.bind(this)} />,
            <div className="row" style={{ overflowY: "auto" }}>
            {/* <div className="row"> */}
                <div className="col">
                    {records}
                </div>
            </div>
        ];
    }
}


class RecordsSearchbar extends React.Component {
    constructor() {
        super();
        this.state = { };
    }

    handleFilterTextChange(e) {
        this.props.onFilterChange(e.target.name, e.target.value);
    }

    clearFilters() {
        document.querySelectorAll(".search input").forEach(input => input.value='');
        this.props.clearFilters();
    }


    render() {
        let fields = [['Name', 'sender_name'], ['Date', 'f_time'], ['Question nb', 'question_nb']];
        return (
            <div>
                <div className="row search row-record">
                    {fields.map(([name, field]) =>
                        <div key={name} className='col-sm col-record'>
                            <input type="text" name={field} placeholder={name} style={{ 'width': '100%' }} onChange={this.handleFilterTextChange.bind(this)}></input>
                        </div>
                    )}
                    <div className='col-sm-5 col-record'>
                        <button onClick={this.clearFilters.bind(this)} className='btn btn-secondary'>Clear Filters</button>
                        <button onClick={this.props.update} className='btn btn-secondary'>Reload</button>
                        <button className='btn btn-danger' data-toggle="modal" data-target="#confirm-delete">Delete</button>
                    </div>
                </div>

                <div className="modal fade" id="confirm-delete" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            {/* <div className="modal-header">
                                        Confirm
                            </div> */}
                            <div className="modal-body">
                                Do you want to delete the currently filtered records ?
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-default" data-dismiss="modal">Cancel</button>
                                <button onClick={this.props.delete} type="button" className="btn btn-danger btn-ok" data-dismiss="modal">Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


class RecordsHeader extends React.Component {
    render() {
        let names = ['Date', 'Question number'];
        return (
            <div className="row header row-record">
                <div className='col-sm col-record'>Name  <i onClick={this.props.toggleName} className={"fa fa-eye" + (this.props.name_visible ? "" : "-slash")} style={{ "fontSize": "15px",  }}></i></div>
                {names.map(name =>
                    <div key={name} className='col-sm col-record'>{name}</div>
                )}
                <div className='col-sm-5 col-record'>Answer</div>
            </div>
        );
    }
}


class RecordsRow extends React.Component {
    render() {
        let record = this.props.record;
        let fields = ['f_time', 'question_nb'];
        let data = record.f_data;

        if (record.type == 'image') {
            data = <img className="image" src={`data:;base64,${data}`} style={{ 'maxWidth': '100%', 'maxHeight':'100%' }} />;
        } else if (record.type == 'ndarray' && !data.startsWith("\\begin")) {
            data = data.split('\n').map((text, key) => <span key={key}>{text}<br/></span>);
        } else if (record.type == 'function') {
            data = <pre><code className="" data-language="python">{data}</code></pre>
        } else {
            data = <p>{data}</p>
        }

        return (
            <div className="row row-record">
                <div className='col-sm col-record'>
                    {this.props.name_visible ? record["sender_name"] : ""}
                </div>
                {fields.map(field =>
                    <div key={field} className='col-sm col-record'>
                        <p>{record[field]}</p>
                    </div>
                )}
                <div className='col-sm-5 col-record'>
                    {data}
                </div>
            </div>
        );
    }
}

const domContainer = document.querySelector('#records-list');
let record_list = ReactDOM.render(React.createElement(RecordsList), domContainer);
MathJax.Hub.Queue(["Typeset", MathJax.Hub]);

document.onfocus = () => record_list.update();
setInterval(() => {
    if (document.hasFocus())
        record_list.update();
}, 30000);
