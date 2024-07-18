document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded event fired');
    initializePagination();
    updateDashboard();
    setupEventListeners();
});

function initializePagination() {
    const tables = [
        { tableId: 'incomeTable', paginationId: 'incomePagination' },
        { tableId: 'allocationTable', paginationId: 'allocationPagination' }
    ];

    tables.forEach(({ tableId, paginationId }) => {
        const table = document.getElementById(tableId);
        const pagination = document.getElementById(paginationId);
        if (table && pagination) {
            new TablePagination(table, pagination, 8).init();
        }
    });
}

class TablePagination {
    constructor(table, pagination, rowsPerPage) {
        this.table = table;
        this.pagination = pagination;
        this.rowsPerPage = rowsPerPage;
        this.rows = Array.from(this.table.querySelectorAll('tbody tr'));
        this.pageCount = Math.ceil(this.rows.length / this.rowsPerPage);
        this.currentPage = 1;
    }

    init() {
        this.showPage(1);
        this.createPaginationButtons();
    }

    showPage(page) {
        const start = (page - 1) * this.rowsPerPage;
        const end = start + this.rowsPerPage;
        this.rows.forEach((row, index) => {
            row.style.display = (index >= start && index < end) ? '' : 'none';
        });
        this.currentPage = page;
        this.updateActiveButton();
    }

    createPaginationButtons() {
        this.pagination.innerHTML = '';
        for (let i = 1; i <= this.pageCount; i++) {
            const button = document.createElement('li');
            button.className = 'page-item';
            button.innerHTML = `<a class="page-link" href="#" data-page="${i}">${i}</a>`;
            this.pagination.appendChild(button);
        }
        this.pagination.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                e.preventDefault();
                this.showPage(parseInt(e.target.dataset.page));
            }
        });
        this.updateActiveButton();
    }

    updateActiveButton() {
        this.pagination.querySelectorAll('.page-item').forEach((item, index) => {
            item.classList.toggle('active', index + 1 === this.currentPage);
        });
    }
}

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

function updateAllocationModal(data) {
    const modalBody = document.querySelector('#allRecordsAllocationModal .modal-body');
    if (modalBody) {
        const allocationData = [
            ...data.expenses.map(item => ({...item, type: 'Expense'})),
            ...data.savings.map(item => ({...item, type: 'Savings'})),
            ...data.investments.map(item => ({...item, type: 'Investment'}))
        ];
        
        const tableHtml = `
            <div class="table-responsive">
                <table class="table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Title</th>
                            <th>Amount</th>
                            <th>Date</th>
                            <th>Type</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${allocationData.map((item, index) => {
                            let title, amount, date;
                            if (item.type === 'Expense') {
                                title = item.title_expense || item.title;
                                amount = item.amount_expense || item.amount;
                                date = item.date_expense || item.date;
                            } else if (item.type === 'Savings') {
                                title = item.title_savings || item.title;
                                amount = item.amount_savings || item.amount;
                                date = item.date_savings || item.date;
                            } else if (item.type === 'Investment') {
                                title = item.stock || item.title;
                                amount = item.amount_investment || item.amount;
                                date = item.date_investment || item.date;
                            }
                            return `
                                <tr>
                                    <td>${index + 1}</td>
                                    <td>${title || ''}</td>
                                    <td>${amount || ''}</td>
                                    <td>${date || ''}</td>
                                    <td>${item.type || ''}</td>
                                    <td><button class="btn btn-danger btn-sm delete-record" data-type="${item.type.toLowerCase()}" data-id="${item.id}">Delete</button></td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        `;
        modalBody.innerHTML = tableHtml;
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
        
        // Update income table
        updateTable('incomeTable', data.incomes, 'income');
        
        // Update allocation table
        const allocationData = [
            ...data.expenses.map(item => ({...item, type: 'Expense'})),
            ...data.savings.map(item => ({...item, type: 'Savings'})),
            ...data.investments.map(item => ({...item, type: 'Investment'}))
        ];
        updateTable('allocationTable', allocationData, 'allocation');

        // Update Allocation modal
        updateAllocationModal(data);

        // Reinitialize pagination after updating tables
        initializePagination();

        console.log("Dashboard update completed");
    } catch (error) {
        console.error('Error updating dashboard:', error);
        showAlert('Failed to update dashboard. Please try again.', 'danger');
    }
}

function updateTable(tableId, data, tableType) {
    console.log(`Updating ${tableType} table with data:`, data);  // Log the data being used to update the table
    const tableBody = document.querySelector(`#${tableId} tbody`);
    if (tableBody) {
        tableBody.innerHTML = data.map((item, index) => {
            console.log(`Processing item for ${tableType}:`, item);  // Log each item being processed
            if (tableType === 'income') {
                return `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${item.title_income || item.title || ''}</td>
                        <td>${item.amount_income || item.amount || ''}</td>
                        <td>${item.date_income || item.date || ''}</td>
                        <td><button class="btn btn-danger btn-sm delete-record" data-type="income" data-id="${item.id}">Delete</button></td>
                    </tr>
                `;
            } else if (tableType === 'allocation') {
                let title, amount, date;
                if (item.type === 'Expense') {
                    title = item.title_expense || item.title;
                    amount = item.amount_expense || item.amount;
                    date = item.date_expense || item.date;
                } else if (item.type === 'Savings') {
                    title = item.title_savings || item.title;
                    amount = item.amount_savings || item.amount;
                    date = item.date_savings || item.date;
                } else if (item.type === 'Investment') {
                    title = item.stock || item.title;
                    amount = item.amount_investment || item.amount;
                    date = item.date_investment || item.date;
                }
                return `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${title || ''}</td>
                        <td>${amount || ''}</td>
                        <td>${date || ''}</td>
                        <td>${item.type || ''}</td>
                        <td><button class="btn btn-danger btn-sm delete-record" data-type="${item.type.toLowerCase()}" data-id="${item.id}">Delete</button></td>
                    </tr>
                `;
            }
        }).join('');
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

function updateRowNumbers(table) {
    const rows = table.querySelectorAll('tbody tr');
    rows.forEach((row, index) => {
        const firstCell = row.cells[0];
        if (firstCell) {
            firstCell.textContent = index + 1;
        }
    });
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

function setupEventListeners() {
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
}