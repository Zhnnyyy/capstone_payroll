import { Fetch } from "./model/bridge.js";
import { showMessage, showOptions, loading } from "./model/MyAlert.js";
import config from "./model/config.js";
// $(() => {

// });
export function RequestFunction() {
  loadLeaveRequestTable();
}
const loadLeaveRequestTable = () => {
  Fetch(config.employeeRequest, "GET", (result) => {
    if (result.loading) {
      loading(true);
    }
    if (!result.loading) {
      loading(false);
      const res = result.data;
      const tbl = $("#leaverequesttbl").empty();
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
            data.startDate +
            "</td>" +
            "<td>" +
            data.endDate +
            "</td>" +
            "<td>" +
            data.types +
            "</td>" +
            "<td>" +
            data.reason +
            "</td>" +
            "<td>" +
            data.status +
            "</td>" +
            "<td class='btn-grp'>" +
            "<button class='accept' data-id='" +
            data.id +
            "' data-startdate='" +
            data.startDate +
            "' data-enddate='" +
            data.endDate +
            "' data-employee='" +
            data.EmployeeID +
            "'><i class='fa-solid fa-check'></i></button><button class='reject' data-id='" +
            data.id +
            "'><i class='fa-solid fa-xmark'></i></button>" +
            "</td>" +
            "</tr>"
        );
      });
    }

    $(".accept").on("click", function (e) {
      const data = $(this).data("id");
      const startdate = $(this).data("startdate");
      const enddate = $(this).data("enddate");
      const employee = $(this).data("employee");
      showOptions(
        "Are you sure?",
        "You cannot revert this action",
        "warning",
        () => {
          updateRequest(data, startdate, enddate, employee, "Approved");
        }
      );
    });
    $(".reject").on("click", function (e) {
      const data = $(this).data("id");
      showOptions(
        "Are you sure?",
        "You cannot revert this action",
        "warning",
        () => {
          updateRequest(data, "Rejected");
        }
      );
    });
  });
};

const updateRequest = (id, date1, date2, employee, status) => {
  const data = {
    uid: id,
    status: status,
    date1: date1,
    date2: date2,
    employee: employee,
  };
  Fetch(
    config.updateRequest,
    "POST",
    (result) => {
      if (result.loading) {
        loading(true);
      }
      if (!result.loading) {
        console.log(result);
        loading(false);
        const res = result.data;
        if (res.Error == false) {
          showMessage("Success", "Request has been " + status, "success").then(
            () => {
              loadLeaveRequestTable();
            }
          );
        } else {
          showMessage("Error", res.msg, "error");
        }
      }
    },
    data
  );
};
