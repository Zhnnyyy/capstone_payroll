import { loadDropdownPositions, loadDropdownTypes } from "./dashboard.js";
import { showMessage, showOptions } from "./model/MyAlert.js";
import { Fetch } from "./model/bridge.js";
$(() => {
  $("#form-types").submit(function (e) {
    e.preventDefault();
    const frmdata = new FormData(this);
    if (frmdata.get("type").length > 2 && frmdata.get("value").length > 2) {
      Fetch(
        "api/addtype.php",
        "POST",
        (result) => {
          const res = JSON.parse(result);
          if (res.res == true) {
            loadTypes();
            loadDropdownTypes();
            $("#form-types input[type='text']").val("");
            showMessage("Success", "", "success");
          } else {
            showMessage("Failed", "Please try again", "error");
          }
        },
        frmdata
      );
    } else {
      showMessage("Oops", "Pleas fill out the blanks", "info");
    }
  });
  $("#form-position").submit(function (e) {
    e.preventDefault();
    const frmdata = new FormData(this);
    if (frmdata.get("position").length > 2 && frmdata.get("value").length > 2) {
      Fetch(
        "api/addposition.php",
        "POST",
        (result) => {
          const res = JSON.parse(result);
          if (res.res == true) {
            loadPosition();
            loadDropdownPositions();
            $("#form-position input[type='text']").val("");
            showMessage("Success", "", "success");
          } else {
            showMessage("Failed", "Please try again", "error");
          }
        },
        frmdata
      );
    } else {
      showMessage("Oops", "Pleas fill out the blanks", "info");
    }
  });
  loadTypes();
  loadPosition();
});

const loadPosition = () => {
  Fetch("api/showPositions.php", "GET", (result) => {
    const res = JSON.parse(result);
    const tbl = $("#row-positions").empty();
    let row = 1;
    $.each(res, function (index, data) {
      tbl.append(
        "<tr>" +
          "<td>" +
          row++ +
          "</td>" +
          "<td>" +
          data.type +
          "</td>" +
          "<td>" +
          data.value +
          "</td>" +
          "<td>" +
          '<button class="deleteItem removePosition" data-id="' +
          data.id +
          '" >' +
          '<i class="fa-regular fa-trash"></i>' +
          "</button>" +
          "</td>" +
          "</tr>"
      );
    });
  });

  $("#row-positions").on("click", ".removePosition", function () {
    const id = $(this).data("id");
    const data = new FormData();
    data.append("id", id);
    showOptions(
      "Are you sure?",
      "You cannot revert this action",
      "warning",
      () => {
        Fetch(
          "api/removePosition.php",
          "POST",
          (res) => {
            const result = JSON.parse(res);
            if (result.res == true) {
              loadPosition();
              loadDropdownPositions();
              showMessage("Success", "Item has been removed", "success");
            } else {
              showMessage("Failed", "Please try again", "error");
            }
          },
          data
        );
      }
    );
  });
};

const loadTypes = () => {
  Fetch("api/showTypes.php", "GET", (result) => {
    const res = JSON.parse(result);
    const tbl = $("#row_types").empty();
    let row = 1;
    $.each(res, function (index, data) {
      tbl.append(
        "<tr>" +
          "<td>" +
          row++ +
          "</td>" +
          "<td>" +
          data.type +
          "</td>" +
          "<td>" +
          data.value +
          "</td>" +
          "<td>" +
          '<button class="deleteItem removeType" data-id="' +
          data.id +
          '" >' +
          '<i class="fa-regular fa-trash"></i>' +
          "</button>" +
          "</td>" +
          "</tr>"
      );
    });
  });

  $("#row_types").on("click", ".removeType", function () {
    const id = $(this).data("id");
    const data = new FormData();
    data.append("id", id);
    showOptions(
      "Are you sure?",
      "You cannot revert this action",
      "warning",
      () => {
        Fetch(
          "api/removeType.php",
          "POST",
          (res) => {
            const result = JSON.parse(res);
            if (result.res == true) {
              loadTypes();
              loadDropdownTypes();
              showMessage("Success", "Item has been removed", "success");
            } else {
              showMessage("Failed", "Please try again", "error");
            }
          },
          data
        );
      }
    );
  });
};
