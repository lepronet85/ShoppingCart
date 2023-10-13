function ratings(nb) {
  let rateHTML = "";
  for (let i = 0; i < 5; i++) {
    if (i < nb)
      rateHTML += `<svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            class="w-6 h-6 fill-yellow-300 cursor-pointer"
            onclick="onUpdateRating(this, ${i + 1})"
          >
            <path
              fill-rule="evenodd"
              d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
              clip-rule="evenodd"
            />
          </svg>`;
    else
      rateHTML += `<svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6 cursor-pointer"
            onclick="onUpdateRating(this, ${i + 1})"
        >
            <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
            />
        </svg>`;
  }

  return rateHTML;
}

function onUpdateRating(_this, position) {
  _this.parentNode.innerHTML = ratings(position);
}

function showItemInCarts() {
  let storedData = [];

  if (localStorage.getItem("productsData"))
    storedData = JSON.parse(localStorage.getItem("productsData"));

  const cartItemsTable = document.querySelector("#cart-items-container table");

  cartItemsTable.innerHTML = "";

  let totalPrice = 0;
  let itemsCount = 0;

  storedData.forEach((product) => {
    totalPrice += product.price;
    itemsCount++;
    cartItemsTable.innerHTML += `
    <tr>
      <td class="w-1/4">
        <img
          class="w-20 h-20 m-auto"
          src="${product.image}"
          alt="${product.name}"
        />
      </td>
      <td class="text-center w-1/4">
        <div class="flex flex-col">
          <span class="font-bold">${product.name}</span>
          <span class="text-xs">$${(product.price / product.qty).toFixed(
            2
          )}</span>
        </div>
      </td>
      <td class="w-1/4">
        <div class="flex justify-center items-center">
          <span
            class="bg-gray-200 flex items-center justify-center rounded-full w-6 h-6 shadow-sm cursor-pointer select-none"
            onclick="minus(this, '${product.name}')"
            ><span class="material-symbols-outlined text-sm">
              remove
            </span></span
          >
          <input
            type="text"
            class="w-8 border outline-none mx-2 text-center text-sm font-semibold"
            value="${product.qty}"
            onchange="handleQtyChange(this, '${product.name}')"
          />
          <span
            class="bg-gray-200 flex items-center justify-center rounded-full w-6 h-6 shadow-sm cursor-pointer select-none"
            onclick="plus(this, '${product.name}')"
            ><span class="material-symbols-outlined text-sm" >
              add
            </span></span
          >
        </div>
      </td>
      <td class="w-1/4">
        <div class="flex flex-col items-end pr-2">
          <span class="font-bold">$${product.price.toFixed(2)}</span>
          <button onclick="removeProduct('${
            product.name
          }')" class="text-xs underline text-red-600 font-bold"
            >Supprimer</button
          >
        </div>
      </td>
    </tr>`;
  });

  document.getElementById("total-price").textContent = `$${totalPrice.toFixed(
    2
  )}`;
  document.getElementById("items-number").textContent = `${itemsCount} produit${
    itemsCount > 1 ? "s" : ""
  }`;
}

function removeAllFromCart() {
  localStorage.removeItem("productsData");
  showItemInCarts();
}

function handleQtyChange(_this, productName) {
  let inputValue = parseInt(_this.value ? _this.value : 1);

  if (inputValue > 0) {
    let storedData = [];

    if (localStorage.getItem("productsData"))
      storedData = JSON.parse(localStorage.getItem("productsData"));

    const product = []
      .concat(...data)
      .find((product) => product.name === productName);

    let foundItemIndex = 0;
    const foundItem = storedData.find((product, index) => {
      foundItemIndex = index;
      return product.name === productName;
    });

    if (foundItem) {
      storedData[foundItemIndex] = {
        ...foundItem,
        qty: inputValue,
        price: product.price * inputValue,
      };
    }

    localStorage.setItem("productsData", JSON.stringify(storedData));
  }

  showItemInCarts();
}

function minus(_this, productName) {
  let inputValue = parseInt(
    _this.parentNode.children[1].value ? _this.parentNode.children[1].value : 1
  );

  if (inputValue > 1) {
    inputValue--;
    let storedData = [];

    if (localStorage.getItem("productsData"))
      storedData = JSON.parse(localStorage.getItem("productsData"));

    const product = []
      .concat(...data)
      .find((product) => product.name === productName);

    let foundItemIndex = 0;
    const foundItem = storedData.find((product, index) => {
      foundItemIndex = index;
      return product.name === productName;
    });

    if (foundItem) {
      const qty = foundItem.qty - 1;
      storedData[foundItemIndex] = {
        ...foundItem,
        qty,
        price: product.price * qty,
      };
    }

    _this.parentNode.children[1].value = inputValue;

    localStorage.setItem("productsData", JSON.stringify(storedData));
  }

  showItemInCarts();
}

function plus(_this, productName) {
  let storedData = [];

  if (localStorage.getItem("productsData"))
    storedData = JSON.parse(localStorage.getItem("productsData"));

  const product = []
    .concat(...data)
    .find((product) => product.name === productName);

  let foundItemIndex = 0;
  const foundItem = storedData.find((product, index) => {
    foundItemIndex = index;
    return product.name === productName;
  });

  if (foundItem) {
    const qty = foundItem.qty + 1;
    storedData[foundItemIndex] = {
      ...foundItem,
      qty,
      price: product.price * qty,
    };
  }

  let inputValue = parseInt(
    _this.parentNode.children[1].value ? _this.parentNode.children[1].value : 1
  );

  inputValue++;
  _this.parentNode.children[1].value = inputValue;

  localStorage.setItem("productsData", JSON.stringify(storedData));

  showItemInCarts();
}

