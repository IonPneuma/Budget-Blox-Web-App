function showAllIncomeRecords() {
    var modal = document.getElementById("allRecordsIncomeModal");
    modal.style.display = "block";
    document.body.style.overflow = "hidden"; // Disable scrolling
}

function closeAllIncomeRecordsModal() {
    var modal = document.getElementById("allRecordsIncomeModal");
    modal.style.display = "none";
    document.body.style.overflow = "auto"; // Enable scrolling
}

// Close the modal if the user clicks outside of it
window.onclick = function(event) {
    var modal = document.getElementById("allRecordsIncomeModal");
    if (event.target == modal) {
        closeAllIncomeRecordsModal();
    }
};




function showAllExpenseRecords() {
    var modal = document.getElementById("allRecordsExpenseModal");
    modal.style.display = "block";
    document.body.style.overflow = "hidden"; // Disable scrolling
}

function closeAllExpenseRecordsModal() {
    var modal = document.getElementById("allRecordsExpenseModal");
    modal.style.display = "none";
    document.body.style.overflow = "auto"; // Enable scrolling
}

// Close the modal if the user clicks outside of it
window.onclick = function(event) {
    var modal = document.getElementById("allRecordsExpenseModal");
    if (event.target == modal) {
        closeAllExpenseRecordsModal();
    }
};




document.addEventListener('DOMContentLoaded', function () {
    window.sortTable = function (columnIndex) {
        const table = document.getElementById("incomeTable");
        let rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
        switching = true;
        dir = "asc";

        function parseDate(dateString) {
            const parts = dateString.split("-");
            return {
                day: parseInt(parts[0], 10),
                month: parseInt(parts[1], 10),
                year: parseInt(parts[2], 10)
            };
        }

        while (switching) {
            switching = false;
            rows = table.rows;

            for (i = 1; i < (rows.length - 1); i++) {
                shouldSwitch = false;
                x = rows[i].getElementsByTagName("TD")[columnIndex];
                y = rows[i + 1].getElementsByTagName("TD")[columnIndex];

                let xContent = x.innerHTML.trim().toLowerCase();
                let yContent = y.innerHTML.trim().toLowerCase();

                if (columnIndex === 3) { // Assuming the date column is the 4th column (index 3)
                    xContent = parseDate(xContent);
                    yContent = parseDate(yContent);

                    if (dir === "asc") {
                        if (xContent.year > yContent.year ||
                            (xContent.year === yContent.year && xContent.month > yContent.month) ||
                            (xContent.year === yContent.year && xContent.month === yContent.month && xContent.day > yContent.day)) {
                            shouldSwitch = true;
                            break;
                        }
                    } else if (dir === "desc") {
                        if (xContent.year < yContent.year ||
                            (xContent.year === yContent.year && xContent.month < yContent.month) ||
                            (xContent.year === yContent.year && xContent.month === yContent.month && xContent.day < yContent.day)) {
                            shouldSwitch = true;
                            break;
                        }
                    }
                } else if (!isNaN(parseFloat(xContent)) && !isNaN(parseFloat(yContent))) {
                    // Check if content is a number
                    xContent = parseFloat(xContent);
                    yContent = parseFloat(yContent);

                    if (dir === "asc") {
                        if (xContent > yContent) {
                            shouldSwitch = true;
                            break;
                        }
                    } else if (dir === "desc") {
                        if (xContent < yContent) {
                            shouldSwitch = true;
                            break;
                        }
                    }
                } else {
                    if (dir === "asc") {
                        if (xContent > yContent) {
                            shouldSwitch = true;
                            break;
                        }
                    } else if (dir === "desc") {
                        if (xContent < yContent) {
                            shouldSwitch = true;
                            break;
                        }
                    }
                }
            }

            if (shouldSwitch) {
                rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                switching = true;
                switchcount++;
            } else {
                if (switchcount === 0 && dir === "asc") {
                    dir = "desc";
                    switching = true;
                }
            }
        }
    };
});





