import { updateDashboard, updateElement, updateTable } from './tableOperations.js';
import { showAlert } from './utils.js';

export function setupAjaxForms() {
    const forms = {
        'incomeForm': 'income',
        'expensesForm': 'expense',
        'savingsForm': 'savings',
        'investmentsForm': 'investment'
    };

    Object.entries(forms).forEach(([formId, recordType]) => {
        setupFormSubmission(formId, recordType);
    });
}

function setupFormSubmission(formId, recordType) {
    const form = document.getElementById(formId);
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            try {
                const formData = new FormData(this);
                formData.append('form_type', recordType);

                const response = await fetch('/cashflow', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                if (data.success) {
                    // Only show alert here, remove from server-side
                    showAlert(`${recordType.charAt(0).toUpperCase() + recordType.slice(1)} added successfully!`, 'success');
                    form.reset();
                    updateTable(recordType === 'income' ? 'incomeTable' : 'allocationTable', data.updatedData, recordType);
                    // Update dashboard totals
                    updateElement('totalIncome', data.totalIncome);
                    updateElement('totalAllocation', data.totalAllocation);
                    updateElement('netCashFlow', data.netCashFlow);
                } else {
                    showAlert('Error: ' + data.message, 'danger');
                }
            } catch (error) {
                console.error('Error:', error);
                showAlert('An error occurred. Please try again.', 'danger');
            }
        });
    } else {
        console.warn(`Form with id '${formId}' not found`);
    }
}

export function setupProjectUpdates() {
    document.querySelectorAll('.update-project-form').forEach(form => {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            const projectId = this.dataset.projectId;
            const formData = new FormData(this);

            try {
                const response = await fetch(`/update_project/${projectId}`, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                if (data.success) {
                    const row = document.getElementById(`project-row-${projectId}`);
                    row.querySelector('td:nth-child(2)').textContent = data.name;
                    row.querySelector('td:nth-child(4)').textContent = `${data.currency_symbol} ${data.currency}`;
                    showAlert('Project updated successfully!', 'success');
                } else {
                    showAlert('Failed to update project. ' + JSON.stringify(data.error), 'danger');
                }
            } catch (error) {
                console.error('Error:', error);
                showAlert('An error occurred while updating the project.', 'danger');
            }
        });
    });
}