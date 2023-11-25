let dropdownElements = document.querySelectorAll(".dropdown");

let preSelectedElementIndices = [0, 3, 2];

const unitSystemsData = {
    "b": {
        "name": "Bits",
        "base": false,
        "valueFunction": (x) => (x / 1024 / 1024 / 8),
        "convertInFunction": (x) => (x * 1024 * 1024 * 8),
    },
    "B": {
        "name": "Bytes",
        "base": false,
        "valueFunction": (x) => (x / 1024 / 1024),
        "convertInFunction": (x) => (x * 1024 * 1024),
    },
    "KB": {
        "name": "Kilobytes",
        "base": false,
        "valueFunction": (x) => (x / 1024),
        "convertInFunction": (x) => (x * 1024),
    },
    "MB": {
        "name": "Megabytes",
        "base": true,
        "valueFunction": (x) => x,
        "convertInFunction": (x) => x,
    },
    "GB": {
        "name": "Gigabytes",
        "base": false,
        "valueFunction": (x) => (x * 1024),
        "convertInFunction": (x) => (x / 1024),
    },
    "TB": {
        "name": "Terabytes",
        "base": false,
        "valueFunction": (x) => (x * 1024 * 1024),
        "convertInFunction": (x) => (x / 1024 / 1024), 
    },
    "PB": {
        "name": "Petabytes",
        "base": false,
        "valueFunction": (x) => (x * 1024 * 1024 * 1024),
        "convertInFunction": (x) => (x / 1024 / 1024 / 1024), 
    }
};

let dropdownCount = 0;
dropdownElements.forEach((dropdown) => {
    dropdownCount++;
    let dropdownElement = document.createElement("select");
    dropdownElement.classList.add("dropdown-element");

    // Add an event listener to update the displayed text
    dropdownElement.addEventListener("change", function () {
        if (dropdown == dropdownElements[0]) {
            updateUnitRates(dropdown.parentElement.parentElement.children[0].children[1].children[0]);
            console.log(dropdown.parentElement.parentElement)
        } else {
            updateUnitRates(dropdown.parentElement.parentElement.children[1].children[1].children[0]);
            console.log(dropdown.parentElement.parentElement.children[1].children[0])
        }
    });

    for (const unitCode in unitSystemsData) {
        if (unitSystemsData.hasOwnProperty(unitCode)) {
            const unit = unitSystemsData[unitCode];
            const option = document.createElement("option");
            option.value = unitCode;
            option.title = unit.name;
            option.text = `${unitCode}`;

            dropdownElement.appendChild(option);
        }
    }

    dropdown.appendChild(dropdownElement);
    dropdownElement.selectedIndex = preSelectedElementIndices[dropdownCount];
});

let inputElements = document.querySelectorAll(".input-element");

inputElements.forEach((inputElement) => {
    let newInputElement = document.createElement("input");
    newInputElement.classList.add("real-input-element");
    newInputElement.type = "number";

    newInputElement.addEventListener("input", function () {
        updateUnitRates(newInputElement);
    });
    inputElement.appendChild(newInputElement);
});

function updateUnitRates(inputElement) {
    let inputValue = inputElement.value;
    if (inputValue == null || inputValue == "") {
        return;
    }

    let sourceUnitCode = dropdownElements[0].querySelector(".dropdown-element").value;
    let targetUnitCode = dropdownElements[1].querySelector(".dropdown-element").value;

    if (inputValue !== document.querySelectorAll(".real-input-element")[0].value) {
        sourceUnitCode = dropdownElements[1].querySelector(".dropdown-element").value;
        targetUnitCode = dropdownElements[0].querySelector(".dropdown-element").value;
    }

    // Convert the input value from the source base to the target base
    let convertedValue = convertUnitValue(inputValue, sourceUnitCode, targetUnitCode);
    console.log(inputValue, "|", sourceUnitCode, "|", targetUnitCode, "|", convertedValue);

    // Update the value of the input element with the converted value
    if (inputValue !== document.querySelectorAll(".real-input-element")[0].value) {
        document.querySelectorAll(".real-input-element")[0].value = convertedValue;
    } else {
        document.querySelectorAll(".real-input-element")[1].value = convertedValue;
    } 
}

function convertUnitValue(value, sourceBase, targetBase) {
    let baseValue = Math.round(unitSystemsData[sourceBase].valueFunction(value)*1000000)/1000000;
    let targetValue = Math.round(unitSystemsData[targetBase].convertInFunction(parseFloat(baseValue))*1000000)/1000000;

    return targetValue;
}
