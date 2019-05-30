
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
            React.createElement(RecordsHeader, {key: "header"}),
            this.state.records.map((record) => React.createElement(RecordsRow, {key: record.id, record: record, update: () => this.update()}))
        ];
    }
}


class RecordsHeader extends React.Component {
    render() {
        let names = ['Session ID', 'Name', 'Date', 'Question number'];
        return (
            React.createElement("div", {className: "row header"}, 
                names.map(name =>
                    React.createElement("div", {key: name, className: "col-sm"}, name)
                ), 
                React.createElement("div", {className: "col-sm-4"}, "Answer")
            )
        );
    }
}


class RecordsRow extends React.Component {
    render() {
        let record = this.props.record;
        let fields = ['session_id', 'sender_name', 'f_time', 'question_nb'];
        let data = record.f_data;

        if (record.type == 'image')
            data = React.createElement("img", {className: "image", src: `data:;base64,${data}`, style: { 'maxWidth': '100%', 'maxHeight':'100%'}});
        else if (record.type == 'ndarray' && !data.startsWith("\\begin"))
            data = data.split('\n').map((text, key) => React.createElement("span", {key: key}, text, React.createElement("br", null)));

        return (
            React.createElement("div", {key: "fields", className: "row"}, 
                fields.map(field =>
                    React.createElement("div", {key: field, className: "col-sm"}, 
                        React.createElement("p", null, record[field])
                    )
                ), 
                React.createElement("div", {className: "col-sm-4"}, 
                    React.createElement("p", null, data)
                )
            )
        );
    }
}


const domContainer = document.querySelector('#records-list');
ReactDOM.render(React.createElement(RecordsList), domContainer);
MathJax.Hub.Queue(["Typeset", MathJax.Hub]);