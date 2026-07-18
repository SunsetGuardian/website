    (() => {
        const rateInput =
            document.querySelector("#rule72-rate");

        const targetYearsInput =
            document.querySelector("#rule72-target-years");

        const yearsResult =
            document.querySelector("#rule72-years-result");

        const rateResult =
            document.querySelector("#rule72-rate-result");

        const numberFormatter = new Intl.NumberFormat(
            "en-US",
            {
                maximumFractionDigits: 2
            }
        );

        function readPositiveNumber(input) {
            const value = Number(input.value);

            if (!Number.isFinite(value) || value <= 0) {
                return null;
            }

            return value;
        }

        function updateDoublingTime() {
            const annualRate =
                readPositiveNumber(rateInput);

            if (annualRate === null) {
                yearsResult.textContent =
                    "Enter a rate above 0%";

                return;
            }

            const estimatedYears = 72 / annualRate;

            const unit =
                Math.abs(estimatedYears - 1) < 0.005
                    ? "year"
                    : "years";

            yearsResult.textContent =
                `${numberFormatter.format(estimatedYears)} ${unit}`;
        }

        function updateRequiredRate() {
            const targetYears =
                readPositiveNumber(targetYearsInput);

            if (targetYears === null) {
                rateResult.textContent =
                    "Enter a time above 0 years";

                return;
            }

            const requiredRate = 72 / targetYears;

            rateResult.textContent =
                `${numberFormatter.format(requiredRate)}% per year`;
        }

        rateInput.addEventListener(
            "input",
            updateDoublingTime
        );

        targetYearsInput.addEventListener(
            "input",
            updateRequiredRate
        );

        updateDoublingTime();
        updateRequiredRate();
    })();
