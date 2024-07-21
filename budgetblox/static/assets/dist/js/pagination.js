export function setupPagination(tableSelector, rowsPerPage = 10) {
    const table = document.querySelector(tableSelector);
    if (!table) {
        console.warn('Table not found for pagination');
        return;
    }
    const rows = table.querySelectorAll('tbody tr');
    const pageCount = Math.ceil(rows.length / rowsPerPage);
    const pagination = document.getElementById('pagination');
    if (!pagination) {
        console.warn('Pagination container not found');
        return;
    }

    pagination.innerHTML = ''; // Clear existing pagination

    for (let i = 1; i <= pageCount; i++) {
        const btn = document.createElement('button');
        btn.innerText = i;
        btn.classList.add('btn', 'btn-outline-primary', 'me-1');
        btn.addEventListener('click', () => showPage(i, rows, rowsPerPage));
        pagination.appendChild(btn);
    }

    showPage(1, rows, rowsPerPage);
}

export function showPage(page, rows, rowsPerPage) {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    rows.forEach((row, index) => {
        row.style.display = (index >= start && index < end) ? '' : 'none';
    });
}