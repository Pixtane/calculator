let dropdowns = document.querySelectorAll(".dropdown");

// Specify the path to the JSON file
const jsonPath = "./assets/json/currencies.json";

let preDeterminedElementsIds = [0, 145, 42, 143, 29, 117];

// Fetch the JSON data
fetch(jsonPath)
  .then((response) => {
    // Check if the request was successful
    if (!response.ok) {
      throw new Error(`Failed to fetch ${jsonPath}`);
    }

    return response.json();
  })
  .then((jsonData) => {
    const currenciesData = jsonData;
    let dropdownCount = 0;
    dropdowns.forEach((dropdown) => {
      dropdownCount++;
      let dropdownElement = document.createElement("select");
      dropdownElement.classList.add("dropdown-element");

      // Add an event listener to update the displayed text
      dropdownElement.addEventListener("change", function () {
        updateRates(dropdown.parentElement.children[1].children[0]);
      });

      for (const currencyCode in currenciesData) {
        if (currenciesData.hasOwnProperty(currencyCode)) {
          const currency = currenciesData[currencyCode];
          const option = document.createElement("option");
          option.value = currencyCode;
          option.title = currency.name;
          option.text = `${currencyCode}`;

          dropdownElement.appendChild(option);
        }
      }

      function getKeyByValue(object, value) {
        for (const key in object) {
          if (object.hasOwnProperty(key) && object[key] === value) {
            return key;
          }
        }
        return null; // If the value is not found
      }
      dropdown.appendChild(dropdownElement);
      dropdownElement.selectedIndex = preDeterminedElementsIds[dropdownCount];
    });
  })
  .catch((error) => {
    console.error("Error fetching JSON:", error);
  });

let inputElements = document.querySelectorAll(".input-element");

inputElements.forEach((inputElement) => {
  let newInputElement = document.createElement("input");
  newInputElement.classList.add("real-input-element");
  newInputElement.type = "number";
  newInputElement.min = "0";
  newInputElement.oninput = function () {
    this.value = !!this.value && Math.abs(this.value) >= 0 ? Math.abs(this.value) : null
  }
  newInputElement.addEventListener("input", function () {
    updateRates(newInputElement);
  });
  inputElement.appendChild(newInputElement);
});

function updateRates(inputElement) {
  let inputValue = inputElement.value;
  if (inputValue == null || inputValue == "") {
    return;
  }

  fetch("/exchange-rates")
    .then((response) => {
      // Check if the response status is OK (200)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Parse the JSON from the response
      return response.json();
    })
    .then((data) => {
      // Handle the retrieved JSON data
      let inputs = document.querySelectorAll(".real-input-element");
      inputs.forEach((realInputElement) => {
        if (realInputElement == inputElement) {
          return;
        }
        let realInputElementDropdown = realInputElement.parentElement.parentElement.children[0].children[0];
        let realInputElementDropdownCurrency = realInputElementDropdown.options[realInputElementDropdown.selectedIndex].value

        let inputElementDropdown = inputElement.parentElement.parentElement.children[0].children[0];
        let inputElementDropdownCurrency = inputElementDropdown.options[inputElementDropdown.selectedIndex].value

        realInputElement.value = Math.round(data["rates"][realInputElementDropdownCurrency]/data["rates"][inputElementDropdownCurrency] * inputElement.value * 1000) / 1000;
      })
      // Now 'data' contains the JSON from the server
    })
    .catch((error) => {
      // Handle errors during the fetch
      console.error("Fetch error:", error);
    });
}
