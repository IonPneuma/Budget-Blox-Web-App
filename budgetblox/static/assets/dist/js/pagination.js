import { showPage } from './tableOperations.js';

export function initializePagination() {
    const tables = [
        { tableId: 'incomeTable', paginationId: 'incomePagination' },
        { tableId: 'allocationTable', paginationId: 'allocationPagination' }
    ];

    tables.forEach(({ tableId, paginationId }) => {
        updatePaginationForTable(tableId);
        
        const pagination = document.getElementById(paginationId);
        if (pagination) {
            pagination.addEventListener('click', function(e) {
                if (e.target.tagName === 'A') {
                    e.preventDefault();
                    const page = parseInt(e.target.dataset.page);
                    showPage(tableId, page);
                }
            });
        }
    });
}

export function updatePaginationForTable(tableId) {
    const table = document.getElementById(tableId);
    const pagination = document.getElementById(tableId + 'Pagination');
    if (table && pagination) {
        const rowCount = table.querySelectorAll('tbody tr').length;
        const pageCount = Math.ceil(rowCount / 8);
        
        pagination.innerHTML = '';
        for (let i = 1; i <= pageCount; i++) {
            const li = document.createElement('li');
            li.className = 'page-item';
            li.innerHTML = `<a class="page-link" href="#" data-page="${i}">${i}</a>`;
            pagination.appendChild(li);
        }
        
        const currentPage = parseInt(pagination.querySelector('.active')?.textContent) || 1;
        const newPage = Math.min(currentPage, pageCount);
        
        showPage(tableId, newPage);
    }
}