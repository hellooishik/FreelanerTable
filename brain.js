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
        const dateFrom = new Date(
          document.getElementById(`date-from-${row}`).value
        );
        const dateTo = new Date(
          document.getElementById(`date-to-${row}`).value
        );
        const diffField = document.getElementById(`diff-${row}`);

        if (dateFrom && dateTo && dateFrom <= dateTo) {
          let years = dateTo.getFullYear() - dateFrom.getFullYear();
          let months = dateTo.getMonth() - dateFrom.getMonth();
          let days = dateTo.getDate() - dateFrom.getDate();

          if (days < 0) {
            months--;
            days += new Date(
              dateTo.getFullYear(),
              dateTo.getMonth(),
              0
            ).getDate();
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

      function validateDates(index) {
        const fromDate = document.getElementById(`date-from-${index}`).value;
        const toDate = document.getElementById(`date-to-${index}`).value;

        if (fromDate && toDate) {
          const from = new Date(fromDate);
          const to = new Date(toDate);

          if (from >= to) {
            alert('The "Date From" should be earlier than "Date To".');
            document.getElementById(`date-from-${index}`).value = "";
            document.getElementById(`date-to-${index}`).value = "";
            document.getElementById(`diff-${index}`).value = "";
            return;
          }

          const rows = document.querySelectorAll("#org-table tbody tr");
          for (let i = 0; i < rows.length; i++) {
            if (i + 1 === index) continue;

            const otherFromDate = document.getElementById(
              `date-from-${i + 1}`
            ).value;
            const otherToDate = document.getElementById(
              `date-to-${i + 1}`
            ).value;

            if (otherFromDate && otherToDate) {
              const otherFrom = new Date(otherFromDate);
              const otherTo = new Date(otherToDate);

              if (from <= otherTo && to >= otherFrom) {
                alert(
                  "The dates should not overlap with other organisation periods."
                );
                document.getElementById(`date-from-${index}`).value = "";
                document.getElementById(`date-to-${index}`).value = "";
                document.getElementById(`diff-${index}`).value = "";
                return;
              }
            }
          }

          calculateDifference(index);
        }
      }

      function addOrganisationRow() {
        orgCount++;
        const tableBody = document.querySelector("#org-table tbody");
        const newRow = document.createElement("tr");
        newRow.innerHTML = `
                <td>${orgCount}</td>
                <td><input type="text" name="org${orgCount}-name" required /></td>
                <td>
                    <input
                        type="date"
                        id="date-from-${orgCount}"
                        name="org${orgCount}-date-from"
                        onchange="calculateDifference(${orgCount}); validateDates(${orgCount})"
                        required
                    />
                </td>
                <td>
                    <input
                        type="date"
                        id="date-to-${orgCount}"
                        name="org${orgCount}-date-to"
                        onchange="calculateDifference(${orgCount}); validateDates(${orgCount})"
                        required
                    />
                </td>
                <td><input type="text" id="diff-${orgCount}" name="org${orgCount}-diff" disabled /></td>
            `;
        tableBody.appendChild(newRow);
      }

      function toggleOrgInput(select, row) {
        const input = document.querySelector(
          `input[name="exp${row}-org-name"]`
        );
        if (select.value === "organisation") {
          input.classList.remove("hidden");
          input.required = true;
        } else {
          input.classList.add("hidden");
          input.required = false;
        }
      }

      function addExperienceRow() {
        expCount++;
        const tableBody = document.querySelector("#exp-table tbody");
        const newRow = document.createElement("tr");
        newRow.innerHTML = `
                <td>${expCount}</td>
                <td>
                    <select name="exp${expCount}-org" onchange="toggleOrgInput(this, ${expCount})" required>
                        <option value="">Select</option>
                        <option value="self">Self</option>
                        <option value="organisation">Organisation</option>
                    </select>
                    <input type="text" name="exp${expCount}-org-name" class="hidden" placeholder="Organisation Name" required />
                </td>
                <td><input type="number" name="exp${expCount}-time" required /></td>
            `;
        tableBody.appendChild(newRow);
      }

      document
        .getElementById("freelancer-form")
        .addEventListener("submit", function (event) {
          event.preventDefault();
          document.getElementById("thank-you-popup").style.display = "block";
        });

      function closePopup() {
        document.getElementById("thank-you-popup").style.display = "none";
      }
