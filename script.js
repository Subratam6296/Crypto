document.addEventListener('DOMContentLoaded', async function () {
    const searchInput = document.getElementById('searchInput');
    const sortMarketCapBtn = document.getElementById('sortMarketCapBtn');
    const sortPercentageChangeBtn = document.getElementById('sortPercentageChangeBtn');
    const cryptoData = document.getElementById('cryptoData');
    const sortingInfo = document.getElementById('sortingInfo');

    let originalData = [];
    let lastSortingCriteria = '';

    async function fetchData() {
        try {
            const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false');
            const data = await response.json();
            originalData = data;
            renderData(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    function renderData(data) {
        cryptoData.innerHTML = '';
        data.forEach(coin => {
            const row = document.createElement('tr');
            const percentageChange = coin.price_change_percentage_24h;
            const color = percentageChange >= 0 ? 'green' : 'red';
            row.innerHTML = `
                <td><img src="${coin.image}" alt="${coin.name}" width="50"></td>
                <td>${coin.name}</td>
                <td>${coin.symbol.toUpperCase()}</td>
                <td>$${coin.current_price}</td>
                <td>$${coin.total_volume}</td>
                <td>$${coin.market_cap}</td>
                <td style="color: ${color}">${percentageChange.toFixed(2)}%</td>
            `;
            cryptoData.appendChild(row);
        });
    }

    function updateSortingInfo(criteria) {
        sortingInfo.textContent = `Sorted by ${criteria}`;
    }

    function search() {
        const searchValue = searchInput.value.trim().toLowerCase();
        const filteredData = originalData.filter(coin => coin.name.toLowerCase().includes(searchValue) || coin.symbol.toLowerCase().includes(searchValue));
        renderData(filteredData);
        updateSortingInfo('Search');
    }

    function sortMarketCap() {
        const sortedData = originalData.slice().sort((a, b) => b.market_cap - a.market_cap);
        renderData(sortedData);
        updateSortingInfo('Market Cap');
    }

    function sortPercentageChange() {
        const sortedData = originalData.slice().sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h);
        renderData(sortedData);
        updateSortingInfo('% Change (24h)');
    }

    searchInput.addEventListener('input', search);
    sortMarketCapBtn.addEventListener('click', sortMarketCap);
    sortPercentageChangeBtn.addEventListener('click', sortPercentageChange);

    await fetchData();
});

  