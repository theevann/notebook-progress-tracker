"use strict";

class RecordsList extends React.Component {
    constructor() {
        super();
        this.state = { 'records': [] };
    }

    componentDidMount() {
      this.update();
    }

    update() {
        jQuery.get("/get-records", (data) => {
            console.log(data);
            this.setState({ 'records': data });
        });
    }

    render() {
        return [
            <RecordsHeader key="header" />,
            this.state.records.map((record) => <RecordsRow key={record.id} record={record} update={() => this.update()} />)
        ];
    }
}


class RecordsHeader extends React.Component {
    render() {
        let names = ['Session ID', 'Name', 'Date', 'Question number'];
        return (
            <div className="row header">
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
            <div key="fields" className="row">
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
