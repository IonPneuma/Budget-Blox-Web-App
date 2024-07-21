import { setupPagination } from './pagination.js';

export function initializeSorting() {
    // Implement sorting logic here
    console.log('Sorting initialized');
}

function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            const searchTerm = searchInput.value.toLowerCase();
            const rows = document.querySelectorAll('tbody tr');
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(searchTerm) ? '' : 'none';
            });
        });
    }
}

function setupDateFilter() {
    const filterBtn = document.getElementById('filterDates');
    if (filterBtn) {
        filterBtn.addEventListener('click', () => {
            const fromDate = new Date(document.getElementById('dateFrom').value);
            const toDate = new Date(document.getElementById('dateTo').value);
            const rows = document.querySelectorAll('tbody tr');
            rows.forEach(row => {
                const date = new Date(row.cells[3].textContent);
                row.style.display = (date >= fromDate && date <= toDate) ? '' : 'none';
            });
        });
    }
}

function setupTypeFilter() {
    const typeFilter = document.getElementById('typeFilter');
    if (typeFilter) {
        typeFilter.addEventListener('change', () => {
            const selectedType = typeFilter.value;
            const rows = document.querySelectorAll('tbody tr');
            rows.forEach(row => {
                const type = row.cells[4].textContent;
                row.style.display = (selectedType === '' || type === selectedType) ? '' : 'none';
            });
        });
    }
}

export function setupAllRecords() {
    setupPagination('table');
    setupSearch();
    setupDateFilter();
    setupTypeFilter();
    initializeSorting();
    
    
}

document.addEventListener('DOMContentLoaded', setupAllRecords);