document.addEventListener('DOMContentLoaded', function () {
    window.sortExpenseTable = function (columnIndex) {
        const table = document.getElementById("expenseTable");
        let rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
        switching = true;
        dir = "asc";

        function parseDate(dateString) {
            const parts = dateString.split("-");
            return {
                day: parseInt(parts[0], 10),
                month: parseInt(parts[1], 10),
                year: parseInt(parts[2], 10)
            };
        }

        while (switching) {
            switching = false;
            rows = table.rows;

            for (i = 1; i < (rows.length - 1); i++) {
                shouldSwitch = false;
                x = rows[i].getElementsByTagName("TD")[columnIndex];
                y = rows[i + 1].getElementsByTagName("TD")[columnIndex];

                let xContent = x.innerHTML.trim().toLowerCase();
                let yContent = y.innerHTML.trim().toLowerCase();

                if (columnIndex === 3) { // Assuming the date column is the 4th column (index 3)
                    xContent = parseDate(xContent);
                    yContent = parseDate(yContent);

                    if (dir === "asc") {
                        if (xContent.year > yContent.year ||
                            (xContent.year === yContent.year && xContent.month > yContent.month) ||
                            (xContent.year === yContent.year && xContent.month === yContent.month && xContent.day > yContent.day)) {
                            shouldSwitch = true;
                            break;
                        }
                    } else if (dir === "desc") {
                        if (xContent.year < yContent.year ||
                            (xContent.year === yContent.year && xContent.month < yContent.month) ||
                            (xContent.year === yContent.year && xContent.month === yContent.month && xContent.day < yContent.day)) {
                            shouldSwitch = true;
                            break;
                        }
                    }
                } else if (!isNaN(parseFloat(xContent)) && !isNaN(parseFloat(yContent))) {
                    // Check if content is a number
                    xContent = parseFloat(xContent);
                    yContent = parseFloat(yContent);

                    if (dir === "asc") {
                        if (xContent > yContent) {
                            shouldSwitch = true;
                            break;
                        }
                    } else if (dir === "desc") {
                        if (xContent < yContent) {
                            shouldSwitch = true;
                            break;
                        }
                    }
                } else {
                    if (dir === "asc") {
                        if (xContent > yContent) {
                            shouldSwitch = true;
                            break;
                        }
                    } else if (dir === "desc") {
                        if (xContent < yContent) {
                            shouldSwitch = true;
                            break;
                        }
                    }
                }
            }

            if (shouldSwitch) {
                rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                switching = true;
                switchcount++;
            } else {
                if (switchcount === 0 && dir === "asc") {
                    dir = "desc";
                    switching = true;
                }
            }
        }
    };
});




document.addEventListener('DOMContentLoaded', function () {
    window.sortModalTable = function (columnIndex) {
        const table = document.getElementById("modalTable");
        let rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
        switching = true;
        dir = "asc";

        function parseDate(dateString) {
            const parts = dateString.split("-");
            return {
                day: parseInt(parts[0], 10),
                month: parseInt(parts[1], 10),
                year: parseInt(parts[2], 10)
            };
        }

        while (switching) {
            switching = false;
            rows = table.rows;

            for (i = 1; i < (rows.length - 1); i++) {
                shouldSwitch = false;
                x = rows[i].getElementsByTagName("TD")[columnIndex];
                y = rows[i + 1].getElementsByTagName("TD")[columnIndex];

                let xContent = x.innerHTML.trim().toLowerCase();
                let yContent = y.innerHTML.trim().toLowerCase();

                if (columnIndex === 3) { // Assuming the date column is the 4th column (index 3)
                    xContent = parseDate(xContent);
                    yContent = parseDate(yContent);

                    if (dir === "asc") {
                        if (xContent.year > yContent.year ||
                            (xContent.year === yContent.year && xContent.month > yContent.month) ||
                            (xContent.year === yContent.year && xContent.month === yContent.month && xContent.day > yContent.day)) {
                            shouldSwitch = true;
                            break;
                        }
                    } else if (dir === "desc") {
                        if (xContent.year < yContent.year ||
                            (xContent.year === yContent.year && xContent.month < yContent.month) ||
                            (xContent.year === yContent.year && xContent.month === yContent.month && xContent.day < yContent.day)) {
                            shouldSwitch = true;
                            break;
                        }
                    }
                } else if (!isNaN(parseFloat(xContent)) && !isNaN(parseFloat(yContent))) {
                    // Check if content is a number
                    xContent = parseFloat(xContent);
                    yContent = parseFloat(yContent);

                    if (dir === "asc") {
                        if (xContent > yContent) {
                            shouldSwitch = true;
                            break;
                        }
                    } else if (dir === "desc") {
                        if (xContent < yContent) {
                            shouldSwitch = true;
                            break;
                        }
                    }
                } else {
                    if (dir === "asc") {
                        if (xContent > yContent) {
                            shouldSwitch = true;
                            break;
                        }
                    } else if (dir === "desc") {
                        if (xContent < yContent) {
                            shouldSwitch = true;
                            break;
                        }
                    }
                }
            }

            if (shouldSwitch) {
                rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                switching = true;
                switchcount++;
            } else {
                if (switchcount === 0 && dir === "asc") {
                    dir = "desc";
                    switching = true;
                }
            }
        }
    };
});





