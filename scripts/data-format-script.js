let dropdowns = document.querySelectorAll(".dropdown");

// Specify the path to the JSON file
const jsonPath = "./assets/json/currencies.json";

let preDeterminedElementsIds = [0, 2, 1];

const systemsData = {
    "DEC": {
        "name": "Decimal",
        "numericalBase": 10
    },
    "HEX": {
        "name": "Hexadecimal",
        "numericalBase": 16
    },
    "OCT": {
        "name": "Octal",
        "numericalBase": 8
    },
    "BIN": {
        "name": "Binary",
        "numericalBase": 2
    }
}


let dropdownCount = 0;
dropdowns.forEach((dropdown) => {
    dropdownCount++;
    let dropdownElement = document.createElement("select");
    dropdownElement.classList.add("dropdown-element");

    // Add an event listener to update the displayed text
    dropdownElement.addEventListener("change", function () {
        if (dropdown == dropdowns[0]) {
            updateRates(dropdown.parentElement.parentElement.children[0].children[1].children[0]);
            console.log(dropdown.parentElement.parentElement)
        } else {
            updateRates(dropdown.parentElement.parentElement.children[1].children[1].children[0]);
            console.log(dropdown.parentElement.parentElement.children[1].children[0])
        }
    });

    for (const currencyCode in systemsData) {
        if (systemsData.hasOwnProperty(currencyCode)) {
            const currency = systemsData[currencyCode];
            const option = document.createElement("option");
            option.value = currencyCode;
            option.title = currency.name;
            option.text = `${currencyCode}`;

            dropdownElement.appendChild(option);
        }
    }

    dropdown.appendChild(dropdownElement);
    dropdownElement.selectedIndex = preDeterminedElementsIds[dropdownCount];
});

let inputElements = document.querySelectorAll(".input-element");

inputElements.forEach((inputElement) => {
  let newInputElement = document.createElement("input");
  newInputElement.classList.add("real-input-element");

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

    let sourceCurrencyCode = dropdowns[0].querySelector(".dropdown-element").value;
    let targetCurrencyCode = dropdowns[1].querySelector(".dropdown-element").value;

    if (inputValue !== document.querySelectorAll(".real-input-element")[0].value) {
        sourceCurrencyCode = dropdowns[1].querySelector(".dropdown-element").value;
        targetCurrencyCode = dropdowns[0].querySelector(".dropdown-element").value;
    }

    // Get the corresponding bases from the currenciesData object
    let sourceBase = systemsData[sourceCurrencyCode].numericalBase;
    let targetBase = systemsData[targetCurrencyCode].numericalBase;

    // Convert the input value from the source base to the target base
    let convertedValue = convertBase(inputValue, sourceBase, targetBase);
    console.log(inputValue, sourceBase, targetBase, convertedValue);

    // Update the value of the input element with the converted value
    if (inputValue !== document.querySelectorAll(".real-input-element")[0].value) {
        document.querySelectorAll(".real-input-element")[0].value = convertedValue;
    } else {
        document.querySelectorAll(".real-input-element")[1].value = convertedValue;
    }
}

function convertBase(value, sourceBase, targetBase) {
    // Convert the value from the source base to decimal
    let decimalValue = parseInt(value, sourceBase);

    // Convert the decimal value to the target base
    let convertedValue = decimalValue.toString(targetBase);

    return convertedValue;
}