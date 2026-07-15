const calculator = document.querySelector(
    "[data-cagr-calculator]"
);

if (calculator) {
    const startingValueInput =
        calculator.querySelector("#startingValue");

    const endingValueInput =
        calculator.querySelector("#endingValue");

    const yearsInput =
        calculator.querySelector("#years");

    const cagrOutput =
        calculator.querySelector("#cagr");

    const totalReturnOutput =
        calculator.querySelector("#totalReturn");

    const errorOutput =
        calculator.querySelector("#calculatorError");

    const percentFormatter = new Intl.NumberFormat("en-US", {
        style: "percent",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    function calculate() {
        const startingValue =
            Number(startingValueInput.value);

        const endingValue =
            Number(endingValueInput.value);

        const years =
            Number(yearsInput.value);

        errorOutput.textContent = "";

        if (
            !Number.isFinite(startingValue) ||
            !Number.isFinite(endingValue) ||
            !Number.isFinite(years) ||
            startingValue <= 0 ||
            endingValue <= 0 ||
            years <= 0
        ) {
            cagrOutput.textContent = "—";
            totalReturnOutput.textContent = "—";

            errorOutput.textContent =
                "Enter values greater than zero in all three fields.";

            return;
        }

        const totalReturn =
            endingValue / startingValue - 1;

        const cagr =
            Math.pow(
                endingValue / startingValue,
                1 / years
            ) - 1;

        totalReturnOutput.textContent =
            percentFormatter.format(totalReturn);

        cagrOutput.textContent =
            percentFormatter.format(cagr);
    }

    [
        startingValueInput,
        endingValueInput,
        yearsInput
    ].forEach(input => {
        input.addEventListener("input", calculate);
    });

    calculate();
}
