// API request options

const options = {
  method: "GET",

  headers: {
    accept: "application/json",
    "x-cg-demo-api-key": "CG-mDVVqLm5xBDjvcVq523LnAmB",
  },
};

//state variable
let coins = [];
let currentPage = 1;

const fetchCoins = async (page = 1) => {
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=25&page=${page}`,
      options
    );
    coins = await response.json();
  } catch (err) {
    console.error(err);
  }

  return coins;
};

const getFavourites = () =>
  JSON.parse(localStorage.getItem("favourites")) || [];

const renderCoinRow = (coin, index, start, favourites) => {
  const isFavourite = favourites.includes(coin.id);

  const row = document.createElement("tr");

  row.innerHTML = `
    <td>${start + index}</td>
    <td><img src="${coin.image}" alt="${
    coin.name
  }" width="24" height="24"/> </td>
    <td> ${coin.name} </td>
    <td> ${coin.current_price.toLocaleString()} </td>
    <td> ${coin.total_volume.toLocaleString()} </td>
    <td> ${coin.market_cap.toLocaleString()} </td>
    <td>
    <i class="fa-solid fa-star ${isFavourite ? "favourite" : ""}" data-id="${
    coin.id
  }"> </i>
    </td>    
    `;

  return row;
};

const renderCoins = (coinsToDisplay, page, itemsPerPage) => {
  const start = (page - 1) * itemsPerPage + 1;

  const favourite = getFavourites();

  const tableBody = document.querySelector("#crypto-table tbody");

  if (!tableBody) {
    console.error("Table body element not found");

    return;
  }

  tableBody.innerHTML = ""; //clearing existing rows before rendering

  coinsToDisplay.forEach((coin, index) => {
    const row = renderCoinRow(coin, index, start, favourite);

    tableBody.appendChild(row);
  });
};

const initializePage = async () => {
  coins = await fetchCoins(currentPage);

  if (coins.length === 0) {
    console.error("No coin data fetched");

    return;
  }

  renderCoins(coins, currentPage, 25);
};

document.addEventListener("DOMContentLoaded", initializePage);
