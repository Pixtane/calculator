let inverseFunctions = false;

let result = document.getElementById("result");
let equation = document.getElementById("equation");

equation.addEventListener("input", (event) => {
  result.innerHTML = "`" + equation.value + "`";
  MathJax.typesetPromise();
});

document.addEventListener("click", (event) => {
  if (event.target == null) {
    return;
  }
  try {
    let target = event.target;
    while (!target.classList.contains("element")) {
      target = target.parentElement;
      if (target.tagName === "HTML") {
        break;
      }
    }
    if (target.classList.contains("element")) {
      // Get the current cursor position
      const originalCursorPosition = equation.selectionStart;

      if (originalCursorPosition === equation.selectionEnd) {
        // Get the value before and after the cursor position
        const valueBeforeCursor = equation.value.substring(
          0,
          originalCursorPosition
        );
        const valueAfterCursor = equation.value.substring(
          originalCursorPosition
        );

        // Replace the '#' symbol with an empty string
        const insertedValue = target.getAttribute("data-insert");
        const updatedValue =
          valueBeforeCursor + insertedValue.replace(/#/, "") + valueAfterCursor;

        // Find the position of '#' within the inserted text
        const hashPosition =
          valueBeforeCursor.length + insertedValue.indexOf("#");

        // Update the input value
        equation.value = updatedValue;

        // Set the cursor position to the position of '#' within the inserted text
        equation.selectionStart = hashPosition;
        equation.selectionEnd = hashPosition;
      } else {
        const originalEndCursor = equation.selectionEnd;

        // Get the value before and after the cursor position
        const valueBeforeCursor = equation.value.substring(
          0,
          originalCursorPosition
        );
        const valueInCursor = equation.value.substring(
          originalCursorPosition,
          originalEndCursor
        )
        const valueAfterCursor = equation.value.substring(
          originalEndCursor
        );

        // Replace the '#' symbol with an empty string
        const insertedValue = target.getAttribute("data-insert");
        const updatedValue =
          valueBeforeCursor + insertedValue.replace(/#/, valueInCursor) + valueAfterCursor;

        // Find the position of '#' within the inserted text
        const hashPosition =
          valueBeforeCursor.length + insertedValue.indexOf("#");

        // Update the input value
        equation.value = updatedValue;

        // Set the cursor position to the position of '#' within the inserted text
        equation.selectionStart = hashPosition;
        equation.selectionEnd = hashPosition+valueInCursor.length;
      }

      equation.focus();

      result.innerHTML = "`" + equation.value + "`";
      MathJax.typesetPromise();
    }
  } catch (error) { }

  //event.stopPropagation();
});

// Custom commands for buttons

const answer = document.getElementById("answer");
const history = document.querySelector(".history");

const btn_result = document.getElementById("btn_result");
const btn_remove = document.getElementById("btn_remove");
const btn_delete = document.getElementById("btn_delete");
const btn_percent = document.getElementById("btn_percent");
const btn_2nd = document.getElementById("btn_2nd");

// Encode a string before storing in localStorage
function encodeAndStore(key, value) {
  const encodedValue = encodeURIComponent(value);
  localStorage.setItem(key, encodedValue);
}

// Retrieve and decode a string from localStorage
function retrieveAndDecode(key) {
  const encodedValue = localStorage.getItem(key);
  if (encodedValue) {
    return decodeURIComponent(encodedValue);
  }
  return null;
}

function find_result() {
  try {
    if (equation.value === "") {
      return;
    }
    answer.innerHTML = "`=" + math.evaluate(equation.value) + "`";
    if (
      math.evaluate(equation.value) === Infinity ||
      math.evaluate(equation.value) === -Infinity
    ) {
      answer.innerHTML = "`=`" + math.evaluate(equation.value);
    }
    let historyElement = document.createElement("div");
    historyElement.classList.add("history-element");
    let historyEquation = document.createElement("p");
    historyEquation.classList.add("history-equation");
    historyEquation.innerHTML = "`" + equation.value + "`";
    let historyResult = document.createElement("p");
    historyResult.classList.add("history-result");
    historyResult.innerHTML = "`=" + math.evaluate(equation.value) + "`";

    historyElement.appendChild(historyEquation);
    historyElement.appendChild(historyResult);
    history.appendChild(historyElement);
    history.scrollTop = history.scrollHeight;

    encodeAndStore("history", history.innerHTML);

    MathJax.typesetPromise();
  } catch (error) {
    answer.innerHTML = "Error: " + error.message + "";
    console.error(error);
  }
}

btn_result.addEventListener("click", (event) => {
  find_result();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    find_result();
  }
});

btn_remove.addEventListener("click", (event) => {
  const originalCursorPosition = equation.selectionStart;
  // Check if there is a selection
  if (equation.selectionStart === equation.selectionEnd) {
    console.log("yes");
    // Remove the character before the selection
    var inputValue = equation.value;
    var newValue =
      inputValue.substring(0, equation.selectionStart - 1) +
      inputValue.substring(equation.selectionEnd);

    // Update the input value and prevent the default behavior of the Backspace key
    equation.value = newValue;
    equation.focus();
    event.preventDefault();

    // Set the selection position after the removed character
    equation.setSelectionRange(
      originalCursorPosition - 1,
      originalCursorPosition - 1
    );
  }
  equation.focus();

  result.innerHTML = "`" + equation.value + "`";
  MathJax.typesetPromise();
});

btn_delete.addEventListener("click", (event) => {
  equation.value = "";
  equation.focus();

  result.innerHTML = "";
});

function findNumber(str, index) {
  let start = index;
  let end = index;
  let currentChar;

  // Start searching towards the left
  while (start >= 0) {
    currentChar = str[start];

    if (!isNaN(currentChar)) {
      start--;
    } else {
      if (currentChar === "." || currentChar === "e" || currentChar === "-") {
        start--;
        continue;
      }
      break;
    }
  }

  // Start searching towards the right
  while (end < str.length) {
    currentChar = str[end];

    if (!isNaN(currentChar)) {
      end++;
    } else {
      break;
    }
  }

  // Adjust start and end indices to represent the valid number
  start++;
  end--;

  // Extract the found number from the string
  const foundNumber = str.substring(start, end + 1);

  return { startIndex: start, endIndex: end, number: foundNumber };
}

btn_percent.addEventListener("click", (event) => {
  const originalCursorPosition = equation.selectionStart;

  console.log(originalCursorPosition);
  let number_found = findNumber(equation.value, originalCursorPosition - 1);

  if (number_found.number === "") {
    return;
  }

  console.log(number_found);
  let new_value =
    equation.value.substring(0, number_found.startIndex) +
    math.evaluate(number_found.number + "/100") +
    equation.value.substring(number_found.endIndex + 1);
  console.log(equation.value.substring(0, number_found.startIndex));
  console.log(math.evaluate(number_found.number + "/100"));
  console.log(equation.value.substring(number_found.endIndex + 1));
  equation.value = new_value;
  // place selection after the number
  equation.selectionStart =
    number_found.startIndex +
    math.evaluate(number_found.number + "/100").toString().length;
  equation.selectionEnd =
    number_found.startIndex +
    math.evaluate(number_found.number + "/100").toString().length;
  console.log(math.evaluate(number_found.number + "/100"));
  equation.focus();

  result.innerHTML = "`" + equation.value + "`";
  MathJax.typesetPromise();
});

btn_2nd.addEventListener("click", (event) => {
  let sinf = document.getElementById("sin");
  let cosf = document.getElementById("cos");
  let tanf = document.getElementById("tan");
  let cotf = document.getElementById("cot");

  if (inverseFunctions) {
    inverseFunctions = false;

    sinf.innerHTML = "`sin`";
    cosf.innerHTML = "`cos`";
    tanf.innerHTML = "`tan`";
    cotf.innerHTML = "`cot`";

    //change data-insert
    sinf.dataset.insert = "sin(#)";
    cosf.dataset.insert = "cos(#)";
    tanf.dataset.insert = "tan(#)";
    cotf.dataset.insert = "cot(#)";
  } else {
    inverseFunctions = true;

    sinf.innerHTML = "`sin^-1`";
    cosf.innerHTML = "`cos^-1`";
    tanf.innerHTML = "`tan^-1`";
    cotf.innerHTML = "`cot^-1`";

    //change data-insert
    sinf.dataset.insert = "asin(#)";
    cosf.dataset.insert = "acos(#)";
    tanf.dataset.insert = "atan(#)";
    cotf.dataset.insert = "acot(#)";
  }

  MathJax.typesetPromise();
});

if (localStorage.getItem("history") !== null) {
  history.innerHTML = retrieveAndDecode("history");
  history.scrollTop = history.scrollHeight;
}

let btn_clearhistory = document.querySelector(".clear-history");

btn_clearhistory.addEventListener("click", (event) => {
  localStorage.setItem("history", "");
  history.innerHTML = "";
});
