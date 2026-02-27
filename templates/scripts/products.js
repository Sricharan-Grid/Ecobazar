const loadProducts = async (category, sorting, rating) => {
  try {
    console.log("invoked", category, sorting);
    category = category.toLowerCase();
    const productsContainer = document.querySelector(".products__prods");

    //reading the Json
    const response = await fetch("productsData.json");
    const products = await response.json();

    // Filtering the  Products
    let filteredProducts = [];

    filteredProducts =
      category === "all"
        ? [...products]
        : products.filter(
            (product) => product?.category?.toLowerCase() === category,
          );

    //Sorting

    filteredProducts.sort((a, b) => {
      const nameA = a.productName || "";
      const nameB = b.productName || "";
      console.log("sorting", sorting);

      if (sorting === "desc") {
        return nameB.localeCompare(nameA); // Z to A
      } else {
        return nameA.localeCompare(nameB); // A to Z
      }
    });

    //Rating Sort
    filteredProducts.sort((a, b) => {
      rating ?? "";
      const ratingA = Number(a.rating) || "";
      const ratingB = Number(b.rating) || "";
      if (rating === "high") {
        return ratingB - ratingA;
      } else {
        return ratingA - ratingB;
      }
    });

    console.log(filteredProducts);

    if (filteredProducts) {
      productsContainer.innerHTML = "";
      filteredProducts.forEach((cardElement) => {
        // prettier-ignore
        const {imageLink,availability,id,productName,rating,discountPrice,actualPrice} = cardElement;

        //HTML element
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
    }
  } catch (error) {
    console.error("Error loading the products:", error);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  console.log("Page is ready! Executing logic...");

  //Getting Query params for the category
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const category = urlParams.get("category");

  // 2. Set dropdown values to match URL
  document.querySelector(".filter-options").value = category;
  document.querySelector(".sort-options").value = "asc";

  // 3. Run your initial filter/sort/render function
  loadProducts(category, "asc");
});

const filterEl = document.querySelector(".filter-options");
const sortEl = document.querySelector(".sort-options__dropdown");
const ratingEl = document.querySelector(".rating-options__dropdown");

let sortValue = "asc";

filterEl.addEventListener("change", () => {
  const filterValue = filterEl.value;
  console.log(filterValue);
  loadProducts(filterValue, "asc");
});

sortEl.addEventListener("change", () => {
  sortValue = sortEl.value;
  console.log(sortValue);
  loadProducts(filterEl?.value, sortValue);
});

ratingEl.addEventListener("change", () => {
  const ratingValue = ratingEl.value;
  console.log(ratingValue);
  loadProducts(filterEl?.value, sortValue, ratingValue);
});

// loadProducts(category);
