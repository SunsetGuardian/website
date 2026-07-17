const investmentFeeCalculator = document.querySelector(
    "[data-investment-fee-calculator]"
);

if (investmentFeeCalculator) {
    const startingBalanceInput =
        investmentFeeCalculator.querySelector("#startingBalance");

    const monthlyContributionInput =
        investmentFeeCalculator.querySelector("#monthlyContribution");

    const annualReturnInput =
        investmentFeeCalculator.querySelector("#annualReturn");

    const annualFeeInput =
        investmentFeeCalculator.querySelector("#annualFee");

    const yearsInput =
        investmentFeeCalculator.querySelector("#investmentYears");

    const balanceWithoutFeesOutput =
        investmentFeeCalculator.querySelector("#balanceWithoutFees");

    const balanceAfterFeesOutput =
        investmentFeeCalculator.querySelector("#balanceAfterFees");

    const feeImpactOutput =
        investmentFeeCalculator.querySelector("#feeImpact");

    const feeImpactPercentOutput =
        investmentFeeCalculator.querySelector("#feeImpactPercent");

    const errorOutput =
        investmentFeeCalculator.querySelector("#investmentFeeError");

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
        balanceWithoutFeesOutput.textContent = "—";
        balanceAfterFeesOutput.textContent = "—";
        feeImpactOutput.textContent = "—";

        feeImpactPercentOutput.textContent =
            "Difference between the two balances";
    }

    function calculateFutureValue(
        startingBalance,
        monthlyContribution,
        monthlyRate,
        numberOfMonths
    ) {
        const startingBalanceGrowth =
            startingBalance *
            Math.pow(1 + monthlyRate, numberOfMonths);

        if (Math.abs(monthlyRate) < 0.0000000001) {
            return (
                startingBalanceGrowth +
                monthlyContribution * numberOfMonths
            );
        }

        const contributionGrowth =
            monthlyContribution *
            (
                (
                    Math.pow(
                        1 + monthlyRate,
                        numberOfMonths
                    ) - 1
                ) / monthlyRate
            );

        return startingBalanceGrowth + contributionGrowth;
    }

    function calculateInvestmentFees() {
        const startingBalance =
            Number(startingBalanceInput.value);

        const monthlyContribution =
            Number(monthlyContributionInput.value);

        const annualReturn =
            Number(annualReturnInput.value);

        const annualFee =
            Number(annualFeeInput.value);

        const years =
            Number(yearsInput.value);

        errorOutput.textContent = "";

        const inputsAreFinite = [
            startingBalance,
            monthlyContribution,
            annualReturn,
            annualFee,
            years
        ].every(Number.isFinite);

        if (
            !inputsAreFinite ||
            startingBalance < 0 ||
            monthlyContribution < 0 ||
            annualReturn <= -100 ||
            annualFee < 0 ||
            annualFee >= 100 ||
            years <= 0 ||
            (
                startingBalance === 0 &&
                monthlyContribution === 0
            )
        ) {
            clearResults();

            errorOutput.textContent =
                "Enter a starting balance or monthly contribution, " +
                "a return above -100%, a fee from 0% to less than " +
                "100%, and a positive number of years.";

            return;
        }

        const grossAnnualRate = annualReturn / 100;
        const feeRate = annualFee / 100;

        const grossAnnualFactor =
            1 + grossAnnualRate;

        const afterFeeAnnualFactor =
            grossAnnualFactor * (1 - feeRate);

        const grossMonthlyRate =
            Math.pow(grossAnnualFactor, 1 / 12) - 1;

        const afterFeeMonthlyRate =
            Math.pow(afterFeeAnnualFactor, 1 / 12) - 1;

        const numberOfMonths =
            Math.round(years * 12);

        const balanceWithoutFees =
            calculateFutureValue(
                startingBalance,
                monthlyContribution,
                grossMonthlyRate,
                numberOfMonths
            );

        const balanceAfterFees =
            calculateFutureValue(
                startingBalance,
                monthlyContribution,
                afterFeeMonthlyRate,
                numberOfMonths
            );

        const feeImpact =
            balanceWithoutFees - balanceAfterFees;

        const feeImpactPercent =
            balanceWithoutFees !== 0
                ? feeImpact / balanceWithoutFees
                : 0;

        balanceWithoutFeesOutput.textContent =
            currencyFormatter.format(balanceWithoutFees);

        balanceAfterFeesOutput.textContent =
            currencyFormatter.format(balanceAfterFees);

        feeImpactOutput.textContent =
            currencyFormatter.format(feeImpact);

        feeImpactPercentOutput.textContent =
            percentFormatter.format(feeImpactPercent) +
            " of the projected no-fee balance";
    }

    [
        startingBalanceInput,
        monthlyContributionInput,
        annualReturnInput,
        annualFeeInput,
        yearsInput
    ].forEach(input => {
        input.addEventListener(
            "input",
            calculateInvestmentFees
        );
    });

    calculateInvestmentFees();
}
