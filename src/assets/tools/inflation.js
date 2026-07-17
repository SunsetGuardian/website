const inflationCalculator = document.querySelector(
    "[data-inflation-calculator]"
);

if (inflationCalculator) {
    const amountInput =
        inflationCalculator.querySelector("#currentAmount");

    const rateInput =
        inflationCalculator.querySelector("#inflationRate");

    const yearsInput =
        inflationCalculator.querySelector("#inflationYears");

    const futureCostOutput =
        inflationCalculator.querySelector("#futureCost");

    const purchasingPowerOutput =
        inflationCalculator.querySelector("#purchasingPower");

    const cumulativeInflationOutput =
        inflationCalculator.querySelector("#cumulativeInflation");

    const errorOutput =
        inflationCalculator.querySelector("#inflationError");

    const currencyFormatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0
    });

    const percentFormatter = new Intl.NumberFormat("en-US", {
        style: "percent",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    function clearResults() {
        futureCostOutput.textContent = "—";
        purchasingPowerOutput.textContent = "—";
        cumulativeInflationOutput.textContent = "—";
    }

    function calculateInflation() {
        const amount = Number(amountInput.value);
        const annualRate = Number(rateInput.value);
        const years = Number(yearsInput.value);

        errorOutput.textContent = "";

        if (
            !Number.isFinite(amount) ||
            !Number.isFinite(annualRate) ||
            !Number.isFinite(years) ||
            amount <= 0 ||
            annualRate < 0 ||
            years <= 0
        ) {
            clearResults();

            errorOutput.textContent =
                "Enter a positive amount and number of years, " +
                "with an inflation rate of zero or greater.";

            return;
        }

        const rate = annualRate / 100;
        const inflationFactor = Math.pow(1 + rate, years);

        const futureCost = amount * inflationFactor;
        const purchasingPower = amount / inflationFactor;
        const cumulativeInflation = inflationFactor - 1;

        futureCostOutput.textContent =
            currencyFormatter.format(futureCost);

        purchasingPowerOutput.textContent =
            currencyFormatter.format(purchasingPower);

        cumulativeInflationOutput.textContent =
            percentFormatter.format(cumulativeInflation);
    }

    [
        amountInput,
        rateInput,
        yearsInput
    ].forEach(input => {
        input.addEventListener(
            "input",
            calculateInflation
        );
    });

    calculateInflation();
}
