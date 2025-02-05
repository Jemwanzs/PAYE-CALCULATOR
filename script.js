// Function to format numbers with commas and two decimal places while typing
function formatInput(inputElement) {
    let value = inputElement.value.replace(/,/g, ''); // Remove existing commas
    if (!value) return; // Return if the input is empty
    value = parseFloat(value).toFixed(2); // Ensure two decimal places
    inputElement.value = parseFloat(value).toLocaleString('en-US'); // Format with commas
}

// Function to toggle visibility of pension fields
function togglePensionFields() {
    const pensionFields = document.getElementById('pensionFields');
    pensionFields.style.display = document.getElementById('pensionCheckbox').checked ? 'block' : 'none';
}

// Function to toggle visibility of insurance fields
function toggleInsuranceFields() {
    const insuranceFields = document.getElementById('insuranceFields');
    insuranceFields.style.display = document.getElementById('insuranceCheckbox').checked ? 'block' : 'none';
}

// Function to calculate income tax based on taxable pay
function calculateIncomeTax(taxablePay) {
    let incomeTax = 0;
    if (taxablePay <= 24000) {
        incomeTax = taxablePay * 0.10;
    } else if (taxablePay <= 32333) {
        incomeTax = 24000 * 0.10 + (taxablePay - 24000) * 0.25;
    } else if (taxablePay <= 500000) {
        incomeTax = 24000 * 0.10 + (32333 - 24000) * 0.25 + (taxablePay - 32333) * 0.30;
    } else if (taxablePay <= 800000) {
        incomeTax = 24000 * 0.10 + (32333 - 24000) * 0.25 + (500000 - 32333) * 0.30 + (taxablePay - 500000) * 0.325;
    } else {
        incomeTax = 24000 * 0.10 + (32333 - 24000) * 0.25 + (500000 - 32333) * 0.30 + (800000 - 500000) * 0.325 + (taxablePay - 800000) * 0.35;
    }
    return incomeTax;
}