document.addEventListener('DOMContentLoaded', function () {
    window.sortModalTable2 = function (columnIndex) {
        const table = document.getElementById("modalTable2");
        let rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
        switching = true;
        dir = "asc";

        function parseDate(dateString) {
            const parts = dateString.split("-");
            return {
                day: parseInt(parts[0], 10),
                month: parseInt(parts[1], 10),
                year: parseInt(parts[2], 10)
            };
        }

        while (switching) {
            switching = false;
            rows = table.rows;

            for (i = 1; i < (rows.length - 1); i++) {
                shouldSwitch = false;
                x = rows[i].getElementsByTagName("TD")[columnIndex];
                y = rows[i + 1].getElementsByTagName("TD")[columnIndex];

                let xContent = x.innerHTML.trim().toLowerCase();
                let yContent = y.innerHTML.trim().toLowerCase();

                if (columnIndex === 3) { // Assuming the date column is the 4th column (index 3)
                    xContent = parseDate(xContent);
                    yContent = parseDate(yContent);

                    if (dir === "asc") {
                        if (xContent.year > yContent.year ||
                            (xContent.year === yContent.year && xContent.month > yContent.month) ||
                            (xContent.year === yContent.year && xContent.month === yContent.month && xContent.day > yContent.day)) {
                            shouldSwitch = true;
                            break;
                        }
                    } else if (dir === "desc") {
                        if (xContent.year < yContent.year ||
                            (xContent.year === yContent.year && xContent.month < yContent.month) ||
                            (xContent.year === yContent.year && xContent.month === yContent.month && xContent.day < yContent.day)) {
                            shouldSwitch = true;
                            break;
                        }
                    }
                } else if (!isNaN(parseFloat(xContent)) && !isNaN(parseFloat(yContent))) {
                    // Check if content is a number
                    xContent = parseFloat(xContent);
                    yContent = parseFloat(yContent);

                    if (dir === "asc") {
                        if (xContent > yContent) {
                            shouldSwitch = true;
                            break;
                        }
                    } else if (dir === "desc") {
                        if (xContent < yContent) {
                            shouldSwitch = true;
                            break;
                        }
                    }
                } else {
                    if (dir === "asc") {
                        if (xContent > yContent) {
                            shouldSwitch = true;
                            break;
                        }
                    } else if (dir === "desc") {
                        if (xContent < yContent) {
                            shouldSwitch = true;
                            break;
                        }
                    }
                }
            }

            if (shouldSwitch) {
                rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                switching = true;
                switchcount++;
            } else {
                if (switchcount === 0 && dir === "asc") {
                    dir = "desc";
                    switching = true;
                }
            }
        }
    };
});

