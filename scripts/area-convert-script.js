let dropdownElements = document.querySelectorAll(".dropdown");

let preSelectedElementIndices = [0, 0, 1];

const unitSystemsData = {
    "m2": {
        "name": "Square meters",
        "base": true,
        "valueFunction": (x) => x,
        "convertInFunction": (x) => x,
    },
    "km2": {
        "name": "Square kilometers",
        "base": false,
        "valueFunction": (x) => (x * 1000000),
        "convertInFunction": (x) => (x / 1000000),
    },
    "ha": {
        "name": "Hectares",
        "base": false,
        "valueFunction": (x) => (x * 10000),
        "convertInFunction": (x) => (x / 10000),
    },
    "are": {
        "name": "Are",
        "base": false,
        "valueFunction": (x) => (x * 100),
        "convertInFunction": (x) => (x / 100),
    },
    "dm2": {
        "name": "Square decimetres",
        "base": false,
        "valueFunction": (x) => (x / 100),
        "convertInFunction": (x) => (x * 100), 
    },
    "cm2": {
        "name": "Square centimetres",
        "base": false,
        "valueFunction": (x) => (x / 10000),
        "convertInFunction": (x) => (x * 10000), 
    },
    "mm2": {
        "name": "Square millimetres",
        "base": false,
        "valueFunction": (x) => (x / 1000000),
        "convertInFunction": (x) => (x * 1000000),
    },
    "mkm2": {
        "name": "Square micrometres",
        "base": false,
        "valueFunction": (x) => (x / 1000000000000),
        "convertInFunction": (x) => (x * 1000000000000), 
    },
    "acres": {
        "name": "Acres",
        "base": false,
        "valueFunction": (x) => (x / 0.000247105407),
        "convertInFunction": (x) => (x * 0.000247105407), 
    },
    "mi2": {
        "name": "Square miles",
        "base": false,
        "valueFunction": (x) => (x / 0.000000386102159),
        "convertInFunction": (x) => (x * 0.000000386102159),
    },
    "yd2": {
        "name": "Square yards",
        "base": false,
        "valueFunction": (x) => (x / 1.19599005),
        "convertInFunction": (x) => (x * 1.19599005),
    },
    "ft2": {
        "name": "Square feet",
        "base": false,
        "valueFunction": (x) => (x / 10.76391041671),
        "convertInFunction": (x) => (x * 10.76391041671),
    },
    "in2": {
        "name": "Square inches",
        "base": false,
        "valueFunction": (x) => (x / 1550.0031),
        "convertInFunction": (x) => (x * 1550.0031),
    },
    "prch2": {
        "name": "Square perch",
        "base": false,
        "valueFunction": (x) => (x / 0.03953686512),
        "convertInFunction": (x) => (x * 0.03953686512),
    },
    "qin": {
        "name": "Qin (Chinese)",
        "base": false,
        "valueFunction": (x) => (x / 0.000015),
        "convertInFunction": (x) => (x * 0.000015),
    },
    "mu": {
        "name": "Mu (Chinese)",
        "base": false,
        "valueFunction": (x) => (x / 0.0015),
        "convertInFunction": (x) => (x * 0.0015),
    },
    "chi2": {
        "name": "Chi2 (Chinese)",
        "base": false,
        "valueFunction": (x) => (x / 9),
        "convertInFunction": (x) => (x * 9),
    },
    "cun2": {
        "name": "Cun2 (Chinese)",
        "base": false,
        "valueFunction": (x) => (x / 900),
        "convertInFunction": (x) => (x * 900),
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
