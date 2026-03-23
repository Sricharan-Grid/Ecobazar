//Rendering Products

import { errorHandler } from "./helper.js";
import { debuggerLog } from "./config.js";

const loadProducts = async (category, sorting, rating, searchValue) => {
  try {
    if (debuggerLog) {
      console.log(
        `Invoked Load loadProducts() category : ${category}, sorting : ${sorting}, rating : ${rating}, searchValue ${searchValue}`,
      );
    }

    const productsContainer = document.querySelector(".products__prods");

    //reading the Json
    const response = await fetch("productsData.json");
    const products = await response.json();

    let filteredProducts = [];

    // Filtering the Products Based on Categories
    filteredProducts = filterProducts(products, category, "category", "");

    //Sorting
    filteredProducts = sortProducts(filteredProducts, sorting);

    //Searching
    if (searchValue) {
      if (!filteredProducts.length)
        filteredProducts = searchProducts(products, searchValue);
      else filteredProducts = searchProducts(filteredProducts, searchValue);
    }

    // Filtering the Products Based on Ratings
    if (rating) {
      filteredProducts = filterProducts(
        filteredProducts,
        category,
        "rating",
        rating,
      );
      console.log("after Rating", filteredProducts);
    }

    //Rendering Products
    if (filteredProducts) renderProducts(filteredProducts, productsContainer);
  } catch (err) {
    errorHandler(err, "loadProducts()");
  }
};

//Rendering Products

const renderProducts = (filteredProducts, productsContainer) => {
  try {
    if (debuggerLog) {
      console.log(
        `Invoked renderProducts() filteredProducts : ${filteredProducts}, productsContainer : ${productsContainer}`,
      );
    }

    productsContainer.innerHTML = "";
    filteredProducts.forEach((cardElement) => {
      // prettier-ignore
      const {imageLink,availability,id,productName,rating,discountPrice,actualPrice} = cardElement;

      const cardHtml = `<div class="products__prods--card" data-id="${id}">
        <p class="stock product-card__stock ${availability.replaceAll(" ", "").toLowerCase() != "instock" ? "product-card__stock--" + availability.replaceAll(" ", "").toLowerCase() : "product-card__stock--hidden"}">            
        ${availability}
        </p>
          <img
            src="${imageLink}"
            alt="${productName}"
            class="product-card__img"
          />

          <div class="product-card__details">
            <div class="text">
              <p class="product-card__details--name">${productName}</p>
              <p class="product-card__details--price">&#8377; ${discountPrice} <del class='actualprice'>&#8377;${actualPrice}<span> </p>
              <p class="product-card__details--rating">
             <span class="star-gold">${"★".repeat(rating)}</span><span class="star-grey">${"★".repeat(5 - rating)}</span>
            </p>
            </div>
            <img
              src="../img/products/add-to-cart.png"
              alt="Add To Cart"
              class="product-card__details--cart icon"
            />
          </div>`;

      productsContainer.insertAdjacentHTML("beforeend", cardHtml);
    });
  } catch (err) {
    errorHandler(err, "renderProducts()");
  }
};

//Sorting

const sortProducts = (filteredProducts, sorting) => {
  try {
    if (debuggerLog) {
      console.log(
        `Invoked sortProducts() filteredProducts : ${filteredProducts}, sorting : ${sorting}`,
      );
    }

    filteredProducts?.sort((a, b) => {
      const nameA = a?.productName || a?.name || "";
      const nameB = b?.productName || b?.name || "";
      const ratingA = Number(a?.rating) || 0;
      const ratingB = Number(b?.rating) || 0;
      const pricingA = Number(a?.discountPrice) || 0;
      const pricingB = Number(b?.discountPrice) || 0;

      // Rating Sort
      if (sorting.includes("rating")) {
        if (sorting === "ratingHigh") return ratingB - ratingA;
        if (sorting === "ratingLow") return ratingA - ratingB;
        return nameA.localeCompare(nameB);
      }

      //Alphabetical Sort
      if (sorting === "asc") {
        return nameA.localeCompare(nameB);
      }
      if (sorting === "desc") {
        return nameB.localeCompare(nameA);
      }

      // Price Sort
      if (sorting.includes("price")) {
        if (sorting === "priceHigh") return pricingB - pricingA;
        if (sorting === "priceLow") return pricingA - pricingB;
        return nameA.localeCompare(nameB);
      }
    });

    return filteredProducts;
  } catch (err) {
    errorHandler(err, "sortProducts()");
  }
};