// Function to calculate PAYE and update UI
function calculatePAYE() {
    const basicAmount = parseFloat(document.getElementById('basicAmount').value.replace(/,/g, '')) || 0;
    const allowances = parseFloat(document.getElementById('allowances').value.replace(/,/g, '')) || 0;
    const irrgularallowances = parseFloat(document.getElementById('irregularallowances').value.replace(/,/g, '')) || 0;
    const telnonCashBenefits = parseFloat(document.getElementById('telnonCashBenefits').value.replace(/,/g, '')) || 0;
    const mealsnonCashBenefits = parseFloat(document.getElementById('mealsnonCashBenefits').value.replace(/,/g, '')) || 0;

    const pensionCheckbox = document.getElementById('pensionCheckbox').checked;
    const employeePensionRate = parseFloat(document.getElementById('employeePension').value) / 100 || 0;
    const employerPensionRate = parseFloat(document.getElementById('employerPension').value) / 100 || 0;

    const insuranceCheckbox = document.getElementById('insuranceCheckbox').checked;
    const eduInsurance = parseFloat(document.getElementById('eduInsurance').value.replace(/,/g, '')) || 0;
    const lifeInsurance = parseFloat(document.getElementById('lifeInsurance').value.replace(/,/g, '')) || 0;

    const grossPay = basicAmount + allowances + irrgularallowances + telnonCashBenefits + mealsnonCashBenefits;
    const nssf = Math.min((basicAmount + allowances + irrgularallowances) * 0.06, 2160);
    const shif = (basicAmount + allowances) * 0.0275;
    const housingLevy = (basicAmount + allowances) * 0.015;

    let pension = 0, pensionEmployer = 0;
    if (pensionCheckbox) {
        pension = basicAmount * employeePensionRate;
        pensionEmployer = basicAmount * employerPensionRate;
    }

    let totalInsurance = 0;
    if (insuranceCheckbox) {
        totalInsurance = eduInsurance + lifeInsurance;
    }

    const taxabletelnonCashBenefits = telnonCashBenefits <= 3000 ? 0 : telnonCashBenefits; //If telnonCashBenefits is less than or equal to 3000, the taxable amount is 0. -----   Otherwise, the taxable amount is telnonCashBenefits.
    const taxablemealsnonCashBenefits = mealsnonCashBenefits <= 4000 ? 0 : mealsnonCashBenefits;
    const allowableDeductions = Math.min(nssf + pension, 20000);
    const excessPension = Math.max(((pensionEmployer + nssf) - 20000), 0);
    const taxablePay = (basicAmount + allowances + irrgularallowances) + taxabletelnonCashBenefits + taxablemealsnonCashBenefits + excessPension - allowableDeductions;

    const personalRelief = 2400;
    const incomeTax = calculateIncomeTax(taxablePay);
    const insuranceRelief = Math.min(0.15 * totalInsurance, 5000);
    const housingLevyRelief = Math.min(0.15 * housingLevy, 9000);
    const PAYE = Math.max(incomeTax - personalRelief - insuranceRelief - housingLevyRelief, 0);

    const nita = 50;
    const nssfEmployer = Math.min((basicAmount + allowances + irrgularallowances) * 0.06, 2160);
    const ahlEmployer = (basicAmount + allowances) * 0.015;

    const EduInsurance = eduInsurance;
    const LifeInsurance = lifeInsurance;
    // Net Pay Calculation
    const netPay = basicAmount + allowances + irrgularallowances - (PAYE + nssf + shif + housingLevy + pension + totalInsurance);
    const totalDeductions = PAYE + nssf + shif + housingLevy + pension + totalInsurance;

    // Update results on the UI
    document.getElementById('displayBasicAmount').textContent = basicAmount.toLocaleString();
    document.getElementById('displayAllowances').textContent = allowances.toLocaleString();
    document.getElementById('displayirrAllowances').textContent = irrgularallowances.toLocaleString();
    document.getElementById('displaytelnonCashBenefits').textContent = telnonCashBenefits.toLocaleString();
    document.getElementById('displaymealsnonCashBenefits').textContent = mealsnonCashBenefits.toLocaleString();
    document.getElementById('grossPay').textContent = grossPay.toLocaleString();
    document.getElementById('allowableDeductions').textContent = allowableDeductions.toLocaleString();
    document.getElementById('displaytaxabletelnonCashBenefits').textContent = taxabletelnonCashBenefits.toLocaleString();
    document.getElementById('displaytaxablemealsnonCashBenefits').textContent = taxablemealsnonCashBenefits.toLocaleString();
    document.getElementById('excessPension').textContent = excessPension.toLocaleString();
    document.getElementById('taxablePay').textContent = taxablePay.toLocaleString();
    document.getElementById('incomeTax').textContent = incomeTax.toLocaleString();
    document.getElementById('personalRelief').textContent = personalRelief.toLocaleString();
    document.getElementById('insuranceRelief').textContent = insuranceRelief.toLocaleString();
    document.getElementById('housingLevyRelief').textContent = housingLevyRelief.toLocaleString();
    document.getElementById('PAYE').textContent = PAYE.toLocaleString();
    document.getElementById('nssf').textContent = nssf.toLocaleString();
    document.getElementById('shif').textContent = shif.toLocaleString();
    document.getElementById('housingLevy').textContent = housingLevy.toLocaleString();
    document.getElementById('pension').textContent = pension.toLocaleString();
    document.getElementById('displayeduInsurance').textContent = EduInsurance.toLocaleString();
    document.getElementById('displaylifeInsurance').textContent = LifeInsurance.toLocaleString();
    document.getElementById('totalDeductions').textContent = totalDeductions.toLocaleString();
    document.getElementById('netPay').textContent = netPay.toLocaleString();
    document.getElementById('nssfEmployer').textContent = nssfEmployer.toLocaleString();
    document.getElementById('ahlEmployer').textContent = ahlEmployer.toLocaleString();
    document.getElementById('pensionEmployer').textContent = pensionEmployer.toLocaleString();
    document.getElementById('nita').textContent = nita.toLocaleString();
}

// Attach event listeners for real-time updates
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', function () {
        formatInput(this); // Format value as user types
        calculatePAYE();   // Recalculate values
    });
});

// Initialize toggle functionalities
document.getElementById('pensionCheckbox').addEventListener('change', togglePensionFields);
document.getElementById('insuranceCheckbox').addEventListener('change', toggleInsuranceFields);