async function fetchData() {
    try {
        const response = await fetch('/api/financial_data');
        const data = await response.json();
        console.log('Fetched data:', data);
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

async function updateDashboard() {
    try {
        const data = await fetchData();
        if (!data) {
            console.error("No data received from fetchData");
            return;
        }

        // Update UI elements
        document.getElementById('totalIncome').textContent = data.totalIncome;
        document.getElementById('totalExpenses').textContent = data.totalExpenses;
        document.getElementById('netCashFlow').textContent = data.netCashFlow;
        

        // Update income and expense tables
        updateExpenseTable(data.expenses);
        updateIncomeTable(data.incomes);

        console.log("Dashboard update completed");
    } catch (error) {
        console.error('Error updating dashboard:', error);
    }
}

// Allocation button functionality
document.addEventListener('DOMContentLoaded', function() {
    const expensesBtn = document.getElementById('expensesBtn');
    const savingsBtn = document.getElementById('savingsBtn');
    const investmentsBtn = document.getElementById('investmentsBtn');
    const expensesForm = document.getElementById('expensesForm');
    const savingsForm = document.getElementById('savingsForm');
    const investmentsForm = document.getElementById('investmentsForm');

    function showActiveForm(activeForm) {
        console.log('Showing form:', activeForm.id);
        [expensesForm, savingsForm, investmentsForm].forEach(form => {
            form.style.display = form === activeForm ? 'block' : 'none';
        });
    }

    expensesBtn.addEventListener('click', () => {
        console.log('Expenses button clicked');
        showActiveForm(expensesForm);
        [expensesBtn, savingsBtn, investmentsBtn].forEach(btn => btn.classList.remove('active'));
        expensesBtn.classList.add('active');
    });

    savingsBtn.addEventListener('click', () => {
        console.log('Savings button clicked');
        showActiveForm(savingsForm);
        [expensesBtn, savingsBtn, investmentsBtn].forEach(btn => btn.classList.remove('active'));
        savingsBtn.classList.add('active');
    });

    investmentsBtn.addEventListener('click', () => {
        console.log('Investments button clicked');
        showActiveForm(investmentsForm);
        [expensesBtn, savingsBtn, investmentsBtn].forEach(btn => btn.classList.remove('active'));
        investmentsBtn.classList.add('active');
    });
});



// Call updateDashboard when the page loads
document.addEventListener('DOMContentLoaded', updateDashboard);