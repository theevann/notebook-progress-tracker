"use strict";

class RecordsList extends React.Component {
    constructor() {
        super();
        this.state = {
            'records': [],
            'filters': {
                'session_id': '',
                'sender_name': '',
                'f_time': '',
                'question_nb': ''
            }
        };
    }

    componentDidMount() {
      this.update();
    }

    componentDidUpdate(prevProps, prevState) {
        MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
    }

    update() {
        jQuery.get("/get-records", (data) => {
            this.setState({ 'records': data });
        });
    }

    onFilterChange(name, value) {
        let filters = this.state.filters;
        filters[name] = value;
        this.setState({ 'filters': filters });
    }

    clearFilters(name, value) {
        let filters = {
            'session_id': '',
            'sender_name': '',
            'f_time': '',
            'question_nb': ''
        };
        this.setState({ 'filters': filters });
    }

    render() {
        let records = [];
        let filters = this.state.filters;

        this.state.records.forEach(record => {
            try {
                if (!Object.keys(filters).every(key => record[key].toString().match(new RegExp(filters[key], "i")) ))
                    return;
                records.push(<RecordsRow key={record.id} record={record} update={this.update.bind(this)} />);
            } catch (e) {
                records.push(<RecordsRow key={record.id} record={record} update={this.update.bind(this)} />);
            }

        })

        return [
            <RecordsHeader key="header" />,
            <RecordsSearchbar key="searchbar" update={this.update.bind(this)} clearFilters={this.clearFilters.bind(this)} onFilterChange={this.onFilterChange.bind(this)} />,
            records
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
        let fields = [['Session ID', 'session_id'], ['Name', 'sender_name'], ['Date', 'f_time'], ['Question nb', 'question_nb']]
        return (
            <div className="row search row-record">
                {fields.map(([name, field]) =>
                    <div key={name} className='col-sm-2'>
                        <input type="text" name={field} placeholder={name} style={{ 'width': '100%' }} onChange={this.handleFilterTextChange.bind(this)}></input>
                    </div>
                )}
                <div className='col-sm-4'>
                    <button onClick={this.clearFilters.bind(this)} className='btn btn-secondary'>Clear Filters</button>
                    <button onClick={this.props.update} className='btn btn-secondary'>Reload</button>
                </div>
            </div>
        );
    }
}


class RecordsHeader extends React.Component {
    render() {
        let names = ['Session ID', 'Name', 'Date', 'Question number'];
        return (
            <div className="row header row-record">
                {names.map(name =>
                    <div key={name} className='col-sm'>{name}</div>
                )}
                <div className='col-sm-4'>Answer</div>
            </div>
        );
    }
}


class RecordsRow extends React.Component {
    render() {
        let record = this.props.record;
        let fields = ['session_id', 'sender_name', 'f_time', 'question_nb'];
        let data = record.f_data;

        if (record.type == 'image')
            data = <img className="image" src={`data:;base64,${data}`} style={{ 'maxWidth': '100%', 'maxHeight':'100%' }} />;
        else if (record.type == 'ndarray' && !data.startsWith("\\begin"))
            data = data.split('\n').map((text, key) => <span key={key}>{text}<br/></span>);

        return (
            <div key="fields" className="row row-record">
                {fields.map(field =>
                    <div key={field} className='col-sm'>
                        <p>{record[field]}</p>
                    </div>
                )}
                <div className='col-sm-4'>
                    <p>{data}</p>
                </div>
            </div>
        );
    }
}


const domContainer = document.querySelector('#records-list');
ReactDOM.render(React.createElement(RecordsList), domContainer);
MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
