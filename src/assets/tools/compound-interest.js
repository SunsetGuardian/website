    (() => {
        const startingBalanceInput =
            document.querySelector("#starting-balance");

        const monthlyContributionInput =
            document.querySelector("#monthly-contribution");

        const annualRateInput =
            document.querySelector("#annual-rate");

        const yearsInput =
            document.querySelector("#investment-years");

        const endingBalanceOutput =
            document.querySelector("#ending-balance");

        const totalContributedOutput =
            document.querySelector("#total-contributed");

        const interestEarnedOutput =
            document.querySelector("#interest-earned");

        const currencyFormatter = new Intl.NumberFormat(
            "en-US",
            {
                style: "currency",
                currency: "USD",
                maximumFractionDigits: 0
            }
        );

        function readNonnegativeNumber(input) {
            const value = Number(input.value);

            if (!Number.isFinite(value)) {
                return 0;
            }

            return Math.max(0, value);
        }

        function calculateCompoundInterest() {
            const startingBalance =
                readNonnegativeNumber(startingBalanceInput);

            const monthlyContribution =
                readNonnegativeNumber(monthlyContributionInput);

            const annualRate =
                readNonnegativeNumber(annualRateInput);

            const years =
                readNonnegativeNumber(yearsInput);

            const months = Math.round(years * 12);
            const monthlyRate = annualRate / 100 / 12;

            let futureStartingBalance;
            let futureContributions;

            if (monthlyRate === 0) {
                futureStartingBalance = startingBalance;
                futureContributions =
                    monthlyContribution * months;
            } else {
                const growthFactor =
                    Math.pow(1 + monthlyRate, months);

                futureStartingBalance =
                    startingBalance * growthFactor;

                futureContributions =
                    monthlyContribution *
                    ((growthFactor - 1) / monthlyRate);
            }

            const endingBalance =
                futureStartingBalance + futureContributions;

            const totalContributed =
                startingBalance +
                (monthlyContribution * months);

            const interestEarned =
                endingBalance - totalContributed;

            endingBalanceOutput.textContent =
                currencyFormatter.format(endingBalance);

            totalContributedOutput.textContent =
                currencyFormatter.format(totalContributed);

            interestEarnedOutput.textContent =
                currencyFormatter.format(interestEarned);
        }

        [
            startingBalanceInput,
            monthlyContributionInput,
            annualRateInput,
            yearsInput
        ].forEach((input) => {
            input.addEventListener(
                "input",
                calculateCompoundInterest
            );
        });

        calculateCompoundInterest();
    })();
