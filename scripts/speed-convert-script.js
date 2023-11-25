let dropdownElements = document.querySelectorAll(".dropdown");

let preSelectedElementIndices = [0, 0, 1];

const unitSystemsData = {
    "m/s": {
        "name": "Meters per second",
        "base": true,
        "valueFunction": (x) => x,
        "convertInFunction": (x) => x,
    },
    "km/h": {
        "name": "Kilometers per hour",
        "base": false,
        "valueFunction": (x) => (x/3.6),
        "convertInFunction": (x) => (x * 3.6),  // m/s to Kilometers per hour
    },
    "km/s": {
        "name": "Kilometers per second",
        "base": false,
        "valueFunction": (x) => (x * 1000),
        "convertInFunction": (x) => (x / 1000),  // m/s to Kilometers per second
    },
    "c": {
        "name": "Speed of light",
        "base": false,
        "valueFunction": (x) => (x * 299792458),
        "convertInFunction": (x) => (x / 299792458),  // m/s to Speed of light
    },
    "Ma": {
        "name": "Mach",
        "base": false,
        "valueFunction": (x) => (x * 340.3),
        "convertInFunction": (x) => (x / 340.3),  // m/s to Mach
    },
    "kn/h": {
        "name": "Knots per hour",
        "base": false,
        "valueFunction": (x) => (x * 0.514444),
        "convertInFunction": (x) => (x / 0.514444),  // m/s to knots/hour
    },
    "mph": {
        "name": "Miles per hour",
        "base": false,
        "valueFunction": (x) => (x * 0.44703888888888),
        "convertInFunction": (x) => (x / 0.44703888888888),  // m/s to Miles per hour
    },
    "in/s": {
        "name": "Inches per second",
        "base": false,
        "valueFunction": (x) => (x * 0.0254),
        "convertInFunction": (x) => (x / 0.0254),  // m/s to Inches per second
    },
    "ft/s": {
        "name": "Feet per second",
        "base": false,
        "valueFunction": (x) => (x * 0.3048),
        "convertInFunction": (x) => (x / 0.3048),  // m/s to Feet per second
    },
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
    let baseValue = Math.round(unitSystemsData[sourceBase].valueFunction(value)*1000)/1000;
    let targetValue = Math.round(unitSystemsData[targetBase].convertInFunction(parseFloat(baseValue))*1000)/1000;

    return targetValue;
}
