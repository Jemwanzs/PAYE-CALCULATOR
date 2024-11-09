// Function to format numbers with commas and two decimal places when typing
function formatInput(inputElement) {
    let value = inputElement.value.replace(/,/g, '');  // Remove existing commas
    if (value === "") return;  // Return if the input is empty
    value = parseFloat(value).toFixed(2);

    // Add commas for large numbers as the user types
    inputElement.value = parseFloat(value).toLocaleString('en-US');
}

// Function to toggle the visibility of pension fields
function togglePensionFields() {
    const pensionFields = document.getElementById('pensionFields');
    pensionFields.style.display = document.getElementById('pensionCheckbox').checked ? 'block' : 'none';
}

// Function to toggle the visibility of insurance fields
function toggleInsuranceFields() {
    const insuranceFields = document.getElementById('insuranceFields');
    insuranceFields.style.display = document.getElementById('insuranceCheckbox').checked ? 'block' : 'none';
}

// Add event listeners for checkboxes
document.getElementById('pensionCheckbox').addEventListener('change', togglePensionFields);
document.getElementById('insuranceCheckbox').addEventListener('change', toggleInsuranceFields);

// Function to calculate PAYE
function calculatePAYE() {
    // Retrieve values from inputs
    const basicAmount = parseFloat(document.getElementById('basicAmount').value.replace(/,/g, '')) || 0;
    const allowances = parseFloat(document.getElementById('allowances').value.replace(/,/g, '')) || 0;
    const nonCashBenefits = parseFloat(document.getElementById('nonCashBenefits').value.replace(/,/g, '')) || 0;

    // Pension-related elements
    const pensionCheckbox = document.getElementById('pensionCheckbox');
    const employeePensionRate = parseFloat(document.getElementById('employeePension').value) / 100 || 0;
    const employerPensionRate = parseFloat(document.getElementById('employerPension').value) / 100 || 0;

    // Insurance-related elements
    const insuranceCheckbox = document.getElementById('insuranceCheckbox');
    const eduInsurance = parseFloat(document.getElementById('eduInsurance').value.replace(/,/g, '')) || 0;
    const lifeInsurance = parseFloat(document.getElementById('lifeInsurance').value.replace(/,/g, '')) || 0;

    // Calculations
    const grossPay = basicAmount + allowances + nonCashBenefits; // Gross pay includes non-cash benefits
    const nssf = Math.min(grossPay * 0.06, 2160);
    const shif = grossPay * 0.0275;
    const housingLevy = grossPay * 0.015;

    // Pension contributions based on checkbox
    let pension = 0;
    let pensionEmployer = 0;
    if (pensionCheckbox.checked) {
        pension = basicAmount * employeePensionRate;
        pensionEmployer = basicAmount * employerPensionRate;
    }

    // Insurance contributions based on checkbox
    let insurance = 0;
    let totalInsurance = 0;
    if (insuranceCheckbox.checked) {
        totalInsurance = eduInsurance + lifeInsurance;
    }

    // Non-cash benefits tax logic
    let taxableNonCashBenefits = nonCashBenefits > 3000 ? nonCashBenefits : 0; // Tax full amount if > 3000

    const allowableDeductions = Math.min(nssf + pension, 20000);
    const taxablePay = basicAmount + allowances + taxableNonCashBenefits - allowableDeductions;
    const personalRelief = 2400;
    const nita = 50;
    const nssfEmployer = Math.min(grossPay * 0.06, 2160);
    const ahlEmployer = grossPay * 0.015;

    // Calculate Reliefs
    const insuranceRelief = Math.min(0.15 * totalInsurance, 5000);
    const housingLevyRelief = Math.min(0.15 * housingLevy, 9000);

    // PAYE (Income Tax - Reliefs) Calculation
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

    const totalRelief = personalRelief + insuranceRelief + housingLevyRelief;
    const PAYE = Math.max(0, incomeTax - totalRelief);
    const EduInsurance = eduInsurance;
    const LifeInsurance = lifeInsurance;
    // Net Pay Calculation
    const netPay = basicAmount + allowances - (PAYE + nssf + shif + housingLevy + pension + totalInsurance);
    const totalDeductions = PAYE + nssf + shif + housingLevy + pension + totalInsurance;

    // Update results on the page
    document.getElementById('displayBasicAmount').textContent = basicAmount.toLocaleString();
    document.getElementById('displayAllowances').textContent = allowances.toLocaleString();
    document.getElementById('displayNonCashBenefits').textContent = nonCashBenefits.toLocaleString();
    document.getElementById('grossPay').textContent = grossPay.toLocaleString();
    document.getElementById('allowableDeductions').textContent = allowableDeductions.toLocaleString();
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