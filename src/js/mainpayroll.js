import { Fetch } from "./model/bridge.js";
import { showMessage, showOptions, loading } from "./model/MyAlert.js";
import config from "./model/config.js";

$(() => {
  $("#title").html(
    `Payroll Cutoff: ${localStorage.getItem(
      "startDate"
    )} - ${localStorage.getItem("endDate")}`
  );
  showTable();
  ModaladdAllowance();
  ModaladdDeduction();
  ModaladdAdjustment();
  CloseModal();
});

const CloseModal = () => {
  $(".close").click(() => {
    $(".additional_modal .modal").css("display", "none");
  });
};

const populateEmployee = () => {
  Fetch(config.showEmployee, "GET", (result) => {
    const tbl = $("#dropdownEmployee").empty();
    tbl.append("<option value='' selected disabled>Select Employee</option>");
    if (result.loading) {
      loading(true);
    }
    if (!result.loading) {
      loading(false);
      const data = result.data;
      $.each(data, (i, res) => {
        let name = `${res.Firstname} ${res.Lastname}`;
        tbl.append(
          " <option value='" + res.EmployeeID + "'>" + name + "</option>"
        );
      });
    }
  });
};

const ModaladdAllowance = () => {
  $("#modal_addAllowance").click(() => {
    $(".additional_modal .modal").css("display", "block");
    $("#targetText").html("Add Allowance");
    $(".additional-table").empty();
    populateEmployee();
    addModalItem();
  });
};

const ModaladdDeduction = () => {
  $("#modal_addDeduction").click(() => {
    $(".additional_modal .modal").css("display", "block");
    $("#targetText").html("Add Deduction");
    $(".additional-table").empty();
    populateEmployee();
    addModalItem();
  });
};

const ModaladdAdjustment = () => {
  $("#modal_addAdjustment").click(() => {
    $(".additional_modal .modal").css("display", "block");
    $("#targetText").html("Add Adjustment");
    $(".additional-table").empty();
    populateEmployee();
    addModalItem();
  });
};
$("#dropdownEmployee").on("change", () => {
  const uid = $("#dropdownEmployee").val();
  const target = $("#targetText").html();
  const cutoff = `${localStorage.getItem("startDate")}-${localStorage.getItem(
    "endDate"
  )}`;

  switch (target) {
    case "Add Allowance":
      showModalItem(uid, cutoff, "allowance", "Allowance");
      break;
    case "Add Deduction":
      showModalItem(uid, cutoff, "deduction", "Deduction");
      break;
    case "Add Adjustment":
      showModalItem(uid, cutoff, "adjustment", "Adjustment");
      break;
  }
});
const addModalItem = () => {
  $("#add-modal-item").click(() => {
    const target = $("#targetText").html();
    const name = $("#name").val();
    const amount = $("#amount").val();
    const uid = $("#dropdownEmployee").val();
    const cutoff = `${localStorage.getItem("startDate")}-${localStorage.getItem(
      "endDate"
    )}`;
    if (
      target == "" ||
      name == "" ||
      amount == "" ||
      uid == null ||
      isNaN(amount)
    ) {
      showMessage("Ooopsss", "Please try again", "info");
      return;
    }

    switch (target) {
      case "Add Allowance":
        addModalEmployeeAdditional(
          uid,
          name,
          amount,
          cutoff,
          "allowance",
          "Allowance"
        );
        break;
      case "Add Deduction":
        addModalEmployeeAdditional(
          uid,
          name,
          amount,
          cutoff,
          "deduction",
          "Deduction"
        );
        break;
      case "Add Adjustment":
        addModalEmployeeAdditional(
          uid,
          name,
          amount,
          cutoff,
          "adjustment",
          "Adjustment"
        );
        break;
    }
  });
};

