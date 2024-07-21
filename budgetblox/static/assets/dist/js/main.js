import { setupAllRecords } from './allRecords.js';
import { updateDashboard, setupEventListeners } from './tableOperations.js';
import { setupAjaxForms, setupProjectUpdates } from './ajax.js';



document.addEventListener('DOMContentLoaded', function() {
    updateDashboard();
    setupEventListeners();
    setupAjaxForms();
    setupProjectUpdates();
    setupAllRecords();
    setupExport();
    
    
    
});

function setupAllocationTabs() {
    const expensesBtn = document.getElementById('expensesBtn');
    const savingsBtn = document.getElementById('savingsBtn');
    const investmentsBtn = document.getElementById('investmentsBtn');
    const expensesForm = document.getElementById('expensesForm');
    const savingsForm = document.getElementById('savingsForm');
    const investmentsForm = document.getElementById('investmentsForm');

    function showForm(formToShow, activeBtn) {
        [expensesForm, savingsForm, investmentsForm].forEach(form => {
            if (form) form.style.display = 'none';
        });
        if (formToShow) formToShow.style.display = 'block';
        
        // Remove active class from all buttons and add to the clicked one
        [expensesBtn, savingsBtn, investmentsBtn].forEach(btn => {
            btn.classList.remove('active');
        });
        activeBtn.classList.add('active');
    }

    if (expensesBtn) expensesBtn.addEventListener('click', () => showForm(expensesForm, expensesBtn));
    if (savingsBtn) savingsBtn.addEventListener('click', () => showForm(savingsForm, savingsBtn));
    if (investmentsBtn) investmentsBtn.addEventListener('click', () => showForm(investmentsForm, investmentsBtn));

    // Show expenses form by default
    showForm(expensesForm, expensesBtn);
}

document.addEventListener('DOMContentLoaded', setupAllocationTabs);



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
        
        for (let j = 0; j < cols.length - 1; j++) {  // Skip the last column (Actions)
            // Replace &nbsp; with empty string and trim the content
            let content = cols[j].textContent.replace(/\u00a0/g, '').trim();
            // Escape double quotes and enclose fields containing commas in double quotes
            content = content.includes(',') ? `"${content.replace(/"/g, '""')}"` : content;
            row.push(content);
        }
        
        csv.push(row.join(","));        
    }

    // Get the project title for the filename
    const projectTitle = document.querySelector('h1').textContent.trim();
    downloadCSV(csv.join("\n"), `${projectTitle}.csv`);
}

function downloadCSV(csv, filename) {
    const csvFile = new Blob([csv], {type: "text/csv"});
    const downloadLink = document.createElement("a");
    downloadLink.download = filename;
    downloadLink.href = window.URL.createObjectURL(csvFile);
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}


function exportToPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    const table = document.querySelector('table');
    const tableHeaders = Array.from(table.querySelectorAll('th')).map(th => th.textContent);
    const tableRows = Array.from(table.querySelectorAll('tbody tr')).map(tr => 
        Array.from(tr.querySelectorAll('td')).map(td => td.textContent)
    );

    // Remove the last column (Actions) from headers and rows
    tableHeaders.pop();
    tableRows.forEach(row => row.pop());

    doc.autoTable({
        head: [tableHeaders],
        body: tableRows,
    });

    // Get the current page title
    const title = document.querySelector('h1').textContent;
    
    // Save the PDF
    doc.save(`${title}.pdf`);
}

// Update the event listener for the PDF export button
document.getElementById('exportPDF').addEventListener('click', exportToPDF);



