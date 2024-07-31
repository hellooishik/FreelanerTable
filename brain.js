let orgCount = 1;
let expCount = 1;

function toggleOtherTextarea() {
  const otherCheckbox = document.getElementById("subject-other");
  const otherTextarea = document.getElementById("other-textarea");
  if (otherCheckbox.checked) {
    otherTextarea.classList.remove("hidden");
  } else {
    otherTextarea.classList.add("hidden");
  }
}

function calculateDifference(row) {
  const dateFrom = new Date(document.getElementById(`date-from-${row}`).value);
  const dateTo = new Date(document.getElementById(`date-to-${row}`).value);
  const diffField = document.getElementById(`diff-${row}`);

  if (dateFrom && dateTo && dateFrom <= dateTo) {
    let years = dateTo.getFullYear() - dateFrom.getFullYear();
    let months = dateTo.getMonth() - dateFrom.getMonth();
    let days = dateTo.getDate() - dateFrom.getDate();

    if (days < 0) {
      months--;
      days += new Date(dateTo.getFullYear(), dateTo.getMonth(), 0).getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    diffField.value = `${years} years, ${months} months, ${days} days`;
  } else {
    diffField.value = "";
  }
}

function addOrganisationRow() {
  const requiredFieldsFilled = Array.from(
    document.querySelectorAll("#org-table input")
  ).every((input) => input.value);
  if (!requiredFieldsFilled) {
    alert(
      "Please fill all fields in the current Organisation row before adding more."
    );
    return;
  }
  orgCount++;
  const table = document.getElementById("org-table");
  const row = table.insertRow();
  row.innerHTML = `<td>${orgCount}</td>
    <td><input type="text" name="org${orgCount}-name" required></td>
    <td><input type="date" id="date-from-${orgCount}" name="org${orgCount}-date-from" onchange="calculateDifference(${orgCount})" required></td>
    <td><input type="date" id="date-to-${orgCount}" name="org${orgCount}-date-to" onchange="calculateDifference(${orgCount})" required></td>
    <td><input type="text" id="diff-${orgCount}" name="org${orgCount}-diff" disabled></td>`;
}

function addExperienceRow() {
  const requiredFieldsFilled =
    Array.from(document.querySelectorAll("#exp-table input")).every(
      (input) => input.value
    ) &&
    Array.from(document.querySelectorAll("#exp-table select")).every(
      (select) => select.value
    );
  if (!requiredFieldsFilled) {
    alert(
      "Please fill all fields in the current Experience row before adding more."
    );
    return;
  }
  expCount++;
  const table = document.getElementById("exp-table");
  const row = table.insertRow();
  row.innerHTML = `<td>${expCount}</td>
    <td>
      <select name="exp${expCount}-org" onchange="toggleOrgInput(this, ${expCount})" required>
        <option value="">Select</option>
        <option value="self">Self</option>
        <option value="organisation">Organisation</option>
      </select>
      <input type="text" name="exp${expCount}-org-name" class="hidden" placeholder="Organisation Name" required>
    </td>
    <td><input type="number" name="exp${expCount}-time" required></td>`;
}

function toggleOrgInput(select, row) {
  const orgInput = select.nextElementSibling;
  if (select.value === "organisation") {
    orgInput.classList.remove("hidden");
  } else {
    orgInput.classList.add("hidden");
  }
}

function validateForm() {
  // Check if all required fields in the Organisations section are filled
  const orgRows = document.querySelectorAll("#org-table tr");
  for (let i = 1; i < orgRows.length; i++) {
    // Skip header row
    const cells = orgRows[i].getElementsByTagName("input");
    for (let cell of cells) {
      if (cell.hasAttribute("required") && !cell.value) {
        alert("Please fill all fields in the Organisations section.");
        return false;
      }
    }
  }

  // Check if all required fields in the Experience section are filled
  const expRows = document.querySelectorAll("#exp-table tr");
  for (let i = 1; i < expRows.length; i++) {
    // Skip header row
    const cells = expRows[i].getElementsByTagName("input");
    for (let cell of cells) {
      if (cell.hasAttribute("required") && !cell.value) {
        alert("Please fill all fields in the Experience section.");
        return false;
      }
    }

    // Also check the select element in the Experience section
    const select = expRows[i].getElementsByTagName("select")[0];
    if (!select.value) {
      alert("Please select an option for the Experience section.");
      return false;
    }
  }

  return true;
}

document.querySelector("form").addEventListener("submit", function (event) {
  if (!validateForm()) {
    event.preventDefault();
  }
});
