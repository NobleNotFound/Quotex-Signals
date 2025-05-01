// API Key for Finnhub
const FINNHUB_API_KEY = 'd09q2j1r01qus8ren8sgd09q2j1r01qus8ren8t0'; // Your provided Finnhub API key

// Global variables
const $app = document.querySelector('.app');
const $currency = $app.querySelector('.currency');
const $currencyValue = $currency.querySelector('.currency-value');
const $blockSetTime = $app.querySelector('.set-time');
const $timeValue = $blockSetTime.querySelector('.time_val');
const $timeItems = $blockSetTime.querySelector('.set-time-items');
const $blockForecast = $app.querySelector('.forecast');
const $blockForecastValue = $blockForecast.querySelector('.value');
const $btnAction = $app.querySelector('.btn.action');
const $btnActionText = $btnAction.querySelector('.text');

const currency = ["AUD/USD", "EUR/USD", "GBP/JPY", "AUD/JPY", "USD/JPY"];
let currentTime = getCurrentTime();
let sessionCode = localStorage.getItem('sessionCode') || '';

// Add available currencies to dropdown
currency.map(item => {
    let div = document.createElement('div');
    div.classList.add('item');
    div.textContent = item;
    $currency.querySelector('.currency-container').appendChild(div);
});

// Set time options
setTime();

window.addEventListener('click', (e) => {
    if (!$currency.querySelector('.currency-container').contains(e.target) && !$currency.contains(e.target)) {
        $currency.querySelector('.currency-container').classList.remove('windowShow');
    }

    if (!$timeItems.contains(e.target) && !$blockSetTime.contains(e.target)) {
        $timeItems.classList.remove('windowShow');
    }
});

$currency.addEventListener('click', () => {
    $currency.querySelector('.currency-container').classList.add('windowShow');
});

$currency.querySelector('.currency-container').querySelectorAll('.item').forEach(item => {
    item.addEventListener('click', (e) => {
        let val = item.textContent;
        $currencyValue.textContent = val;
        $currency.querySelector('.currency-container').classList.remove('windowShow');
    });
});

$blockSetTime.addEventListener('click', () => {
    $timeItems.classList.add('windowShow');
});

// Handle button action click
$btnAction.addEventListener('click', () => {
    let status = $btnAction.dataset.initStatus;
    if (status === 'loading') return;

    $btnAction.dataset.initStatus = 'loading';
    $blockForecastValue.innerHTML = '<div class="spinner"></div>';
    $blockForecast.classList.remove('down', 'up');

    // Fetch real signal from Finnhub API
    fetchSignalFromAPI();
    setTimeout(() => {
        setTimeOut(1);
    }, 1000);
});

// Utility functions
function getCurrentTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
}

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

function setTimeOut(countMinutes = 1) {
    let startTime = 0;
    let endTime = countMinutes * 60;
    let time = endTime;

    const interval = setInterval(() => {
        startTime += 1;
        if (startTime === endTime) {
            $btnAction.classList.remove('loading');
            $btnActionText.textContent = 'Next signal';
            $btnAction.dataset.initStatus = 'wait';
            clearInterval(interval);
        } else {
            time -= 1;
            $btnActionText.textContent = timeView(time);
        }
    }, 1000);
}

function timeView(countSecond) {
    const minutes = Math.floor(countSecond / 60);
    return minutes > 0 ? `${minutes}:${countSecond - (minutes * 60)}` : `0:${countSecond}`;
}

function getRandomForecast() {
    return Math.random() < 0.5 ? "DOWN" : "UP";
}

function fetchSignalFromAPI() {
    const pair = $currencyValue.textContent;

    // Example API endpoint for Finnhub (you should modify the endpoint according to the actual data you need)
    const apiUrl = `https://finnhub.io/api/v1/indicator?symbol=${pair}&resolution=1&from=${getUnixTime(0)}&to=${getUnixTime(1)}&token=${FINNHUB_API_KEY}`;
    
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            // Use the data to decide the forecast direction
            const forecast = analyzeDataForSignal(data);
            $blockForecastValue.innerHTML = forecast;

            if (forecast === 'DOWN') {
                $blockForecast.classList.add('down');
            } else {
                $blockForecast.classList.add('up');
            }
        })
        .catch(err => {
            console.error("Error fetching API: ", err);
            $blockForecastValue.innerHTML = "ERROR";
        });
}

function getUnixTime(offset = 0) {
    const now = new Date();
    now.setSeconds(now.getSeconds() + offset);
    return Math.floor(now.getTime() / 1000);
}

// Analyze the data for a real signal (for example, based on indicators or price movement)
function analyzeDataForSignal(data) {
    // Here, you can analyze the data with more complex logic, such as:
    // 1. Moving averages (SMA, EMA)
    // 2. RSI (Relative Strength Index)
    // 3. MACD (Moving Average Convergence Divergence)
    // 4. Candlestick patterns
    // For now, it's just a simple analysis.

    // Example: If closing price is higher than opening price, it's an "UP" signal
    if (data.close > data.open) {
        return "UP";
    } else {
        return "DOWN";
    }
}

// Start the real-time signal generation
simulateRealSignal();

function simulateRealSignal() {
    setInterval(() => {
        fetchSignalFromAPI();
    }, 60000); // 1-minute interval to fetch real signals
}