function addProduct(productName) {
  let storedData = [];

  if (localStorage.getItem("productsData"))
    storedData = JSON.parse(localStorage.getItem("productsData"));

  const product = []
    .concat(...data)
    .find((product) => product.name === productName);

  let foundItemIndex = 0;
  const foundItem = storedData.find((product, index) => {
    foundItemIndex = index;
    return product.name === productName;
  });

  if (!foundItem) {
    storedData.push({
      id: storedData.length + 1,
      qty: 1,
      ...product,
    });
  } else {
    const qty = foundItem.qty + 1;
    storedData[foundItemIndex] = {
      ...foundItem,
      qty,
      price: product.price * qty,
    };
  }

  localStorage.setItem("productsData", JSON.stringify(storedData));

  // console.log(storedData);
}

function removeProduct(productName) {
  let storedData = [];

  if (localStorage.getItem("productsData"))
    storedData = JSON.parse(localStorage.getItem("productsData"));

  const filtredProducts = storedData.filter(
    (product) => product.name !== productName
  );

  localStorage.setItem("productsData", JSON.stringify(filtredProducts));

  showItemInCarts();
}

function displayItems(data) {
  const itemsContainer = document.getElementById("items-container");

  itemsContainer.innerHTML = "";

  for (let i = 0; i < data.length; i++) {
    const row = document.createElement("div");
    row.className = "flex items-center mt-6";

    for (let j = 0; j < data[i].length; j++) {
      row.innerHTML += `
      <div class="w-3/12 mr-6 rounded-md overflow-hidden shadow-md h-60 relative">
      <div class="w-100 h-full overflow-hidden">
        <img
          class="w-full h-full hover:scale-125 transition-all duration-700"
          src="${data[i][j].image}"
          alt="${data[i][j].name}"
        />
      </div>
      <div
        class="w-full bottom-0 absolute"
        style="background-color: rgba(0, 0, 0, 0.7)"
      >
        <div class="text-white">
          <div class="flex items-center justify-between p-1">
            <span class="font-bold">${data[i][j].name}</span>
            <span class="italic">$${data[i][j].price}</span>
          </div>
          <div class="flex items-center flex-1 justify-center my-1">
            ${ratings(data[i][j].rating)}
          </div>
          <button
            class="bg-pink-600 w-full py-1 uppercase text-sm font-bold flex items-center justify-center border border-white"
            onclick="addProduct('${data[i][j].name}')"
            >
            Ajouter au panier
            <span
              class="material-symbols-outlined mr-2 font-light text-2xl transition-colors mx-2"
            >
              shopping_bag
            </span>
          </button>
        </div>
      </div>
      `;
    }

    itemsContainer.appendChild(row);
  }
}

let filters = [];

const filtersMElements = [
  {
    element: document.getElementById("m-maquillage-filter"),
    filter: "Maquillage",
  },
  {
    element: document.getElementById("m-cheveux-filter"),
    filter: "Cheveux",
  },
  {
    element: document.getElementById("m-visage-filter"),
    filter: "Visage",
  },
  {
    element: document.getElementById("m-corps-filter"),
    filter: "Corps",
  },
];

filtersMElements.forEach((filterElement) => {
  let isSelected = false;
  filterElement.element.addEventListener("click", function () {
    isSelected = !isSelected;

    if (isSelected) {
      this.classList.remove("text-black", "bg-gray-100");
      this.classList.add("bg-black", "text-white");

      if (!filters.includes(filterElement.filter))
        filters.push(filterElement.filter);
    } else {
      this.classList.add("text-black", "bg-gray-100");
      this.classList.remove("bg-black", "text-white");

      filters = filters.filter((filter) => filterElement.filter !== filter);
    }

    let filtredData = [].concat(...data);

    filtredData = filtredData.filter((item) => filters.includes(item.category));
    filtredData = chunkArray(filtredData, 4);

    filtredData = filters.length > 0 ? filtredData : data;

    console.log(filtredData);

    displayItems(filtredData);
  });
});

const search = document.getElementById("search-bar");

search.addEventListener("input", function () {
  let filtredData = [].concat(...data);
  const searchValue = this.value.trim();

  filtredData =
    filtredData.filter(
      (item) =>
        item.name.toLowerCase().includes(searchValue) ||
        item.category.toLowerCase().includes(searchValue)
    ) || data;
  filtredData = chunkArray(filtredData, 4);
  filtredData = searchValue.toLowerCase() === "all" ? data : filtredData;

  isSelected = false;
  filtersMElements.forEach((filterElement) => {
    if (isSelected) {
      filterElement.element.classList.remove("text-black", "bg-gray-100");
      filterElement.element.classList.add("bg-black", "text-white");
    } else {
      filterElement.element.classList.add("text-black", "bg-gray-100");
      filterElement.element.classList.remove("bg-black", "text-white");
    }
  });

  filters = [];

  displayItems(filtredData);
});

displayItems(data);

const seeCartBtn = document.getElementById("see-cart");
const cartModalContainer = document.getElementById("cart-modal-container");

seeCartBtn.addEventListener("click", (e) => {
  e.preventDefault();
  cartModalContainer.classList.remove("hidden");
  cartModalContainer.classList.add("flex");

  document.body.style.overflow = "hidden";

  showItemInCarts();
});

cartModalContainer.addEventListener("click", function (e) {
  if (e.target.id === this.id) {
    cartModalContainer.classList.add("hidden");
    cartModalContainer.classList.remove("flex");

    document.body.style.overflow = "auto";
  }
});

const removeAll = document.getElementById("remove-all");

removeAll.addEventListener("click", (e) => {
  e.preventDefault();
  removeAllFromCart();
});
