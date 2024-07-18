import { fetchData, deleteRecord } from './api.js';
import { showAlert } from './utils.js';

export async function updateDashboard() {
    try {
        const data = await fetchData();
        if (!data) {
            console.error("No data received from fetchData");
            return;
        }

        document.getElementById('totalIncome').textContent = data.totalIncome;
        document.getElementById('totalAllocation').textContent = data.totalAllocation;
        document.getElementById('netCashFlow').textContent = data.netCashFlow;
        
        updateTable('incomeTable', data.incomes, 'income');
        
        const allocationData = [
            ...data.expenses.map(item => ({...item, type: 'Expense'})),
            ...data.savings.map(item => ({...item, type: 'Savings'})),
            ...data.investments.map(item => ({...item, type: 'Investment'}))
        ];
        updateTable('allocationTable', allocationData, 'allocation');

        console.log("Dashboard update completed");
    } catch (error) {
        console.error('Error updating dashboard:', error);
        showAlert('Failed to update dashboard. Please try again.', 'danger');
    }
}

function updateTable(tableId, data, tableType) {
    console.log(`Updating ${tableType} table with data:`, data);
    const tableBody = document.querySelector(`#${tableId} tbody`);
    if (tableBody) {
        tableBody.innerHTML = data.map((item, index) => {
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

export function setupEventListeners() {
    document.body.addEventListener('click', async function(e) {
        if (e.target && e.target.classList.contains('delete-record')) {
            const recordType = e.target.dataset.type;
            const recordId = e.target.dataset.id;
            if (confirm(`Are you sure you want to delete this ${recordType}?`)) {
                const result = await deleteRecord(recordType, recordId);
                if (result.success) {
                    e.target.closest('tr').remove();
                    showAlert(`${recordType.charAt(0).toUpperCase() + recordType.slice(1)} deleted successfully!`, 'success');
                    updateDashboard();
                }
            }
        }
    });
}