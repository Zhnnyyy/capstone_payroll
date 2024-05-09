import { payrollStartup, showMessage } from "./model/MyAlert.js";
export function PayrollFunction() {
  $("#makepayroll").click(() => {
    Swal.fire({
      title: "Payroll Cut Off",
      html:
        '<label for="date1">Start Date</label>' +
        '<input id="date1" class="swal2-input" type="date"><br>' +
        '<label for="date2">End Date</label>' +
        '<input id="date2" class="swal2-input" type="date">',
      showCancelButton: true,
      confirmButtonText: "Look up",
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        const date1 = document.getElementById("date1").value;
        const date2 = document.getElementById("date2").value;
        // if ((date1.length = 0 || date2.length == 0)) {

        // }
        const data = {
          startDate: date1,
          endDate: date2,
        };
        return data;
      },
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        if (
          result.value.startDate.length == 0 ||
          result.value.endDate.length == 0
        ) {
          showMessage("Error", "Invalid Date", "error");
          return;
        }
        if (result.value.startDate > result.value.endDate) {
          showMessage("Error", "Invalid Date", "error");
          return;
        }
        localStorage.clear();
        localStorage.setItem("startDate", result.value.startDate);
        localStorage.setItem("endDate", result.value.endDate);
        window.open(`payroll.html`, "_blank");
      }
    });
  });
}
