import { initializeSorting } from './sorting.js';
import { deleteRecord } from './api.js';
import { showAlert } from './utils.js';

document.addEventListener('DOMContentLoaded', function() {
    initializeSorting();
    setupPagination();
    setupSearch();
    setupDateFilter();
    setupTypeFilter();
    setupExport();
    setupDeleteListeners();
});

function setupPagination() {
    const table = document.querySelector('table');
    const rows = table.querySelectorAll('tbody tr');
    const rowsPerPage = 10;
    const pageCount = Math.ceil(rows.length / rowsPerPage);
    const pagination = document.getElementById('pagination');

    for (let i = 1; i <= pageCount; i++) {
        const btn = document.createElement('button');
        btn.innerText = i;
        btn.classList.add('btn', 'btn-outline-primary', 'me-1');
        btn.addEventListener('click', () => showPage(i, rows, rowsPerPage));
        pagination.appendChild(btn);
    }

    showPage(1, rows, rowsPerPage);
}

function showPage(page, rows, rowsPerPage) {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    rows.forEach((row, index) => {
        row.style.display = (index >= start && index < end) ? '' : 'none';
    });
}

function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const rows = document.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(searchTerm) ? '' : 'none';
        });
    });
}

function setupDateFilter() {
    const filterBtn = document.getElementById('filterDates');
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

function setupExport() {
    document.getElementById('exportCSV').addEventListener('click', exportToCSV);
    document.getElementById('exportPDF').addEventListener('click', exportToPDF);
}

function exportToCSV() {
    const table = document.querySelector('table');
    let csv = [];
    const rows = table.querySelectorAll('tr');
    
    for (let i = 0; i < rows.length; i++) {
        let row = [], cols = rows[i].querySelectorAll('td, th');
        
        for (let j = 0; j < cols.length; j++) 
            row.push(cols[j].innerText);
        
        csv.push(row.join(","));        
    }

    downloadCSV(csv.join("\n"), 'export.csv');
}

function downloadCSV(csv, filename) {
    let csvFile = new Blob([csv], {type: "text/csv"});
    let downloadLink = document.createElement("a");
    downloadLink.download = filename;
    downloadLink.href = window.URL.createObjectURL(csvFile);
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
    downloadLink.click();
}

function exportToPDF() {
    import('jspdf').then(module => {
        const jsPDF = module.default;
        import('jspdf-autotable').then(() => {
            const doc = new jsPDF();
            doc.autoTable({ html: 'table' });
            doc.save('export.pdf');
        });
    });
}

function setupDeleteListeners() {
    document.body.addEventListener('click', async function(e) {
        if (e.target && e.target.classList.contains('delete-record')) {
            const recordType = e.target.dataset.type;
            const recordId = e.target.dataset.id;
            if (confirm(`Are you sure you want to delete this ${recordType}?`)) {
                const result = await deleteRecord(recordType, recordId);
                if (result.success) {
                    e.target.closest('tr').remove();
                    showAlert(`${recordType.charAt(0).toUpperCase() + recordType.slice(1)} deleted successfully!`, 'success');
                }
            }
        }
    });
}