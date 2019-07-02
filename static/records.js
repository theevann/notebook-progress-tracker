
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
        // jQuery("code.rerender").removeClass('rainbow rerender');
        Rainbow.color();
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
            } finally {}

            records.push(React.createElement(RecordsRow, {key: `${record.id}-${record.f_time}`, record: record, update: this.update.bind(this)}));
        })

        return [
            React.createElement(RecordsHeader, {key: "header"}),
            React.createElement(RecordsSearchbar, {key: "searchbar", update: this.update.bind(this), clearFilters: this.clearFilters.bind(this), onFilterChange: this.onFilterChange.bind(this)}),
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
            React.createElement("div", {className: "row search row-record"}, 
                fields.map(([name, field]) =>
                    React.createElement("div", {key: name, className: "col-sm-2"}, 
                        React.createElement("input", {type: "text", name: field, placeholder: name, style: { 'width': '100%'}, onChange: this.handleFilterTextChange.bind(this)})
                    )
                ), 
                React.createElement("div", {className: "col-sm-4"}, 
                    React.createElement("button", {onClick: this.clearFilters.bind(this), className: "btn btn-secondary"}, "Clear Filters"), 
                    React.createElement("button", {onClick: this.props.update, className: "btn btn-secondary"}, "Reload")
                )
            )
        );
    }
}


class RecordsHeader extends React.Component {
    render() {
        let names = ['Session ID', 'Name', 'Date', 'Question number'];
        return (
            React.createElement("div", {className: "row header row-record"}, 
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

        if (record.type == 'image') {
            data = React.createElement("img", {className: "image", src: `data:;base64,${data}`, style: { 'maxWidth': '100%', 'maxHeight':'100%'}});
        } else if (record.type == 'ndarray' && !data.startsWith("\\begin")) {
            data = data.split('\n').map((text, key) => React.createElement("span", {key: key}, text, React.createElement("br", null)));
        } else if (record.type == 'function') {
            data = React.createElement("pre", null, React.createElement("code", {className: "", "data-language": "python"}, data))
        } else {
            data = React.createElement("p", null, data)
        }

        return (
            React.createElement("div", {className: "row row-record"}, 
                fields.map(field =>
                    React.createElement("div", {key: field, className: "col-sm"}, 
                        React.createElement("p", null, record[field])
                    )
                ), 
                React.createElement("div", {className: "col-sm-4"}, 
                    data
                )
            )
        );
    }
}


const domContainer = document.querySelector('#records-list');
ReactDOM.render(React.createElement(RecordsList), domContainer);
MathJax.Hub.Queue(["Typeset", MathJax.Hub]);