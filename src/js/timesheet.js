import { Fetch } from "./model/bridge.js";
import { showMessage, showOptions, loading } from "./model/MyAlert.js";
import config from "./model/config.js";

export async function TimesheetFunction() {
  loadEmployee();
}
const loadEmployee = () => {
  const table = $("#timesheet-table").empty();
  Fetch(config.timesheetEmployee, "GET", (result) => {
    if (result.loading) {
      loading(true);
    }
    if (!result.loading) {
      loading(false);
      const data = result.data;
      $.each(data, (index, data) => {
        table.append(
          "<details data-id='" +
            data.EmployeeID +
            "' class='myindex'>" +
            "<summary>" +
            "<div class='parent'>" +
            "<div class='child-parent'>" +
            "<div class='left'>" +
            data.name +
            "</div>" +
            "<div class='right'>" +
            `${data.Rate} | ${data.Schedule}` +
            "</div>" +
            "</div>" +
            "</div>" +
            "</summary>" +
            "<div class='other-details'>" +
            "</div>" +
            "</details>"
        );
      });
    }

    $(".myindex").on("click", function () {
      const id = $(this).data("id");
      if (!$(this).prop("open")) {
        let date1 = $("#timesheetstartDate").val();
        let date2 = $("#timesheetendDate").val();
        if (date1.length == 0 || date2.length == 0) {
          showMessage("Oopss", "Please select date first", "info");
          $(this).prop("open", true);
          return;
        }
      }
      if (!$(this).prop("open")) {
        const data = {
          uid: id,
          date1: $("#timesheetstartDate").val(),
          date2: $("#timesheetendDate").val(),
        };
        const content = $(this).find(".other-details");
        Fetch(
          config.timesheetDetails,
          "POST",
          (result) => {
            if (result.loading) {
              loading(true);
            }
            if (!result.loading) {
              loading(false);
              const raw = result.data;
              loadDetails(
                content,
                raw.leave,
                raw.overtime,
                raw.wrkdays,
                raw.wrkhrs,
                raw.table,
                raw.overtimeHrs
              );
            }
          },
          data
        );
      }
    });
  });
};
function wrkhrs(minutes) {
  var hours = Math.floor(minutes / 60);
  var minutes = minutes % 60;
  return `${hours} hrs and ${minutes} mins`;
}
function getDay(udate) {
  const date = new Date(udate);
  const options = { weekday: "long" };
  const dayName = date.toLocaleDateString("en-US", options);
  return dayName;
}
function dayType(date) {
  return fetch(config.holidays, { method: "GET" })
    .then((response) => response.json())
    .then((data) => {
      const res = data.Holidays;
      let dayName = "Regular";
      $.each(res, (index, data) => {
        if (data.date == date) {
          dayName = data.name;
        }
      });
      return dayName;
    })
    .catch((error) => {
      console.error("Error fetching holidays:", error);
      return "Regular";
    });
}

const loadDetails = (
  element,
  leave,
  overtime,
  wrkdays,
  wrkhrss,
  table,
  overtimehrs
) => {
  const content = element.empty();
  content.append(
    "<h5>Total Leave: <i>" +
      leave +
      "</i></h5>" +
      "<h5>Total WorkDays: <i>" +
      wrkdays +
      "</i></h5>" +
      "<h5>Total WorkHours: <i>" +
      wrkhrs(wrkhrss) +
      "</i></h5>" +
      "<h5>Total Overtime: <i>" +
      overtime +
      "</i></h5>" +
      "<h5>Total Overtime Hours: <i>" +
      getOvertimeHrs(overtimehrs) +
      "</i></h5>" +
      "<hr />" +
      " <div class='table-container'>" +
      "<table>" +
      " <thead>" +
      "<tr>" +
      "<th>#</th>" +
      "<th>Day</th>" +
      "<th>Type</th>" +
      "<th>TimeIn</th>" +
      "<th>TimeOut</th>" +
      "<th>WorkHrs</th>" +
      "<th>Overtime</th>" +
      "<th>Status</th>" +
      "<th>Date</th>" +
      "</tr>" +
      "</thead>" +
      "<tbody class='timesheet-tbody'>" +
      "</tbody>" +
      "</table>" +
      "</div>"
  );
  const mtable = $(".timesheet-tbody").empty();
  let count = 1;
  $.each(table, async (index, data) => {
    mtable.append(
      "<tr>" +
        "<td>" +
        count++ +
        "</td>" +
        "<td>" +
        getDay(data.Date) +
        "</td>" +
        "<td>" +
        (await dayType(data.Date)) +
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
        singleDayOvertime(data.WorkHours) +
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
};

const singleDayOvertime = (wrkhrs) => {
  if (wrkhrs >= 540) {
    const overtime = wrkhrs / 60 - 8;
    if (Math.floor(overtime) >= 1) {
      return Math.floor(overtime) + " hrs";
    } else {
      return "0 hrs";
    }
  } else {
    return "0 hrs";
  }
};

const getOvertimeHrs = (list) => {
  let summation = [];
  $.each(list, (i, data) => {
    const target = data.WorkHours;
    if (target >= 540) {
      const overtime = target / 60 - 8;
      if (Math.floor(overtime) >= 1) {
        summation.push(Math.floor(overtime));
      }
    }
  });
  let trueval = 0;
  $.each(summation, (i, data) => {
    trueval += data;
  });
  return trueval + " hrs";
};
