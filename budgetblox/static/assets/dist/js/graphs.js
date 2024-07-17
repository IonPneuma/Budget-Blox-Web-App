document.addEventListener('DOMContentLoaded', function() {
    async function fetchData() {
        try {
            const response = await fetch('/api/financial_data');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log('Fetched data:', data);
            return data;
        } catch (error) {
            console.error('Error fetching data:', error);
            showAlert('Failed to fetch financial data. Please try again.', 'danger');
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
            document.getElementById('totalAllocation').textContent = data.totalAllocation;
            document.getElementById('netCashFlow').textContent = data.netCashFlow;
            
            // Update income and expense tables
            updateExpenseTable(data.expenses);
            updateIncomeTable(data.incomes);

            console.log("Dashboard update completed");
        } catch (error) {
            console.error('Error updating dashboard:', error);
            showAlert('Failed to update dashboard. Please try again.', 'danger');
        }
    }

    function updateExpenseTable(expenses) {
        console.log('Updating expense table:', expenses);
        const expenseTableBody = document.querySelector('#expenseTable tbody');
        if (expenseTableBody) {
            expenseTableBody.innerHTML = expenses.map((expense, index) => `
                <tr>
                    <td>${index + 1}</td>
                    <td>${expense.title}</td>
                    <td>${expense.amount}</td>
                    <td>${expense.date}</td>
                    <td><button class="btn btn-danger btn-sm delete-record" data-type="expense" data-id="${expense.id}">Delete</button></td>
                </tr>
            `).join('');
        }
    }

    function updateIncomeTable(incomes) {
        console.log('Updating income table:', incomes);
        const incomeTableBody = document.querySelector('#incomeTable tbody');
        if (incomeTableBody) {
            incomeTableBody.innerHTML = incomes.map((income, index) => `
                <tr>
                    <td>${index + 1}</td>
                    <td>${income.title}</td>
                    <td>${income.amount}</td>
                    <td>${income.date}</td>
                    <td><button class="btn btn-danger btn-sm delete-record" data-type="income" data-id="${income.id}">Delete</button></td>
                </tr>
            `).join('');
        }
    }

    function showActiveForm(activeForm) {
        console.log('Showing form:', activeForm.id);
        [expensesForm, savingsForm, investmentsForm].forEach(form => {
            form.style.display = form === activeForm ? 'block' : 'none';
        });
    }

    function deleteRecord(recordType, recordId, buttonElement) {
        const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
        fetch(`/delete_${recordType}/${recordId}`, {
            method: 'POST',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken
            },
            body: JSON.stringify({})
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                const row = buttonElement.closest('tr');
                if (row) {
                    const table = row.closest('table');
                    row.remove();
                    if (table) {
                        updateRowNumbers(table);
                    }
                }
                showAlert(`${recordType.charAt(0).toUpperCase() + recordType.slice(1)} deleted successfully!`, 'success');
            } else {
                throw new Error(data.error || 'Unknown error occurred');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showAlert(`An error occurred while deleting the ${recordType}: ${error.message}`, 'danger');
        });
    }

    function updateRowNumbers(element) {
        let tableBody;
        if (element.tagName === 'TBODY') {
            tableBody = element;
        } else if (element.tagName === 'TABLE') {
            tableBody = element.querySelector('tbody');
        } else {
            tableBody = element.closest('table')?.querySelector('tbody');
        }
    
        if (tableBody && tableBody.rows.length > 0) {
            Array.from(tableBody.rows).forEach((row, index) => {
                const firstCell = row.cells[0];
                if (firstCell) {
                    firstCell.textContent = index + 1;
                }
            });
        } else {
            console.warn('Table body not found or has no rows');
        }
    }

    function showAlert(message, type) {
        let container = document.querySelector('.container') || document.querySelector('main') || document.body;
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
        alertDiv.role = 'alert';
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        container.insertAdjacentElement('afterbegin', alertDiv);
        setTimeout(() => alertDiv.remove(), 5000);
    }

    // Set up event listeners
    const expensesBtn = document.getElementById('expensesBtn');
    const savingsBtn = document.getElementById('savingsBtn');
    const investmentsBtn = document.getElementById('investmentsBtn');
    const expensesForm = document.getElementById('expensesForm');
    const savingsForm = document.getElementById('savingsForm');
    const investmentsForm = document.getElementById('investmentsForm');

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

    document.body.addEventListener('click', function(e) {
        if (e.target && e.target.classList.contains('delete-record')) {
            const recordType = e.target.dataset.type;
            const recordId = e.target.dataset.id;
            if (confirm(`Are you sure you want to delete this ${recordType}?`)) {
                deleteRecord(recordType, recordId, e.target);
            }
        }
    });

    // Call updateDashboard when the page loads
    updateDashboard();
});

console.log('graphs.js loaded');

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded event fired');
    initializePagination();
});

function initializePagination() {
    console.log('Initializing pagination...');
    
    const tables = [
        { tableId: 'incomeTable', paginationId: 'incomePagination' },
        { tableId: 'allocationTable', paginationId: 'allocationPagination' }
    ];

    tables.forEach(({ tableId, paginationId }) => {
        const table = document.getElementById(tableId);
        const paginationElement = document.getElementById(paginationId);
        
        if (table && paginationElement) {
            console.log(`Found table and pagination for ${tableId}`);
            const rows = table.querySelectorAll('tbody tr');
            console.log(`Number of rows in ${tableId}: ${rows.length}`);
            
            if (rows.length > 8) {
                console.log(`Applying pagination to ${tableId}`);
                applyPagination(rows, paginationElement);
            } else {
                console.log(`No pagination needed for ${tableId}`);
            }
        } else {
            console.warn(`Table or pagination not found for ${tableId}`);
        }
    });
}

function applyPagination(rows, paginationElement) {
    const rowsPerPage = 8;
    const pageCount = Math.ceil(rows.length / rowsPerPage);
    let currentPage = 1;

    function showPage(page) {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        rows.forEach((row, index) => {
            row.style.display = (index >= start && index < end) ? '' : 'none';
        });
        currentPage = page;
        updatePaginationButtons();
    }

    function updatePaginationButtons() {
        paginationElement.innerHTML = '';
        for (let i = 1; i <= pageCount; i++) {
            const li = document.createElement('li');
            li.className = `page-item ${i === currentPage ? 'active' : ''}`;
            const a = document.createElement('a');
            a.className = 'page-link';
            a.href = '#';
            a.textContent = i;
            a.addEventListener('click', (e) => {
                e.preventDefault();
                showPage(i);
            });
            li.appendChild(a);
            paginationElement.appendChild(li);
        }
    }

    showPage(1);
}

// Existing updateDashboard function and other code...