const savingsGoalCalculator = document.querySelector(
    "[data-savings-goal-calculator]"
);

if (savingsGoalCalculator) {
    const goalInput =
        savingsGoalCalculator.querySelector("#savingsGoal");

    const currentSavingsInput =
        savingsGoalCalculator.querySelector("#currentSavings");

    const annualReturnInput =
        savingsGoalCalculator.querySelector("#savingsReturn");

    const yearsInput =
        savingsGoalCalculator.querySelector("#savingsYears");

    const monthlySavingsOutput =
        savingsGoalCalculator.querySelector("#monthlySavingsNeeded");

    const totalContributionsOutput =
        savingsGoalCalculator.querySelector(
            "#totalFutureContributions"
        );

    const estimatedGrowthOutput =
        savingsGoalCalculator.querySelector(
            "#estimatedSavingsGrowth"
        );

    const monthlyDescriptionOutput =
        savingsGoalCalculator.querySelector(
            "#monthlySavingsDescription"
        );

    const errorOutput =
        savingsGoalCalculator.querySelector("#savingsGoalError");

    const currencyFormatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0
    });

    function clearResults() {
        monthlySavingsOutput.textContent = "—";
        totalContributionsOutput.textContent = "—";
        estimatedGrowthOutput.textContent = "—";

        monthlyDescriptionOutput.textContent =
            "Estimated contribution at the end of each month";
    }

    function calculateSavingsGoal() {
        const goal = Number(goalInput.value);
        const currentSavings = Number(currentSavingsInput.value);
        const annualReturn = Number(annualReturnInput.value);
        const years = Number(yearsInput.value);

        errorOutput.textContent = "";

        const inputsAreFinite = [
            goal,
            currentSavings,
            annualReturn,
            years
        ].every(Number.isFinite);

        if (
            !inputsAreFinite ||
            goal <= 0 ||
            currentSavings < 0 ||
            annualReturn < 0 ||
            annualReturn > 100 ||
            years < 1 ||
            years > 100
        ) {
            clearResults();

            errorOutput.textContent =
                "Enter a positive savings goal, current savings of " +
                "zero or greater, an annual return from 0% to 100%, " +
                "and a time period from 1 to 100 years.";

            return;
        }

        const numberOfMonths = Math.round(years * 12);

        const annualRate = annualReturn / 100;

        const monthlyRate =
            Math.pow(1 + annualRate, 1 / 12) - 1;

        const projectedCurrentSavings =
            currentSavings *
            Math.pow(1 + monthlyRate, numberOfMonths);

        const remainingGoal =
            goal - projectedCurrentSavings;

        let monthlyContribution = 0;

        if (remainingGoal > 0) {
            if (Math.abs(monthlyRate) < 0.0000000001) {
                monthlyContribution =
                    remainingGoal / numberOfMonths;
            } else {
                const contributionGrowthFactor =
                    (
                        Math.pow(
                            1 + monthlyRate,
                            numberOfMonths
                        ) - 1
                    ) / monthlyRate;

                monthlyContribution =
                    remainingGoal / contributionGrowthFactor;
            }
        }

        const totalFutureContributions =
            monthlyContribution * numberOfMonths;

        const estimatedGrowthTowardGoal =
            Math.max(
                0,
                goal -
                currentSavings -
                totalFutureContributions
            );

        monthlySavingsOutput.textContent =
            currencyFormatter.format(monthlyContribution);

        totalContributionsOutput.textContent =
            currencyFormatter.format(totalFutureContributions);

        estimatedGrowthOutput.textContent =
            currencyFormatter.format(estimatedGrowthTowardGoal);

        if (monthlyContribution === 0) {
            monthlyDescriptionOutput.textContent =
                "Current savings may reach the goal without " +
                "additional monthly contributions";
        } else {
            monthlyDescriptionOutput.textContent =
                "Estimated contribution at the end of each month";
        }
    }

    [
        goalInput,
        currentSavingsInput,
        annualReturnInput,
        yearsInput
    ].forEach(input => {
        input.addEventListener(
            "input",
            calculateSavingsGoal
        );
    });

    calculateSavingsGoal();
}
