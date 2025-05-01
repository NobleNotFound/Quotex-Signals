// Fetch the necessary elements
const $app = document.querySelector('.app');
const $currency = $app.querySelector('.currency');
const $currencyContainer = $currency.querySelector('.currency-container');
const $currencyValue = $currency.querySelector('.currency-value');
const $blockSetTime = $app.querySelector('.set-time');
const $timeValue = $blockSetTime.querySelector('.time-val');
const $timeItems = $blockSetTime.querySelector('.set-time-items');
const $blockForecast = $app.querySelector('.forecast');
const $blockForecastValue = $blockForecast.querySelector('.value');
const $btnAction = $app.querySelector('.btn.action');
const $btnActionText = $btnAction.querySelector('.text');

// Currency pairs and time interval
const currency = ["AUD/CAD", "GBP/JPY", "CHF/JPY", "AUD/USD", "EUR/CAD", "USD/JPY", "EUR/USD"];
let currentCurrency = "EUR/USD";
let sessionCode = localStorage.getItem('sessionCode') ? localStorage.getItem('sessionCode') : '';

// Set up the UI with initial values
$currencyValue.textContent = currency[0];
currency.forEach(item => {
    let div = document.createElement('div');
    div.classList.add('item');
    div.textContent = item;
    $currencyContainer.appendChild(div);
});

setTime();

// Click listener for currency pair selection
$currency.addEventListener('click', () => {
    $currencyContainer.classList.toggle('windowShow');
});
$currencyContainer.querySelectorAll('.item').forEach(item => {
    item.addEventListener('click', (e) => {
        e.stopPropagation();
        $currencyValue.textContent = item.textContent;
        currentCurrency = item.textContent;
        $currencyContainer.classList.remove('windowShow');
    });
});

// Click listener for time interval selection
$blockSetTime.addEventListener('click', () => {
    $timeItems.classList.toggle('windowShow');
});

// Initialize the time items
timeItemsActivate();

// Button click listener for fetching signals
$btnAction.addEventListener('click', () => {
    $btnActionText.textContent = "Loading...";
    getSignal(currentCurrency);  // Fetch the signal based on the current currency pair
    $blockForecastValue.innerHTML = '<div class="spinner"></div>';  // Show loading indicator
});

// API Key and endpoint for Finnhub (replace 'YOUR_API_KEY' with actual key)
const FINNHUB_API_KEY = 'YOUR_API_KEY';  // Replace with your Finnhub API Key
const BASE_URL = 'https://finnhub.io/api/v1/quote';

// Function to fetch the latest signal (BUY/SELL) based on real-time data
function getSignal(currencyPair) {
    // Use Finnhub API to fetch stock/forex data (example with EUR/USD)
    fetch(`${BASE_URL}?symbol=${currencyPair}&token=${FINNHUB_API_KEY}`)
        .then(response => response.json())
        .then(data => {
            // Analyze the fetched data for signals
            const signal = analyzeDataForSignal(data);
            // Update the forecast section
            displaySignal(signal);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            $blockForecastValue.innerHTML = 'Error fetching data';
        });
}

// Function to analyze data and determine the signal (up or down)
function analyzeDataForSignal(data) {
    // Use the fetched data to determine whether the trend is UP or DOWN
    // Example: If the current price is higher than the previous close, we may consider it as 'UP' signal.
    const { c: currentPrice, pc: previousClose } = data;  // 'c' is current price, 'pc' is previous close
    if (currentPrice > previousClose) {
        return "UP";
    } else if (currentPrice < previousClose) {
        return "DOWN";
    } else {
        return "NEUTRAL";  // In case the market is flat
    }
}

// Function to update the UI with the signal
function displaySignal(signal) {
    $blockForecastValue.textContent = signal;
    if (signal === "UP") {
        $blockForecast.classList.add('up');
        $blockForecast.classList.remove('down');
    } else if (signal === "DOWN") {
        $blockForecast.classList.add('down');
        $blockForecast.classList.remove('up');
    } else {
        $blockForecast.classList.remove('up', 'down');
    }

    // Change the button text
    $btnActionText.textContent = 'Next Signal';
}

// Time-related functions
function setTime() {
    $timeItems.innerHTML = '';
    $timeValue.textContent = '1 Min';

    for (let i = 1; i <= 1; i++) {
        let div = document.createElement('div');
        div.classList.add('item');
        div.textContent = `${i} Min`;
        $timeItems.appendChild(div);
    }
}

function timeItemsActivate() {
    $timeItems.querySelectorAll('.item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            $timeValue.textContent = item.textContent;
            $timeItems.classList.remove('windowShow');
        });
    });
}
