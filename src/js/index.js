import { ManageFunction } from "./manageEmployee.js";
import { AttendanceFunction } from "./attendance.js";
import { TimesheetFunction } from "./timesheet.js";
import { RequestFunction } from "./request.js";
import { PayrollFunction } from "./payroll.js";
import { SettingsFunction } from "./settings.js";
import { DashboardFunction } from "./dashboard.js";
$(() => {
  $(".toggle").click(() => {
    $(".sidebar").toggleClass("close");
    $(".toggle").toggleClass("toggle-close");
    $(".container").toggleClass("full");
  });
  AddEmployeeOpenModal();
  AddEmployeeCloseModal();
  btnAct();
  tabBtn();
  openSettings();
  closeSettings();
});

const btnAct = () => {
  $(".nav-btn").click(function (e) {
    e.preventDefault();
    $(".nav-btn").removeClass("active");
    $(this).addClass("active");
    menuBtn($(e.target).data("data"));
  });
};

const tabBtn = () => {
  // $(".tab-btn").click(function (e) {
  //   e.preventDefault();
  //   $(".tab-btn").removeClass("activetab");
  //   $(this).addClass("activetab");
  //   tabMenu($(e.target).data("tab"));
  // });
};

const AddEmployeeOpenModal = () => {
  $("#add_employee").click(() => {
    $(".manage_employee_modal .modal").css("display", "block");
    $(".manage_employee_modal .content").css("display", "block");
  });
};
const AddEmployeeCloseModal = () => {
  $("#manageCloseModal").click(function (e) {
    e.preventDefault();
    $(".manage_employee_modal .modal").css("display", "none");
    $(".manage_employee_modal .content").css("display", "none");
  });
};

const openSettings = () => {
  $("#btn-settings").click(() => {
    $(".settings_modal").css("display", "block");
    $(".settings_modal .modal .content").css("display", "flex");
    SettingsFunction();
  });
};
const closeSettings = () => {
  $("#closeSettings").click(() => {
    $(".settings_modal").css("display", "none");
  });
};

const menuBtn = (data) => {
  switch (data) {
    case "dashboard":
      toggleContent(".dashboard");
      DashboardFunction();
      break;
    case "manage":
      toggleContent(".manage");
      ManageFunction();
      break;
    case "attendance":
      toggleContent(".attendance");
      AttendanceFunction();
      break;
    case "timesheet":
      toggleContent(".timesheet");
      TimesheetFunction();
      break;
    case "approval":
      toggleContent(".approval");
      RequestFunction();
      break;
    case "payroll":
      toggleContent(".payroll");
      PayrollFunction();
      break;
  }
};

const tabMenu = (data) => {
  switch (data) {
    case "leave":
      toggleTab(".leave-request-box");
      break;
  }
};

const toggleContent = (data) => {
  $(".content").css("display", "none");
  $(data).css("display", "block");
};
