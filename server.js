const express = require("express");
const app = express();

app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/calculator.html")
})
app.get("/calculator", (req, res) => {
    res.sendFile(__dirname + "/public/calculator.html")
})
app.get("/currency-exchange", (req, res) => {
    res.sendFile(__dirname + "/public/currency-exchange.html")
})
app.get("/data-format", (req, res) => {
    res.sendFile(__dirname + "/public/data-format.html")
})
app.get("/temperature-convert", (req, res) => {
    res.sendFile(__dirname + "/public/temperature-convert.html")
})
app.get("/speed-convert", (req, res) => {
    res.sendFile(__dirname + "/public/speed-convert.html")
})
app.get("/area-convert", (req, res) => {
    res.sendFile(__dirname + "/public/area-convert.html")
})
app.get("/time-convert", (req, res) => {
    res.sendFile(__dirname + "/public/time-convert.html")
})
app.get("/data-convert", (req, res) => {
    res.sendFile(__dirname + "/public/data-convert.html")
})
app.get("/menu", (req, res) => {
    res.sendFile(__dirname + "/public/menu.html")
})

app.get('/exchange-rates', (req, res) => {
    const rates = require("./private/exchange_rates.json");
    console.log(Math.floor(Date.now() / 1000) - rates["time_last_update_unix"]);
    if (Math.floor(Date.now() / 1000) - rates["time_last_update_unix"] > 86000) {
        console.log("Update data");
        // get data from "https://open.er-api.com/v6/latest/USD" and write it in "./private/exchange_rates.json"
        async function get(URL) {
            const response = await fetch(URL);
        
            return response;
        }
        
        get('https://open.er-api.com/v6/latest/USD')
        .then(data => data.json())
        .then(data => {
            const fs = require('fs');
            data["time_last_update_unix"] = Math.floor(Date.now() / 1000);

            // Convert the data object to a JSON string
            const jsonData = JSON.stringify(data, null, 2);

            // Specify the file path
            const filePath = './private/exchange_rates.json';

            // Write the JSON data to the file
            fs.writeFile(filePath, jsonData, 'utf8', (err) => {
            if (err) {
                console.error('Error writing JSON file:', err);
            } else {
                console.log('JSON file has been written successfully!');
            }
            });
            
        }).catch(err => {
            console.log(err);
            res.send(err);
        })
    }

    res.sendFile(__dirname + "/private/exchange_rates.json");
});

app.listen(8080,'127.0.0.1' || 'localhost', () => {
    console.log("Server listening on port http://localhost:8080");
})