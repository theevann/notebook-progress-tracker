"use strict";
import React from "../_snowpack/pkg/react.js";
import ReactDOM from "../_snowpack/pkg/react-dom.js";
import Button from "./Button.js";
import ConfirmModal from "./ConfirmModal.js";
class RecordsList extends React.Component {
  constructor() {
    super();
    this.state = {
      session_id: null,
      sessions: [],
      records: [],
      visible_records: [],
      name_visible: true,
      filters: {
        sender_name: "",
        f_time: "",
        question_nb: ""
      }
    };
  }
  getSession(session_id) {
    let session = session_id && this.state.sessions.find((s) => s.id == session_id);
    return session;
  }
  componentDidMount() {
    jQuery.get("/get-sessions", (data) => {
      this.setState({sessions: data});
    });
    let sid = localStorage.getItem("sid");
    if (sid !== null)
      this.setState({session_id: sid}, this.loadData);
  }
  componentDidUpdate(prevProps, prevState) {
    MathJax?.Hub.Queue(["Typeset", MathJax.Hub]);
    Rainbow.color();
  }
  changeSession(sid) {
    localStorage.setItem("sid", sid);
    this.setState({session_id: sid}, this.loadData);
  }
  loadData() {
    jQuery.get(`/get-records?sid=${this.state.session_id}`, (data) => {
      this.setState({records: data}, this.updateVisibleRecords);
    });
  }
  updateData() {
    var since = this.state.records.reduce((p, c) => Math.max(p, c.f_time), 0);
    jQuery.get(`/get-records?sid=${this.state.session_id}&since=${since}`, (data) => {
      var records = this.state.records;
      data.forEach((new_rec) => {
        var idx = records.findIndex((r) => r.id == new_rec.id);
        if (!~idx)
          idx = records.length++;
        records[idx] = new_rec;
      });
      this.setState({records}, this.updateVisibleRecords);
    });
  }
  clearFilters(name, value) {
    let filters = {
      sender_name: "",
      f_time: "",
      question_nb: ""
    };
    this.setState({filters}, this.updateVisibleRecords);
  }
  onFilterChange(name, value) {
    let filters = this.state.filters;
    filters[name] = value;
    this.setState({filters}, this.updateVisibleRecords);
  }
  updateVisibleRecords() {
    let filters = this.state.filters;
    let visible_records = [];
    try {
      visible_records = this.state.records.filter((record) => {
        return Object.keys(filters).every((key) => {
          if (key == "question_nb" && filters[key].toString() != "")
            return record[key].toString() === filters[key];
          return record[key].toString().match(new RegExp(filters[key], "i"));
        });
      });
    } catch (e) {
      visible_records = this.state.records;
    }
    this.setState({visible_records});
  }
  deleteRecords() {
    $.ajax({
      type: "DELETE",
      url: "/del-records",
      data: {record_ids: this.state.visible_records.map((r) => r.id)},
      success: this.loadData.bind(this)
    });
  }
  toggleName() {
    this.setState({
      name_visible: !this.state.name_visible
    });
  }
  render() {
    let records = this.state.visible_records.map((record) => {
      return /* @__PURE__ */ React.createElement(RecordsRow, {
        key: `${record.id}-${record.f_time}`,
        record,
        name_visible: this.state.name_visible
      });
    });
    let session_id = this.state.session_id;
    let session = this.getSession(session_id);
    let session_name = session && `[${session_id}] ${session.name}` || "Choose a session";
    return [
      /* @__PURE__ */ React.createElement("div", {
        key: "session_dropdown",
        className: "row dropdown mb-2",
        style: {display: "block", textAlign: "center"}
      }, /* @__PURE__ */ React.createElement("button", {
        className: "btn btn-secondary dropdown-toggle",
        type: "button",
        id: "dropdownMenuButton",
        "data-toggle": "dropdown",
        "aria-haspopup": "true",
        "aria-expanded": "false"
      }, session_name), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", {
        className: "dropdown-menu",
        "aria-labelledby": "dropdownMenuButton"
      }, this.state.sessions.map(({id, name}) => /* @__PURE__ */ React.createElement("a", {
        key: id,
        className: "dropdown-item",
        href: "#",
        onClick: () => this.changeSession(id)
      }, "[", id, "] ", name))))),
      /* @__PURE__ */ React.createElement(RecordsHeader, {
        key: "header",
        toggleName: this.toggleName.bind(this),
        name_visible: this.state.name_visible
      }),
      /* @__PURE__ */ React.createElement(RecordsSearchbar, {
        key: "searchbar",
        session,
        loadData: this.loadData.bind(this),
        delete: this.deleteRecords.bind(this),
        clearFilters: this.clearFilters.bind(this),
        onFilterChange: this.onFilterChange.bind(this)
      }),
      /* @__PURE__ */ React.createElement("div", {
        className: "row",
        style: {overflowY: "auto"}
      }, /* @__PURE__ */ React.createElement("div", {
        className: "col"
      }, records)),
      /* @__PURE__ */ React.createElement(RecordsInfo, {
        visible_records: this.state.visible_records.length,
        records: this.state.records.length
      })
    ];
  }
}
class RecordsSearchbar extends React.Component {
  constructor() {
    super();
    this.state = {};
  }
  handleFilterTextChange(e) {
    this.props.onFilterChange(e.target.name, e.target.value);
  }
  clearFilters() {
    document.querySelectorAll(".search input").forEach((input) => input.value = "");
    this.props.clearFilters();
  }
  render() {
    let fields = [["Name", "sender_name"], ["Date", "f_time"], ["Question nb", "question_nb"]];
    let is_sharing = this.props.session?.sharing;
    return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", {
      className: "row search row-record"
    }, fields.map(([name, field]) => /* @__PURE__ */ React.createElement("div", {
      key: name,
      className: "col-sm col-record"
    }, /* @__PURE__ */ React.createElement("input", {
      type: "text",
      name: field,
      placeholder: name,
      style: {width: "100%"},
      onChange: this.handleFilterTextChange.bind(this)
    }))), /* @__PURE__ */ React.createElement("div", {
      className: "col-sm-5 col-record"
    }, /* @__PURE__ */ React.createElement("button", {
      onClick: this.clearFilters.bind(this),
      className: "btn btn-secondary"
    }, "Clear Filters"), /* @__PURE__ */ React.createElement("button", {
      onClick: this.props.loadData,
      className: "btn btn-secondary"
    }, "Reload"), is_sharing ? "" : /* @__PURE__ */ React.createElement(ConfirmModal, {
      onClick: this.props.delete,
      textBody: "Do you want to delete the currently filtered records ?"
    }, /* @__PURE__ */ React.createElement(Button, {
      btnClass: "danger",
      text: "Delete",
      title: "Delete visible records",
      faClass: "trash",
      faHideBig: true
    })))));
  }
}
class RecordsHeader extends React.Component {
  render() {
    let names = ["Date", "Question number"];
    return /* @__PURE__ */ React.createElement("div", {
      className: "row header row-record"
    }, /* @__PURE__ */ React.createElement("div", {
      className: "col-sm col-record"
    }, "Name  ", /* @__PURE__ */ React.createElement("i", {
      onClick: this.props.toggleName,
      className: "fa fa-eye" + (this.props.name_visible ? "" : "-slash"),
      style: {fontSize: "15px"}
    })), names.map((name) => /* @__PURE__ */ React.createElement("div", {
      key: name,
      className: "col-sm col-record"
    }, name)), /* @__PURE__ */ React.createElement("div", {
      className: "col-sm-5 col-record"
    }, "Answer"));
  }
}
class RecordsInfo extends React.Component {
  render() {
    return /* @__PURE__ */ React.createElement("div", {
      className: "row footer row-record"
    }, /* @__PURE__ */ React.createElement("div", {
      className: "col-sm-2"
    }, this.props.visible_records, " / ", this.props.records, " records"));
  }
}
class RecordsRow extends React.Component {
  render() {
    let record = this.props.record;
    let fields = ["f_time", "question_nb"];
    let data = record.f_data;
    if (record.type == "image") {
      data = /* @__PURE__ */ React.createElement("img", {
        className: "image",
        src: `data:;base64,${data}`,
        style: {maxWidth: "100%", maxHeight: "100%"}
      });
    } else if (record.type == "ndarray") {
      data = "$$ " + data + " $$";
    } else if (record.type == "ndarray" && !data.startsWith("\\begin")) {
      data = data.split("\n").map((text, key) => /* @__PURE__ */ React.createElement("span", {
        key
      }, text, /* @__PURE__ */ React.createElement("br", null)));
    } else if (["code", "list"].includes(record.type)) {
      if (record.type === "list")
        data = JSON.stringify(data, null);
      data = /* @__PURE__ */ React.createElement("pre", null, /* @__PURE__ */ React.createElement("code", {
        "data-language": "python"
      }, data));
    } else {
      data = /* @__PURE__ */ React.createElement("p", null, data);
    }
    return /* @__PURE__ */ React.createElement("div", {
      className: "row row-record"
    }, /* @__PURE__ */ React.createElement("div", {
      className: "col-sm col-record"
    }, this.props.name_visible ? record["sender_name"] : ""), /* @__PURE__ */ React.createElement("div", {
      className: "col-sm col-record"
    }, /* @__PURE__ */ React.createElement("p", null, new Date(record.f_time - new Date().getTimezoneOffset() * 6e4).toLocaleString("en-GB", {timezone: "UTC", year: "numeric", month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit"}))), /* @__PURE__ */ React.createElement("div", {
      className: "col-sm col-record"
    }, /* @__PURE__ */ React.createElement("p", null, record.question_nb)), /* @__PURE__ */ React.createElement("div", {
      className: "col-sm-5 col-record",
      style: record.type != "image" ? {overflow: "auto"} : {}
    }, data));
  }
}
const domContainer = document.querySelector("#records-list");
let record_list = ReactDOM.render(React.createElement(RecordsList), domContainer);
MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
document.onfocus = () => record_list.updateData();
setInterval(() => {
  if (document.hasFocus())
    record_list.updateData();
}, 3e4);
