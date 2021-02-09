"use strict";

import React from 'react';
import ReactDOM from 'react-dom';
import Button from "./Button.jsx";
import ConfirmModal from "./ConfirmModal.jsx";


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

    getSession(session_id) {
        let session = session_id && this.state.sessions.find(s => s.id == session_id);
        return session;
    }

    componentDidMount() {
        jQuery.get("/get-sessions", (data) => {
            this.setState({ 'sessions': data });
        });

        let sid = localStorage.getItem("sid");
        if (sid !== null)
            this.setState({ "session_id" : sid}, this.loadData);
    }

    componentDidUpdate(prevProps, prevState) {
        MathJax?.Hub.Queue(["Typeset", MathJax.Hub]);
        Rainbow.color();
    }

    changeSession(sid) {
        localStorage.setItem("sid", sid);
        this.setState({ "session_id": sid }, this.loadData);
    }

    loadData() {
        // This loadData function is needed for the delete
        jQuery.get(`/get-records?sid=${this.state.session_id}`, (data) => {
            this.setState({ 'records': data }, this.updateVisibleRecords);
        });
    }

    updateData() {
        // The since allows to avoid transfering all infos already transfered
        var since = this.state.records.reduce((p, c) => Math.max(p, c.f_time), 0);
        jQuery.get(`/get-records?sid=${this.state.session_id}&since=${since}`, (data) => {
            var records = this.state.records;
            // records = Array.from(new Map([...records.map(d => [d.id, d]), ...data.map(d => [d.id, d])]).values());
            data.forEach(new_rec => {
                var idx = records.findIndex(r => r.id == new_rec.id);
                if (!~idx) idx = records.length++;
                records[idx] = new_rec;
            });
            this.setState({ 'records': records }, this.updateVisibleRecords);
        });        
    }

    clearFilters(name, value) {
        let filters = {
            'sender_name': '',
            'f_time': '',
            'question_nb': ''
        };
        this.setState({ 'filters': filters }, this.updateVisibleRecords);
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
            visible_records = this.state.records.filter(record => {
                return (Object.keys(filters).every(key => {
                    if (key == "question_nb" && filters[key].toString() != "")
                        return record[key].toString() === filters[key];
                    return record[key].toString().match(new RegExp(filters[key], "i"));
                }));
            });
        } catch(e) {
            visible_records = this.state.records;
        }

        this.setState({ 'visible_records': visible_records });
    }

    deleteRecords() {
        $.ajax({
            type: 'DELETE',
            url: "/del-records",
            data: { record_ids: this.state.visible_records.map(r => r.id) },
            success: this.loadData.bind(this)
        });
    }

    toggleName() {
        this.setState({
            name_visible: !this.state.name_visible
        });
    }

    render() {
        let records = this.state.visible_records.map(record => {
            return <RecordsRow key={`${record.id}-${record.f_time}`} record={record} name_visible={this.state.name_visible} />;
        })

        let session_id = this.state.session_id;
        let session = this.getSession(session_id);
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
            <RecordsSearchbar key="searchbar" session={session} loadData={this.loadData.bind(this)} delete={this.deleteRecords.bind(this)} clearFilters={this.clearFilters.bind(this)} onFilterChange={this.onFilterChange.bind(this)} />,
            <div className="row" style={{ overflowY: "auto" }}>
            {/* <div className="row"> */}
                <div className="col">
                    {records}
                </div>
            </div>,
            <RecordsInfo visible_records={this.state.visible_records.length} records={this.state.records.length} />
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
        let is_sharing = this.props.session?.sharing;
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
                        <button onClick={this.props.loadData} className='btn btn-secondary'>Reload</button>
                        {
                        is_sharing ?
                        "" :
                        <ConfirmModal onClick={this.props.delete} textBody="Do you want to delete the currently filtered records ?" >
                                    <Button btnClass="danger" text="Delete" title="Delete visible records" faClass="trash" faHideBig={true} />
                        </ConfirmModal>
                        }
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



class RecordsInfo extends React.Component {
    render() {
        return (
            <div className="row footer row-record">
                <div className="col-sm-2">
                    {/* {this.props.records} records - {this.props.visible_records} visible */}
                    {this.props.visible_records} / {this.props.records} records 
                </div>
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
        } else if (record.type == 'ndarray') {
            data = "$$ " + data + " $$";
        } else if (record.type == 'ndarray' && !data.startsWith("\\begin")) {
            data = data.split('\n').map((text, key) => <span key={key}>{text}<br/></span>); //TODO
        } else if (['code', 'list'].includes(record.type)) {
            if (record.type === 'list') data = JSON.stringify(data, null);
            data = <pre><code data-language="python">{data}</code></pre>;
        } else {
            data = <p>{data}</p>;
        }

        return (
            <div className="row row-record">
                <div className='col-sm col-record'>
                    {this.props.name_visible ? record["sender_name"] : ""}
                </div>
                <div className='col-sm col-record'>
                    <p>{(new Date(record.f_time - new Date().getTimezoneOffset() * 60000)).toLocaleString("en-GB",
                    { timezone: "UTC", year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                </div>
                <div className='col-sm col-record'>
                    <p>{record.question_nb}</p>
                </div>
                <div className="col-sm-5 col-record" style={record.type != "image" ? {overflow: "auto"} : {}}>
                    {data}
                </div>
            </div>
        );
    }
}

const domContainer = document.querySelector('#records-list');
let record_list = ReactDOM.render(React.createElement(RecordsList), domContainer);
MathJax.Hub.Queue(["Typeset", MathJax.Hub]);

document.onfocus = () => record_list.updateData();
setInterval(() => {
    if (document.hasFocus())
        record_list.updateData();
}, 30000);