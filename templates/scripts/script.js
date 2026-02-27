const offerTimer = (() => {
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

    hoursEl.textContent = (hoursPending);
    minutesEl.textContent = String(minutesPending).padStart(2, "0");
    secondsEl.textContent = String(secondsPending).padStart(2, "0");
  }, 1000);
})();
