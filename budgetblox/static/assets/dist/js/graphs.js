async function fetchData() {
    try {
        const response = await fetch('/api/financial_data');
        const data = await response.json();
        console.log('Fetched data:', JSON.stringify(data, null, 2));
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

        document.getElementById('totalIncome').textContent = data.totalIncome;
        document.getElementById('totalExpenses').textContent = data.totalExpenses;
        document.getElementById('netCashFlow').textContent = data.netCashFlow;
        document.getElementById('currencySymbol').textContent = data.currencySymbol;

        updateExpenseTable(data.expenses);
        updateIncomeTable(data.incomes);

        console.log("Dashboard update completed");
    } catch (error) {
        console.error('Error updating dashboard:', error);
    }
}

function updateExpenseTable(expenses) {
    const tableBody = document.querySelector('#expenseTable tbody');
    if (!tableBody) return;

    tableBody.innerHTML = '';
    expenses.forEach(expense => {
        const row = document.createElement('tr');
        row.setAttribute('data-expense-id', expense.id);
        row.innerHTML = `
            <td>${expense.title_expense}</td>
            <td>${expense.amount_expense}</td>
            <td>${expense.date_expense}</td>
            <td>
                <button class="btn btn-danger btn-sm delete-expense" data-id="${expense.id}">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function updateIncomeTable(incomes) {
    const tableBody = document.querySelector('#incomeTable tbody');
    if (!tableBody) return;

    tableBody.innerHTML = '';
    incomes.forEach(income => {
        const row = document.createElement('tr');
        row.setAttribute('data-income-id', income.id);
        row.innerHTML = `
            <td>${income.title_income}</td>
            <td>${income.amount_income}</td>
            <td>${income.date_income}</td>
            <td>
                <button class="btn btn-danger btn-sm delete-income" data-id="${income.id}">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

