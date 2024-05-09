import { Fetch } from "./model/bridge.js";
import { showMessage, showOptions, loading } from "./model/MyAlert.js";
import config from "./model/config.js";
// $(() => {

// });
export function AttendanceFunction() {
  loadTables();
  onChangeDate();
}

const loadTables = () => {
  Fetch(config.showAttendance, "GET", (result) => {
    if (result.loading) {
    }
    if (!result.loading) {
      const res = result.data;
      const tbl = $("#timesheetTable").empty();
      $.each(res, (index, data) => {
        tbl.append(
          "<tr>" +
            "<td>" +
            data.EmployeeID +
            "</td>" +
            "<td>" +
            data.name +
            "</td>" +
            "<td>" +
            data.TimeIn +
            "</td>" +
            "<td>" +
            data.TimeOut +
            "</td>" +
            "<td>" +
            wrkhrs(data.WorkHours) +
            "</td>" +
            "<td>" +
            data.Status +
            "</td>" +
            "<td>" +
            data.Date +
            "</td>" +
            "</tr>"
        );
      });
    }
  });
};

function wrkhrs(minutes) {
    if (minutes - 60 <= 0) {
    return "";
  }
  var hours = Math.floor(minutes / 60);
  var minutes = minutes % 60;
  return `${hours}hrs and ${minutes}mins`;
}

setInterval(() => {
  const startDate = $("#startDate").val();
  const endDate = $("#endDate").val();
  if (
    startDate == "" ||
    (startDate == null && endDate == "") ||
    endDate == null
  ) {
    loadTables();
  }
}, 1000);

const onChangeDate = () => {
  $("#endDate").on("change", () => {
    let startDate = $("#startDate").val();
    let endDate = $("#endDate").val();
    if (startDate.length == 0 && endDate.length > 0) {
      showMessage("Oppsss", "Please select start date first!", "info");
      $("#endDate").val("");
      return;
    }
    loadFilteredTable(startDate, endDate);
  });
};

const loadFilteredTable = (date1, date2) => {
  const data = {
    date1: date1,
    date2: date2,
  };
  Fetch(
    config.filteredAttendance,
    "POST",
    (result) => {
      if (result.loading) {
        loading(true);
      }
      if (!result.loading) {
        loading(false);
        const res = result.data;
        const tbl = $("#timesheetTable").empty();
        $.each(res, (index, data) => {
          tbl.append(
            "<tr>" +
              "<td>" +
              data.EmployeeID +
              "</td>" +
              "<td>" +
              data.name +
              "</td>" +
              "<td>" +
              data.TimeIn +
              "</td>" +
              "<td>" +
              data.TimeOut +
              "</td>" +
              "<td>" +
              wrkhrs(data.WorkHours) +
              "</td>" +
              "<td>" +
              data.Status +
              "</td>" +
              "<td>" +
              data.Date +
              "</td>" +
              "</tr>"
          );
        });
      }
    },
    data
  );
};
