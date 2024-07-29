"use strict";
document.addEventListener("DOMContentLoaded", () => {
    const inputElement = document.getElementById("target-date");
    const showModeElement = document.getElementById("show-mode");
    const resultElement = document.getElementById("result");
    const calculateButton = document.getElementById("calculate");
    chrome.storage.sync.get(["targetDate", "showMode"], (data) => {
        if (data.targetDate) {
            inputElement.value = data.targetDate;
        }
        if (data.showMode) {
            showModeElement.value = data.showMode;
        }
        if (data.targetDate) {
            calculateDays();
        }
    });
    calculateButton.addEventListener("click", () => {
        const targetDate = inputElement.value;
        const showMode = showModeElement.value;
        chrome.storage.sync.set({ targetDate, showMode }, () => {
            console.log("Target date and show mode saved");
        });
        calculateDays();
    });
    function calculateDays() {
        const targetDate = new Date(inputElement.value);
        const showMode = showModeElement.value;
        if (isNaN(targetDate.getTime())) {
            resultElement.textContent = "Please select a valid date.";
            return;
        }
        const currentDate = new Date();
        const timeDiff = targetDate.getTime() - currentDate.getTime();
        if (timeDiff <= 0) {
            resultElement.textContent = "The selected date is in the past or today.";
            return;
        }
        const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
        if (showMode === "days") {
            resultElement.textContent = `${daysDiff} day(s) remaining.`;
        }
        else {
            const monthsDiff = (targetDate.getFullYear() - currentDate.getFullYear()) * 12 +
                targetDate.getMonth() -
                currentDate.getMonth();
            const remainingDays = targetDate.getDate() - currentDate.getDate();
            const monthsDisplay = monthsDiff + (remainingDays < 0 ? -1 : 0); // Adjust for negative day remainder
            const adjustedDays = remainingDays < 0
                ? new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate() + remainingDays
                : remainingDays;
            resultElement.textContent = `${monthsDisplay} month(s) and ${adjustedDays} day(s) remaining.`;
        }
    }
});
