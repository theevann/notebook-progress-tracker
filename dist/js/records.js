"use strict";
import React from "../_snowpack/pkg/react.js";
import ReactDOM from "../_snowpack/pkg/react-dom.js";
import Button from "./Button.js";
import ConfirmModal from "./ConfirmModal.js";
import {BlockMath} from "../_snowpack/pkg/react-katex.js";
const all_fields = [
  ["Name", "d_name", 2],
  ["Date", "d_time", 2],
  ["Question", "question_nb", 2],
  ["Answer", "", 6]
];
class RecordsList extends React.Component {
  constructor() {
    super();
    this.state = {
      session_id: null,
      sessions: [],
      records: [],
      visible_records: [],
      name_visible: true,
      name_to_uuid: new Map(),
      filters: {
        d_name: "",
        d_time: "",
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
      this.setState({session_id: sid}, this.loadRecords);
  }
  componentDidUpdate(prevProps, prevState) {
    Rainbow.color();
  }
  changeSession(sid) {
    localStorage.setItem("sid", sid);
    this.setState({session_id: sid}, this.loadRecords);
  }
  prepareRecordData(data, type) {
    if (type == "image") {
      data = /* @__PURE__ */ React.createElement("img", {
        className: "image",
        src: `data:;base64,${data}`,
        style: {maxWidth: "100%", maxHeight: "100%"}
      });
    } else if (type == "ndarray") {
      data = /* @__PURE__ */ React.createElement(BlockMath, {
        math: data
      });
    } else if (["code", "list", "dict"].includes(type)) {
      if (type === "list")
        data = JSON.stringify(data, null);
      else if (type === "dict")
        data = JSON.stringify(data, null, 1);
      data = /* @__PURE__ */ React.createElement("pre", null, /* @__PURE__ */ React.createElement("code", {
        "data-language": "python"
      }, data));
    } else {
      data = /* @__PURE__ */ React.createElement("p", null, data);
    }
    return data;
  }
  prepareRecords(data, full_reload = true) {
    let records = full_reload ? data : this.state.records;
    let names_to_uuids = full_reload ? new Map() : this.state.names_to_uuids;
    let time_parameters = {timezone: "UTC", year: "numeric", month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit"};
    let time_offset = new Date().getTimezoneOffset() * 6e4;
    data.forEach((record) => {
      let uuids = names_to_uuids.get(record.sender_name);
      if (!uuids)
        names_to_uuids.set(record.sender_name, [record.sender_uuid]);
      else if (!uuids.includes(record.sender_uuid))
        uuids.push(record.sender_uuid);
    });
    if (!full_reload)
      records.forEach((record) => {
        let {sender_name: name, sender_uuid: uuid} = record;
        let uuids = names_to_uuids.get(name);
        record.d_name = uuids.length == 1 ? name : name + `  #${uuids.indexOf(uuid) + 1}`;
      });
    data.forEach((record) => {
      let {sender_name: name, sender_uuid: uuid, f_data: data2, type} = record;
      let uuids = names_to_uuids.get(name);
      record.d_name = uuids.length == 1 ? name : name + `  #${uuids.indexOf(uuid) + 1}`;
      record.d_time = new Date(record.f_time - time_offset).toLocaleString("en-GB", time_parameters);
      record.d_data = this.prepareRecordData(data2, type);
      if (!full_reload) {
        var idx = records.findIndex((r) => r.id == record.id);
        if (!~idx)
          idx = records.length++;
        records[idx] = record;
      }
    });
    this.setState({records, names_to_uuids}, this.updateVisibleRecords);
  }
  loadRecords(full_reload = true) {
    if (this.state.session_id === null)
      return;
    var since = full_reload ? 0 : this.state.records.reduce((p, c) => Math.max(p, c.f_time), 0);
    jQuery.get(`/get-records?sid=${this.state.session_id}&since=${since}`, (data) => this.prepareRecords(data, full_reload));
  }
  updateRecords() {
    this.loadRecords(false);
  }
  clearFilters() {
    let filters = this.state.filters;
    Object.keys(filters).forEach((key) => filters[key] = "");
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
      visible_records = [...this.state.records];
    }
    this.setState({visible_records});
  }
  deleteRecords() {
    $.ajax({
      type: "DELETE",
      url: "/del-records",
      data: {record_ids: this.state.visible_records.map((r) => r.id)},
      success: this.loadRecords.bind(this)
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
        loadRecords: this.loadRecords.bind(this),
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
    let is_sharing = this.props.session?.sharing;
    return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", {
      className: "row search row-record"
    }, all_fields.slice(0, -1).map(([name, field, sz]) => /* @__PURE__ */ React.createElement("div", {
      key: name,
      className: `col-sm-${sz} col-record`
    }, /* @__PURE__ */ React.createElement("input", {
      className: "w-100 form-control",
      type: "text",
      name: field,
      placeholder: name,
      onChange: this.handleFilterTextChange.bind(this)
    }))), /* @__PURE__ */ React.createElement("div", {
      className: `col-sm-${all_fields[3][2]} col-record`
    }, /* @__PURE__ */ React.createElement("button", {
      onClick: this.clearFilters.bind(this),
      className: "btn btn-secondary"
    }, "Clear Filters"), /* @__PURE__ */ React.createElement("button", {
      onClick: this.props.loadRecords,
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
    return /* @__PURE__ */ React.createElement("div", {
      className: "row header row-record"
    }, /* @__PURE__ */ React.createElement("div", {
      className: `col-sm-${all_fields[0][2]} col-record`
    }, "Name  ", /* @__PURE__ */ React.createElement("i", {
      onClick: this.props.toggleName,
      className: "fa fa-eye" + (this.props.name_visible ? "" : "-slash"),
      style: {fontSize: "15px"}
    })), all_fields.slice(1).map(([name, _, sz]) => /* @__PURE__ */ React.createElement("div", {
      key: name,
      className: `col-sm-${sz} col-record`
    }, name)));
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
    let {d_name, d_time, d_data, question_nb, type} = this.props.record;
    let id = 0;
    return /* @__PURE__ */ React.createElement("div", {
      className: "row row-record"
    }, /* @__PURE__ */ React.createElement("div", {
      className: `col-sm-${all_fields[id++][2]} col-record`,
      style: {whiteSpace: "pre-wrap"}
    }, this.props.name_visible ? d_name : ""), /* @__PURE__ */ React.createElement("div", {
      className: `col-sm-${all_fields[id++][2]} col-record`
    }, /* @__PURE__ */ React.createElement("p", null, d_time)), /* @__PURE__ */ React.createElement("div", {
      className: `col-sm-${all_fields[id++][2]} col-record`
    }, /* @__PURE__ */ React.createElement("p", null, question_nb)), /* @__PURE__ */ React.createElement("div", {
      className: `col-sm-${all_fields[id++][2]} col-record`,
      style: type != "image" ? {overflow: "auto"} : {}
    }, d_data));
  }
}
const domContainer = document.querySelector("#records-list");
window.record_list = ReactDOM.render(React.createElement(RecordsList), domContainer);
document.onfocus = () => record_list.updateRecords();
setInterval(() => {
  if (document.hasFocus())
    record_list.updateRecords();
}, 3e4);