//Filtering

const filterProducts = (products, category, type, rating) => {
  try {
    if (debuggerLog) {
      console.log(
        `Invoked filterProducts() products : ${products}, category : ${category} , type :  ${type} , rating : ${rating}`,
      );
    }

    category?.toLowerCase()?.trim();
    type?.toLowerCase()?.trim() || "general";

    let filteredProducts = [];

    //Category Based Filtering

    if (type === "category") {
      filteredProducts =
        category === "all"
          ? [...products]
          : products?.filter(
              (product) => product?.category?.toLowerCase() === category,
            );
    }

    //Rating Based Filtering

    if (type === "rating") {
      filteredProducts = products?.filter(
        (product) =>
          product.rating == rating
        //  &&product.category.toLowerCase() === category,
      );
    }

    return filteredProducts;
  } catch (err) {
    errorHandler(err, "filterProducts()");
  }
};

//Searching

const searchProducts = (products, searchValue) => {
  try {
    if (debuggerLog) {
      console.log(
        `Invoked searchProducts() products : ${products}, searchValue : ${searchValue}`,
      );
    }

    return products.filter((product) =>
      product.productName.toLowerCase().trim().includes(searchValue),
    );
  } catch (err) {
    errorHandler(err, "searchProducts()");
  }
};

const filterEl = document.querySelector(".filter-options");
const sortEl = document.querySelector(".sort-options__dropdown");
const ratingEl = document.querySelector(".rating-options__dropdown");

let sortValue = "asc";

//Render Dropdowns

const renderDropdown = async (dropdownEl, sourceData) => {
  try {
    if (debuggerLog) {
      console.log(
        `Invoked renderDropdown() dropdownEl : ${dropdownEl}, sourceData : ${sourceData}`,
      );
    }

    //reading the Json
    const response = await fetch(sourceData);
    const categories = await response?.json();

    categories.forEach((e) => {
      const selectHtml = `<option value='${e.value}'>${e.displayName}</option>`;

      dropdownEl.insertAdjacentHTML("beforeend", selectHtml);
    });
  } catch (err) {
    errorHandler(err, "renderDropdown()");
  }
};

// On-loading Activities

document.addEventListener("DOMContentLoaded", () => {
  if (debuggerLog) {
    console.log(`Invoked Onload event listener`);
  }

  //Getting Query params for the category
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const category = urlParams?.get("category")?.toLowerCase()?.trim();
  const search = urlParams?.get("search")?.toLowerCase()?.trim();

  // Set dropdown values to match URL
  console.log("category", category);
  if (category) {
    filterEl.value = category;
  }
  document.querySelector(".sort-options").value = "asc";

  //Render Filter and Sort and Rating Dropdowns
  renderDropdown(filterEl, "categoriesData.json");
  renderDropdown(sortEl, "sortData.json");
  renderDropdown(ratingEl, "ratingData.json");
  loadProducts(category, "asc", "", search);

  filterEl.addEventListener("change", () => {
    const filterValue = filterEl.value;
    if (debuggerLog) {
      console.log(`Invoked filter onchange event filterValue : ${filterValue}`);
    }
    loadProducts(filterValue, sortEl.value);
  });

  sortEl.addEventListener("change", () => {
    sortValue = sortEl.value;
    if (debuggerLog) {
      console.log(`Invoked sort onchange event sortValue : ${sortValue}`);
    }
    loadProducts(filterEl.value, sortValue);
  });

  ratingEl.addEventListener("change", () => {
    const ratingValue = ratingEl.value;
    if (debuggerLog) {
      console.log(`Invoked rating onchange event ratingValue : ${ratingValue}`);
    }
    loadProducts(filterEl.value, sortValue, ratingValue);
  });
});

// loadProducts(category);