const showModalItem = (id, cutoff, table, target) => {
  const data = {
    id: id,
    cutoff: cutoff,
    table: table,
  };
  Fetch(
    config.showPayrollAdjustment,
    "POST",
    (result) => {
      const tbl = $(".additional-table").empty();
      if (result.loading) {
        loading(true);
      }
      if (!result.loading) {
        loading(false);
        const data = result.data;
        $.each(data.data, (i, res) => {
          tbl.append(
            "<tr>" +
              "<td>" +
              res[target] +
              "</td>" +
              "<td>" +
              res.Amount +
              "</td>" +
              "<td><div class='remove-modal-item' data-id='" +
              res.id +
              "'><i class='fa-solid fa-xmark'></i></div></td>" +
              "</tr>"
          );
        });

        $(".remove-modal-item").on("click", function () {
          const raw = $(this).data("id");
          const data = {
            id: raw,
            table: table,
          };
          console.log(data);
          Fetch(
            config.payrollDeleteAdjustment,
            "POST",
            (result) => {
              if (result.loading) {
                loading(true);
              }
              if (!result.loading) {
                loading(false);
                const rawdata = result.data;
                if (rawdata.Error) {
                  showMessage("Error", "Please try again", "error");
                  return;
                }
                showMessage("Success", rawdata.msg, "success").then(() => {
                  switch (target) {
                    case "Allowance":
                      showModalItem(id, cutoff, "allowance", "Allowance");
                      showTable();
                      break;
                    case "Deduction":
                      showModalItem(id, cutoff, "deduction", "Deduction");
                      showTable();
                      break;
                    case "Adjustment":
                      showModalItem(id, cutoff, "adjustment", "Adjustment");
                      showTable();
                      break;
                  }
                });
              }
            },
            data
          );
        });
      }
    },
    data
  );
};

const addModalEmployeeAdditional = (
  id,
  name,
  amount,
  cutoff,
  table,
  column
) => {
  const data = {
    id: id,
    name: name,
    amount: amount,
    cutoff: cutoff,
    table: table,
    column: column,
  };
  Fetch(
    config.payrollAdjustment,
    "POST",
    (result) => {
      if (result.loading) {
        loading(true);
      }
      if (!result.loading) {
        loading(false);
        const data = result.data;
        if (data.Error) {
          showMessage("Ooppss", "Please try again", "error");
          return;
        }
        showMessage("Success", data.msg, "success").then(() => {
          $("#name").val("");
          $("#amount").val("");
          switch (column) {
            case "Allowance":
              showModalItem(id, cutoff, "allowance", "Allowance");
              showTable();
              return;
            case "Deduction":
              showModalItem(id, cutoff, "deduction", "Deduction");
              showTable();
              return;
            case "Adjustment":
              showModalItem(id, cutoff, "adjustment", "Adjustment");
              showTable();
              return;
          }
          return;
        });
      }
    },
    data
  );
};

const showTable = () => {
  Fetch(config.showEmployee, "GET", (result) => {
    const tbl = $(".payroll-table").empty();
    if (result.loading) {
      loading(true);
    }
    if (!result.loading) {
      loading(false);
      const data = result.data;
      var count = 0;
      $.each(data, async (i, data) => {
        const name = `${data.Firstname} ${data.Lastname}`;
        const id = data.EmployeeID;
        const raw = await details(id);
        const allowance = raw.allowance == null ? 0 : raw.allowance;
        const adjustment = raw.allowance == null ? 0 : raw.adjustment;
        const hrRate = parseInt(data.rateValue) / 8;
        const overtimePay = `${parseFloat(
          (hrRate * 1.25 * raw.overtimehrs).toFixed(2)
        )}`;
        const basicPay = hrRate * parseInt(raw.wrkhrs);
        const totalEarnings = `${parseFloat(
          parseFloat(overtimePay) +
            parseFloat(allowance) +
            parseFloat(adjustment)
        ).toFixed(2)}`;
        const grossPay = parseFloat(
          parseFloat(totalEarnings) + parseFloat(basicPay)
        ).toFixed(2);
        count += 1;
        tbl.append(
          "<tr>" +
            "<td>" +
            count +
            "</td>" +
            "<td>" +
            id +
            "</td>" +
            "<td>" +
            name +
            "</td>" +
            "<td>" +
            data.Rate +
            "</td>" +
            "<td>" +
            data.rateValue +
            "</td>" +
            "<td>" +
            hrRate +
            "</td>" +
            "<td>" +
            `${raw.wrkdays}days` +
            "</td>" +
            "<td>" +
            raw.leave +
            "</td>" +
            "<td>" +
            basicPay +
            "</td>" +
            "<td>" +
            `${raw.overtime} day` +
            "</td>" +
            "<td>" +
            `${raw.overtimehrs}hrs` +
            "</td>" +
            "<td>" +
            overtimePay +
            "</td>" +
            "<td>" +
            allowance +
            "</td>" +
            "<td>" +
            adjustment +
            "</td>" +
            "<td>" +
            totalEarnings +
            "</td>" +
            "<td>" +
            grossPay +
            "</td>" +
            "</tr>"
        );
      });
    }
  });
};

async function details(id) {
  const apiUrl = config.payroll;
  const data = {
    id: id,
    startdate: localStorage.getItem("startDate"),
    enddate: localStorage.getItem("endDate"),
    cutoff: `${localStorage.getItem("startDate")}-${localStorage.getItem(
      "endDate"
    )}`,
  };

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
}
