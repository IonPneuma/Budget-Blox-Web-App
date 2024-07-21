import { deleteRecord, fetchData } from './api.js';
import { showAlert } from './utils.js';


let fullIncomeData = [];
let fullAllocationData = [];

export async function updateDashboard() {
    try {
        const data = await fetchData();
        if (!data) {
            console.error("No data received from fetchData");
            return;
        }

        updateElement('totalIncome', data.totalIncome);
        updateElement('totalAllocation', data.totalAllocation);
        updateElement('netCashFlow', data.netCashFlow);
        
        fullIncomeData = data.incomes;
        updateTable('incomeTable', fullIncomeData, 'income', true);
        
        fullAllocationData = [
            ...data.expenses.map(item => ({...item, type: 'Expense'})),
            ...data.savings.map(item => ({...item, type: 'Savings'})),
            ...data.investments.map(item => ({...item, type: 'Investment'}))
        ];
        updateTable('allocationTable', fullAllocationData, 'allocation', true);

        console.log("Dashboard update completed");
    } catch (error) {
        console.error('Error updating dashboard:', error);
        showAlert('Failed to update dashboard. Please try again.', 'danger');
    }
}

export function updateTable(tableId, data, tableType, limitRows = true) {
    console.log(`Updating ${tableType} table with data:`, data);
    const tableBody = document.querySelector(`#${tableId} tbody`);
    if (tableBody) {
        const displayedData = limitRows ? data.slice(0, 8) : data;
        tableBody.innerHTML = displayedData.map((item, index) => {
            let title, amount, date, type;
            if (tableType === 'income') {
                title = item.title_income || item.title || '';
                amount = item.amount_income || item.amount || '';
                date = item.date_income || item.date || '';
                type = 'Income';
            } else {
                title = item.title_expense || item.title_savings || item.stock || item.title || '';
                amount = item.amount_expense || item.amount_savings || item.amount_investment || item.amount || '';
                date = item.date_expense || item.date_savings || item.date_investment || item.date || '';
                type = item.type || '';
            }
            return `
                <tr>
                    <td>${index + 1}</td>
                    <td>${title}</td>
                    <td>${amount}</td>
                    <td>${date}</td>
                    <td>${type}</td>
                    <td><button class="btn btn-danger btn-sm delete-record" data-type="${type.toLowerCase()}" data-id="${item.id}">Delete</button></td>
                </tr>
            `;
        }).join('');

        // Show/hide the "Show All" button
        const showAllButton = document.getElementById(`showAll${tableType.charAt(0).toUpperCase() + tableType.slice(1)}s`);
        if (showAllButton) {
            showAllButton.style.display = data.length > 8 ? 'inline-block' : 'none';
        }
    } else {
        console.warn(`Table body for '${tableId}' not found`);
    }
}

export function setupEventListeners() {
    document.body.addEventListener('click', async function(e) {
        if (e.target && e.target.classList.contains('delete-record')) {
            const recordType = e.target.dataset.type;
            const recordId = e.target.dataset.id;
            if (confirm(`Are you sure you want to delete this ${recordType}?`)) {
                try {
                    const result = await deleteRecord(recordType, recordId);
                    if (result.success) {
                        await updateDashboard();  // Refresh all data
                        // Alert is now shown in deleteRecord function, so we don't need to show it here
                    } else {
                        // This else block might not be necessary if deleteRecord always throws on error
                        showAlert(`Failed to delete ${recordType}: ${result.error}`, 'danger');
                    }
                } catch (error) {
                    console.error('Error deleting record:', error);
                    // Error alert is now shown in deleteRecord function, so we don't need to show it here
                }
            }
        }
    });
}

export function updateElement(id, value) {
    try {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        } else {
            console.warn(`Element with id '${id}' not found`);
        }
    } catch (error) {
        console.error(`Error updating element with id '${id}':`, error);
    }
}



