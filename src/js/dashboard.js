import { showMessage, showOptions, loading } from "./model/MyAlert.js";
import { Fetch } from "./model/bridge.js";
import config from "./model/config.js";

$(() => {
  dashboardDetails();
});
export function DashboardFunction() {
  dashboardDetails();
}

const dashboardDetails = () => {
  Fetch(config.dashboardDetails, "GET", (result) => {
    if (result.loading) {
      loading(true);
    }
    if (!result.loading) {
      loading(false);
      const data = result.data;
      console.log(data);
      $("#employee").html(data.employee);
      $("#attendance").html(data.attendance);
      $("#request").html(data.request);
      $("#leave").html(data.leave);

      let yearHoliday = [];

      $.each(data.holiday.Regular_Holidays, async (i, res) => {
        yearHoliday.push({ name: res.name, date: res.date });
      });
      $.each(data.holiday.Special_Holidays, async (i, res) => {
        yearHoliday.push({ name: res.name, date: res.date });
      });
      const tbl = $(".right-container").empty();
      console.log(yearHoliday);
      $.each(yearHoliday, (i, res) => {
        tbl.append(
          `<div class="holiday-container">
            <label>${res.name}</label>
             <label> ${res.date}</label>
          </div>`
        );
      });
    }
  });
};
