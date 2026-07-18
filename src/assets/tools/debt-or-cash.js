const debtOrCashCalculator = document.querySelector(
    "[data-debt-or-cash-calculator]"
);

if (debtOrCashCalculator) {
    const debtBalanceInput =
        debtOrCashCalculator.querySelector("#debtBalance");

    const debtAprInput =
        debtOrCashCalculator.querySelector("#debtApr");

    const remainingTermInput =
        debtOrCashCalculator.querySelector("#remainingTermYears");

    const monthlyPaymentInput =
        debtOrCashCalculator.querySelector("#monthlyDebtPayment");

    const liquidCashInput =
        debtOrCashCalculator.querySelector("#liquidCash");

    const emergencyReserveInput =
        debtOrCashCalculator.querySelector("#emergencyReserve");

    const savingsApyInput =
        debtOrCashCalculator.querySelector("#savingsApy");

    const federalTaxInput =
        debtOrCashCalculator.querySelector("#federalTaxRate");

    const stateTaxInput =
        debtOrCashCalculator.querySelector("#stateTaxRate");

    const investmentReturnInput =
        debtOrCashCalculator.querySelector("#investmentReturn");

    const errorOutput =
        debtOrCashCalculator.querySelector("#debtOrCashError");

    const liquidityNoticeOutput =
        debtOrCashCalculator.querySelector("#liquidityNotice");

    const cashAppliedOutput =
        debtOrCashCalculator.querySelector("#cashApplied");

    const interestAvoidedOutput =
        debtOrCashCalculator.querySelector("#interestAvoided");

    const interestAvoidedDescriptionOutput =
        debtOrCashCalculator.querySelector(
            "#interestAvoidedDescription"
        );

    const savingsInterestOutput =
        debtOrCashCalculator.querySelector("#savingsInterest");

    const savingsInterestDescriptionOutput =
        debtOrCashCalculator.querySelector(
            "#savingsInterestDescription"
        );

    const breakEvenApyOutput =
        debtOrCashCalculator.querySelector("#breakEvenApy");

    const afterTaxSavingsYieldOutput =
        debtOrCashCalculator.querySelector("#afterTaxSavingsYield");

    const newPayoffDateOutput =
        debtOrCashCalculator.querySelector("#newPayoffDate");

    const currentPayoffDescriptionOutput =
        debtOrCashCalculator.querySelector(
            "#currentPayoffDescription"
        );

    const timeSavedOutput =
        debtOrCashCalculator.querySelector("#timeSaved");

    const monthlyCashFlowOutput =
        debtOrCashCalculator.querySelector("#monthlyCashFlow");

    const differenceOutputs = {
        1: {
            value: debtOrCashCalculator.querySelector(
                "#differenceOneYear"
            ),
            description: debtOrCashCalculator.querySelector(
                "#differenceOneYearDescription"
            )
        },
        5: {
            value: debtOrCashCalculator.querySelector(
                "#differenceFiveYears"
            ),
            description: debtOrCashCalculator.querySelector(
                "#differenceFiveYearsDescription"
            )
        },
        10: {
            value: debtOrCashCalculator.querySelector(
                "#differenceTenYears"
            ),
            description: debtOrCashCalculator.querySelector(
                "#differenceTenYearsDescription"
            )
        }
    };

    const investmentComparison =
        debtOrCashCalculator.querySelector("#investmentComparison");

    const keepInvestedNetWorthOutput =
        debtOrCashCalculator.querySelector("#keepInvestedNetWorth");

    const payDebtInvestedNetWorthOutput =
        debtOrCashCalculator.querySelector(
            "#payDebtInvestedNetWorth"
        );

    const investmentDifferenceOutput =
        debtOrCashCalculator.querySelector("#investmentDifference");

    const investmentDifferenceDescriptionOutput =
        debtOrCashCalculator.querySelector(
            "#investmentDifferenceDescription"
        );

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

    const payoffDateFormatter = new Intl.DateTimeFormat("en-US", {
        month: "long",
        year: "numeric"
    });

    function parseOptionalNumber(input) {
        const rawValue = input.value.trim();

        if (rawValue === "") {
            return null;
        }

        return Number(rawValue);
    }

    function formatSignedCurrency(value) {
        if (Math.abs(value) < 0.5) {
            return "$0";
        }

        const sign = value > 0 ? "+" : "−";

        return sign + currencyFormatter.format(Math.abs(value));
    }

    function formatDuration(months) {
        const roundedMonths = Math.max(0, Math.round(months));
        const years = Math.floor(roundedMonths / 12);
        const remainingMonths = roundedMonths % 12;
        const parts = [];

        if (years > 0) {
            parts.push(
                years + (years === 1 ? " year" : " years")
            );
        }

        if (remainingMonths > 0) {
            parts.push(
                remainingMonths +
                (remainingMonths === 1 ? " month" : " months")
            );
        }

        return parts.length > 0 ? parts.join(" ") : "0 months";
    }

    function formatPayoffDate(months) {
        if (months <= 0) {
            return "Immediately";
        }

        const payoffDate = new Date();
        payoffDate.setDate(1);
        payoffDate.setMonth(
            payoffDate.getMonth() + Math.round(months)
        );

        return payoffDateFormatter.format(payoffDate);
    }

    function calculateMonthlyPayment(
        balance,
        monthlyRate,
        numberOfMonths
    ) {
        if (Math.abs(monthlyRate) < 0.0000000001) {
            return balance / numberOfMonths;
        }

        return (
            balance *
            monthlyRate /
            (
                1 -
                Math.pow(
                    1 + monthlyRate,
                    -numberOfMonths
                )
            )
        );
    }

    function calculatePayoff(
        startingBalance,
        monthlyRate,
        monthlyPayment
    ) {
        let balance = Math.max(0, startingBalance);
        let totalInterest = 0;
        let months = 0;
        const maximumMonths = 1200;

        while (
            balance > 0.000001 &&
            months < maximumMonths
        ) {
            const interest = balance * monthlyRate;

            if (
                monthlyPayment <= interest &&
                balance + interest > monthlyPayment
            ) {
                return null;
            }

            totalInterest += interest;
            balance += interest;

            const payment = Math.min(
                monthlyPayment,
                balance
            );

            balance -= payment;
            months += 1;
        }

        if (balance > 0.000001) {
            return null;
        }

        return {
            months,
            totalInterest
        };
    }

    function simulateSavingsScenario({
        startingDebt,
        startingSavings,
        debtMonthlyRate,
        savingsMonthlyRate,
        monthlyPayment,
        numberOfMonths
    }) {
        let debt = Math.max(0, startingDebt);
        let savings = Math.max(0, startingSavings);

        for (let month = 0; month < numberOfMonths; month += 1) {
            savings *= 1 + savingsMonthlyRate;

            if (debt > 0.000001) {
                debt *= 1 + debtMonthlyRate;

                const actualPayment = Math.min(
                    monthlyPayment,
                    debt
                );

                debt -= actualPayment;
                savings += monthlyPayment - actualPayment;
            } else {
                savings += monthlyPayment;
            }
        }

        return {
            savings,
            debt,
            netWorth: savings - debt
        };
    }

    function simulateInvestmentScenario({
        startingDebt,
        startingReserve,
        startingInvestment,
        debtMonthlyRate,
        savingsMonthlyRate,
        investmentMonthlyRate,
        monthlyPayment,
        numberOfMonths
    }) {
        let debt = Math.max(0, startingDebt);
        let reserve = Math.max(0, startingReserve);
        let investments = Math.max(0, startingInvestment);

        for (let month = 0; month < numberOfMonths; month += 1) {
            reserve *= 1 + savingsMonthlyRate;
            investments *= 1 + investmentMonthlyRate;

            if (debt > 0.000001) {
                debt *= 1 + debtMonthlyRate;

                const actualPayment = Math.min(
                    monthlyPayment,
                    debt
                );

                debt -= actualPayment;
                investments += monthlyPayment - actualPayment;
            } else {
                investments += monthlyPayment;
            }
        }

        return {
            reserve,
            investments,
            debt,
            netWorth: reserve + investments - debt
        };
    }

    function setDifferenceResult(
        difference,
        valueOutput,
        descriptionOutput
    ) {
        valueOutput.textContent =
            formatSignedCurrency(difference);

        if (Math.abs(difference) < 0.5) {
            descriptionOutput.textContent =
                "The two strategies are approximately even";
        } else if (difference > 0) {
            descriptionOutput.textContent =
                "Paying debt first is ahead in this estimate";
        } else {
            descriptionOutput.textContent =
                "Keeping the cash is ahead in this estimate";
        }
    }

    function clearResults() {
        [
            cashAppliedOutput,
            interestAvoidedOutput,
            savingsInterestOutput,
            breakEvenApyOutput,
            newPayoffDateOutput,
            timeSavedOutput,
            monthlyCashFlowOutput,
            keepInvestedNetWorthOutput,
            payDebtInvestedNetWorthOutput,
            investmentDifferenceOutput
        ].forEach(output => {
            output.textContent = "—";
        });

        Object.values(differenceOutputs).forEach(output => {
            output.value.textContent = "—";
            output.description.textContent = "Strategy comparison";
        });

        interestAvoidedDescriptionOutput.textContent =
            "Estimated over the remaining payoff period";

        savingsInterestDescriptionOutput.textContent =
            "Estimated interest earned by keeping the compared cash";

        afterTaxSavingsYieldOutput.textContent =
            "Gross APY needed for the after-tax yield to match the debt cost";

        currentPayoffDescriptionOutput.textContent =
            "Current payoff estimate will appear here";

        investmentDifferenceDescriptionOutput.textContent =
            "Strategy comparison using the assumed return";

        liquidityNoticeOutput.textContent =
            "Results will appear after valid values are entered.";

        investmentComparison.hidden = true;
    }

    function calculateDebtOrCash() {
        const debtBalance = Number(debtBalanceInput.value);
        const debtApr = Number(debtAprInput.value);
        const remainingTermYears =
            parseOptionalNumber(remainingTermInput);
        const enteredMonthlyPayment =
            parseOptionalNumber(monthlyPaymentInput);
        const liquidCash = Number(liquidCashInput.value);
        const emergencyReserve =
            Number(emergencyReserveInput.value);
        const savingsApy = Number(savingsApyInput.value);
        const federalTaxRate =
            Number(federalTaxInput.value);
        const stateTaxRate =
            Number(stateTaxInput.value);
        const investmentReturn =
            parseOptionalNumber(investmentReturnInput);

        errorOutput.textContent = "";

        const requiredValues = [
            debtBalance,
            debtApr,
            liquidCash,
            emergencyReserve,
            savingsApy,
            federalTaxRate,
            stateTaxRate
        ];

        const requiredValuesAreFinite =
            requiredValues.every(Number.isFinite);

        const termIsValid =
            remainingTermYears === null ||
            (
                Number.isFinite(remainingTermYears) &&
                remainingTermYears > 0 &&
                remainingTermYears <= 100
            );

        const paymentIsValid =
            enteredMonthlyPayment === null ||
            (
                Number.isFinite(enteredMonthlyPayment) &&
                enteredMonthlyPayment > 0
            );

        const investmentReturnIsValid =
            investmentReturn === null ||
            (
                Number.isFinite(investmentReturn) &&
                investmentReturn > -100 &&
                investmentReturn <= 100
            );

        const combinedTaxRate =
            (federalTaxRate + stateTaxRate) / 100;

        if (
            !requiredValuesAreFinite ||
            debtBalance <= 0 ||
            debtApr < 0 ||
            debtApr > 100 ||
            liquidCash < 0 ||
            emergencyReserve < 0 ||
            savingsApy < 0 ||
            savingsApy > 100 ||
            federalTaxRate < 0 ||
            federalTaxRate > 100 ||
            stateTaxRate < 0 ||
            stateTaxRate > 100 ||
            combinedTaxRate >= 1 ||
            !termIsValid ||
            !paymentIsValid ||
            !investmentReturnIsValid ||
            (
                enteredMonthlyPayment === null &&
                remainingTermYears === null
            )
        ) {
            clearResults();

            errorOutput.textContent =
                "Enter a positive debt balance, valid rates, nonnegative " +
                "cash amounts, and either a remaining term or monthly " +
                "payment. Federal and state tax rates must total less " +
                "than 100%.";

            return;
        }

        const debtMonthlyRate =
            (debtApr / 100) / 12;

        let monthlyPayment;

        if (enteredMonthlyPayment !== null) {
            monthlyPayment = enteredMonthlyPayment;
        } else {
            const numberOfMonths = Math.max(
                1,
                Math.round(remainingTermYears * 12)
            );

            monthlyPayment = calculateMonthlyPayment(
                debtBalance,
                debtMonthlyRate,
                numberOfMonths
            );
        }

        const currentPayoff = calculatePayoff(
            debtBalance,
            debtMonthlyRate,
            monthlyPayment
        );

        if (!currentPayoff) {
            clearResults();

            errorOutput.textContent =
                "The entered monthly payment is not high enough to repay " +
                "the debt under these assumptions, or payoff would take " +
                "more than 100 years.";

            return;
        }

        const protectedReserve = Math.min(
            liquidCash,
            emergencyReserve
        );

        const cashAboveReserve = Math.max(
            0,
            liquidCash - emergencyReserve
        );

        const cashApplied = Math.min(
            debtBalance,
            cashAboveReserve
        );

        const debtAfterPayment =
            Math.max(0, debtBalance - cashApplied);

        const cashAfterPayment =
            Math.max(0, liquidCash - cashApplied);

        const acceleratedPayoff = calculatePayoff(
            debtAfterPayment,
            debtMonthlyRate,
            monthlyPayment
        );

        if (!acceleratedPayoff) {
            clearResults();

            errorOutput.textContent =
                "The debt could not be repaid under the entered " +
                "assumptions.";

            return;
        }

        const grossSavingsMonthlyRate =
            Math.pow(
                1 + savingsApy / 100,
                1 / 12
            ) - 1;

        const afterTaxSavingsMonthlyRate =
            grossSavingsMonthlyRate *
            (1 - combinedTaxRate);

        const afterTaxSavingsApy =
            Math.pow(
                1 + afterTaxSavingsMonthlyRate,
                12
            ) - 1;

        const interestAvoided =
            currentPayoff.totalInterest -
            acceleratedPayoff.totalInterest;

        const savingsInterest =
            cashApplied *
            (
                Math.pow(
                    1 + afterTaxSavingsMonthlyRate,
                    currentPayoff.months
                ) - 1
            );

        let breakEvenApy = 0;

        if (debtMonthlyRate > 0) {
            const requiredGrossMonthlyRate =
                debtMonthlyRate /
                (1 - combinedTaxRate);

            breakEvenApy =
                Math.pow(
                    1 + requiredGrossMonthlyRate,
                    12
                ) - 1;
        }

        cashAppliedOutput.textContent =
            currencyFormatter.format(cashApplied);

        interestAvoidedOutput.textContent =
            currencyFormatter.format(
                Math.max(0, interestAvoided)
            );

        interestAvoidedDescriptionOutput.textContent =
            "Estimated across " +
            formatDuration(currentPayoff.months) +
            " on the current payment path";

        savingsInterestOutput.textContent =
            currencyFormatter.format(
                Math.max(0, savingsInterest)
            );

        savingsInterestDescriptionOutput.textContent =
            "Estimated on the compared cash over " +
            formatDuration(currentPayoff.months);

        breakEvenApyOutput.textContent =
            percentFormatter.format(breakEvenApy);

        afterTaxSavingsYieldOutput.textContent =
            "Your estimated after-tax savings yield is " +
            percentFormatter.format(afterTaxSavingsApy);

        newPayoffDateOutput.textContent =
            formatPayoffDate(acceleratedPayoff.months);

        currentPayoffDescriptionOutput.textContent =
            "Current path estimates payoff in " +
            formatPayoffDate(currentPayoff.months);

        timeSavedOutput.textContent =
            formatDuration(
                currentPayoff.months -
                acceleratedPayoff.months
            );

        monthlyCashFlowOutput.textContent =
            currencyFormatter.format(monthlyPayment);

        if (emergencyReserve === 0) {
            liquidityNoticeOutput.textContent =
                "Liquidity warning: this scenario leaves no stated " +
                "emergency reserve. The calculator applies up to " +
                currencyFormatter.format(cashApplied) +
                " to the debt.";
        } else if (liquidCash <= emergencyReserve) {
            liquidityNoticeOutput.textContent =
                "No cash is available above the stated emergency reserve. " +
                "The paydown and keep-cash strategies are currently the " +
                "same.";
        } else if (cashApplied >= debtBalance) {
            liquidityNoticeOutput.textContent =
                "The debt is paid in full while leaving " +
                currencyFormatter.format(cashAfterPayment) +
                " in liquid cash. The stated reserve is protected.";
        } else {
            liquidityNoticeOutput.textContent =
                "The calculator applies " +
                currencyFormatter.format(cashApplied) +
                " to debt and leaves " +
                currencyFormatter.format(cashAfterPayment) +
                " in liquid cash, including the protected reserve.";
        }

        [1, 5, 10].forEach(years => {
            const numberOfMonths = years * 12;

            const keepCashScenario =
                simulateSavingsScenario({
                    startingDebt: debtBalance,
                    startingSavings: liquidCash,
                    debtMonthlyRate,
                    savingsMonthlyRate:
                        afterTaxSavingsMonthlyRate,
                    monthlyPayment,
                    numberOfMonths
                });

            const payDebtScenario =
                simulateSavingsScenario({
                    startingDebt: debtAfterPayment,
                    startingSavings: cashAfterPayment,
                    debtMonthlyRate,
                    savingsMonthlyRate:
                        afterTaxSavingsMonthlyRate,
                    monthlyPayment,
                    numberOfMonths
                });

            const difference =
                payDebtScenario.netWorth -
                keepCashScenario.netWorth;

            setDifferenceResult(
                difference,
                differenceOutputs[years].value,
                differenceOutputs[years].description
            );
        });

        if (investmentReturn === null) {
            investmentComparison.hidden = true;
        } else {
            const investmentMonthlyRate =
                Math.pow(
                    1 + investmentReturn / 100,
                    1 / 12
                ) - 1;

            const investableCash =
                Math.max(0, liquidCash - protectedReserve);

            const keepInvestedScenario =
                simulateInvestmentScenario({
                    startingDebt: debtBalance,
                    startingReserve: protectedReserve,
                    startingInvestment: investableCash,
                    debtMonthlyRate,
                    savingsMonthlyRate:
                        afterTaxSavingsMonthlyRate,
                    investmentMonthlyRate,
                    monthlyPayment,
                    numberOfMonths: 120
                });

            const payDebtInvestedScenario =
                simulateInvestmentScenario({
                    startingDebt: debtAfterPayment,
                    startingReserve: protectedReserve,
                    startingInvestment:
                        Math.max(0, investableCash - cashApplied),
                    debtMonthlyRate,
                    savingsMonthlyRate:
                        afterTaxSavingsMonthlyRate,
                    investmentMonthlyRate,
                    monthlyPayment,
                    numberOfMonths: 120
                });

            const investmentDifference =
                payDebtInvestedScenario.netWorth -
                keepInvestedScenario.netWorth;

            keepInvestedNetWorthOutput.textContent =
                currencyFormatter.format(
                    keepInvestedScenario.netWorth
                );

            payDebtInvestedNetWorthOutput.textContent =
                currencyFormatter.format(
                    payDebtInvestedScenario.netWorth
                );

            setDifferenceResult(
                investmentDifference,
                investmentDifferenceOutput,
                investmentDifferenceDescriptionOutput
            );

            investmentDifferenceDescriptionOutput.textContent +=
                " at an assumed " +
                percentFormatter.format(investmentReturn / 100) +
                " annual return";

            investmentComparison.hidden = false;
        }
    }

    [
        debtBalanceInput,
        debtAprInput,
        remainingTermInput,
        monthlyPaymentInput,
        liquidCashInput,
        emergencyReserveInput,
        savingsApyInput,
        federalTaxInput,
        stateTaxInput,
        investmentReturnInput
    ].forEach(input => {
        input.addEventListener(
            "input",
            calculateDebtOrCash
        );
    });

    calculateDebtOrCash();
}
