import { errorHandler } from "./helper.js";

//Discount Timer
const offerTimer = (() => {
  try {
    const hoursEl = document.querySelector(".hours");
    const minutesEl = document.querySelector(".minutes");
    const secondsEl = document.querySelector(".seconds");

    const timer = setInterval(() => {
      let startTime = new Date();
      startTime.setHours(24, 0, 0, 0);
      const now = new Date();
      const diffMs = startTime - now;

      //Time Calculation
      const hoursPending = Math.floor(diffMs / (60000 * 60));
      const minutesPending = Math.floor((diffMs % (60000 * 60)) / 60000);
      const secondsPending = Math.floor((diffMs % (1000 * 60)) / 1000);

      hoursEl.textContent = hoursPending;
      minutesEl.textContent = String(minutesPending).padStart(2, "0");
      secondsEl.textContent = String(secondsPending).padStart(2, "0");
    }, 1000);
  } catch (err) {
    errorHandler(err, "offerTimer()");
  }
})();

//Hamburger menu

const hamburger = document?.querySelector(".hamburger-menu");
const hamburgerBtn = document?.querySelector(".hamburger-menu__bar");
const hamburgerOptions = document?.querySelector(".hamburger-menu__options");

hamburgerBtn?.addEventListener("click", () => {
  // hamburgerBtn.classList.remove("hamburger-menu__bar");

  try {
    console.log("hamburger Clicked");
    hamburgerBtn?.classList?.toggle("hamburger-menu__bar--close");
    hamburgerOptions?.classList?.toggle("hamburger-hidden");
  } catch (err) {
    errorHandler(err, "Hamburger Onchange Event");
  }
});

//Search Implementation

const searchValue = document.querySelector(".search-text");

searchValue.addEventListener("change", () => {
  try {
    let searchItem = searchValue?.value;
    console.log(searchItem);
    searchItem = searchItem?.toLowerCase()?.trim();
    searchValue.value = "";
    console.log(searchItem);

    window.location.href = `../templates/products.html?search=${searchItem}`;
  } catch (err) {
    errorHandler(err, "Search Onchange Event");
  }
});
