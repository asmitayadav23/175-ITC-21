const express = require('express');
const app = express();
const port = 9876;

const WINDOW_SIZE = 10;
let windows = {};


function fetchNumbersFromServer(numberId) {
    if (numberId === 'e') {
        return [2, 4, 6, 8];
    }

    return [];
}


function processRequest(numberId) {
    const numbers = fetchNumbersFromServer(numberId);
    let window = windows[numberId] || [];

    const response = {
        numbers: numbers,
        windowPrevState: [...window],
    };

    numbers.forEach((number) => {
        if (window.length >= WINDOW_SIZE) {
            window.shift();
        }
        window.push(number);
    });

    const avg = window.reduce((acc, num) => acc + num, 0) / window.length;

    response.windowCurrState = window;
    response.avg = avg;

    windows[numberId] = window;

    return response;
}


app.get('/numbers/:numberId', (req, res) => {
    const numberId = req.params.numberId;
    const response = processRequest(numberId);
    res.json(response);
});


app.listen(port, () => {
    console.log('Average Calculator microservice running on port ${port}');
});
