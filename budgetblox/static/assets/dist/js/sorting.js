export function initializeSorting() {
    const tables = ['incomeTable', 'allocationTable'];
    
    tables.forEach(tableId => {
        const table = document.getElementById(tableId);
        const headers = table.querySelectorAll('th');
        
        headers.forEach((header, index) => {
            if (index > 0 && index < headers.length - 1) { // Skip the first and last columns
                header.style.cursor = 'pointer';
                header.addEventListener('click', () => sortTable(tableId, index));
            }
        });
    });
}

function sortTable(tableId, column) {
    const table = document.getElementById(tableId);
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    
    const sortDirection = table.dataset.sortDirection === 'asc' ? 'desc' : 'asc';
    table.dataset.sortDirection = sortDirection;
    
    rows.sort((a, b) => {
        const aValue = a.cells[column].textContent.trim();
        const bValue = b.cells[column].textContent.trim();
        
        if (column === 2) { // Assume column 2 is the amount column
            return sortDirection === 'asc' 
                ? parseFloat(aValue.replace(/[^0-9.-]+/g,"")) - parseFloat(bValue.replace(/[^0-9.-]+/g,""))
                : parseFloat(bValue.replace(/[^0-9.-]+/g,"")) - parseFloat(aValue.replace(/[^0-9.-]+/g,""));
        } else {
            return sortDirection === 'asc'
                ? aValue.localeCompare(bValue)
                : bValue.localeCompare(aValue);
        }
    });
    
    tbody.innerHTML = '';
    rows.forEach(row => tbody.appendChild(row));
    
    updateRowNumbers(table);
}

function updateRowNumbers(table) {
    const rows = table.querySelectorAll('tbody tr');
    rows.forEach((row, index) => {
        row.cells[0].textContent = index + 1;
    });
}