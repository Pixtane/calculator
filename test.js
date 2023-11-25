function getCurrentUnixTime() {
  return Math.floor(Date.now() / 1000);
}

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
  
  // Example usage
  const inputString = "abb6064904*yu";
  const startIndex = 4;
  
  const result = findNumber(inputString, startIndex);
  console.log(result);

console.log(getCurrentUnixTime());

const fs = require('fs');

// Read the content of exchange_rates.json
const exchangeRatesPath = './private/exchange_rates.json';
const exchangeRatesContent = fs.readFileSync(exchangeRatesPath, 'utf-8');
const exchangeRates = JSON.parse(exchangeRatesContent);

// Read the content of currencies.json
const currenciesPath = './public/assets/json/currencies.json';
const currenciesContent = fs.readFileSync(currenciesPath, 'utf-8');
const currencies = JSON.parse(currenciesContent);

let count = 0;
for (const currency in currencies) {
  console.log(currency, count);
  count++;
}

// Get the rates from exchange_rates
const rates = exchangeRates.rates;

// Check if each currency from currencies exists in rates
if (Array.isArray(currencies)) {
  for (const currency of currencies) {
    if (!rates.hasOwnProperty(currency)) {
      console.log(`Currency missing: ${currency}`);
    }
  }
} else if (typeof currencies === 'object') {
  for (const currency in currencies) {
    if (currencies.hasOwnProperty(currency) && !rates.hasOwnProperty(currency)) {
      console.log(`Currency missing: ${currency}`);
    }
  }
} else {
  console.error('Invalid format for currencies.json');
}
