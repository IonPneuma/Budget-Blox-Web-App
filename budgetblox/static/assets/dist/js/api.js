import { showAlert } from './utils.js';

export async function fetchData() {
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

export async function deleteRecord(recordType, recordId) {
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    try {
        const response = await fetch(`/delete_${recordType}/${recordId}`, {
            method: 'POST',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken
            },
            body: JSON.stringify({})
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        showAlert(`An error occurred while deleting the ${recordType}: ${error.message}`, 'danger');
        return { success: false, error: error.message };
    }
}