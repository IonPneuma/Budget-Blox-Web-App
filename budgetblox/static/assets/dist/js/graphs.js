let cashFlowChart, incomeDistributionChart, expenseDistributionChart, monthlyComparisonChart;

async function fetchData(currency) {
    try {
        const response = await fetch(`/api/financial_data?currency=${currency}`);
        const data = await response.json();
        console.log('Fetched data:', data);
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function createCashFlowChart(data) {
    const ctx = document.getElementById('cashflowChart').getContext('2d');
    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.dates,
            datasets: [{
                label: 'Income',
                data: data.incomes,
                borderColor: 'rgba(75, 192, 192, 1)',
                tension: 0.1
            }, {
                label: 'Expenses',
                data: data.expenses,
                borderColor: 'rgba(255, 99, 132, 1)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Amount'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Date'
                    }
                }
            }
        }
    });
}

function createDistributionChart(elementId, data, label) {
    const ctx = document.getElementById(elementId).getContext('2d');
    return new Chart(ctx, {
        type: 'pie',
        data: {
            labels: data.labels,
            datasets: [{
                label: label,
                data: data.values,
                backgroundColor: [
                    'rgb(0, 50, 133)',
                    'rgb(255, 127, 62)',
                    'rgb(255, 218, 120)',
                    'rgb(36, 7, 80)',
                    'rgb(87, 166, 161)',
                    'rgb(42, 98, 154)',
                    'rgb(197, 255, 149)',
                    'rgb(238, 78, 78)',
                    'rgba(103, 102, 155, 0.8)',
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'right',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.label || '';
                            if (label) {
                                label += ': ';
                            }
                            const value = context.parsed;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((value / total) * 100);
                            label += `${percentage}%`;
                            return label;
                        }
                    }
                }
            }
        }
    });
}

function createMonthlyComparisonChart(data) {
    const ctx = document.getElementById('monthlyComparisonChart').getContext('2d');
    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.months,
            datasets: [{
                label: 'Income',
                data: data.monthlyIncomes,
                backgroundColor: 'rgba(75, 192, 192, 0.8)',
            }, {
                label: 'Expenses',
                data: data.monthlyExpenses,
                backgroundColor: 'rgba(255, 99, 132, 0.8)',
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Amount'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Month'
                    }
                }
            }
        }
    });
}

async function updateDashboard(currency) {
    console.log('Updating dashboard with currency:', currency);
    try {
        const data = await fetchData(currency);
        console.log('Received data:', data);
        
        // Update UI elements
        document.getElementById('totalIncome').textContent = data.totalIncome;
        document.getElementById('totalExpenses').textContent = data.totalExpenses;
        document.getElementById('netCashFlow').textContent = data.netCashFlow;

        // Update or create charts
        if (cashFlowChart) {
            cashFlowChart.data.labels = data.dates;
            cashFlowChart.data.datasets[0].data = data.incomes;
            cashFlowChart.data.datasets[1].data = data.expenses;
            cashFlowChart.update();
        } else {
            cashFlowChart = createCashFlowChart(data);
        }

        if (incomeDistributionChart) {
            incomeDistributionChart.data.labels = data.incomeDistribution.labels;
            incomeDistributionChart.data.datasets[0].data = data.incomeDistribution.values;
            incomeDistributionChart.update();
        } else {
            incomeDistributionChart = createDistributionChart('incomeDistributionChart', data.incomeDistribution, 'Income Sources');
        }

        if (expenseDistributionChart) {
            expenseDistributionChart.data.labels = data.expenseDistribution.labels;
            expenseDistributionChart.data.datasets[0].data = data.expenseDistribution.values;
            expenseDistributionChart.update();
        } else {
            expenseDistributionChart = createDistributionChart('expenseDistributionChart', data.expenseDistribution, 'Expense Categories');
        }

        if (monthlyComparisonChart) {
            monthlyComparisonChart.data.labels = data.months;
            monthlyComparisonChart.data.datasets[0].data = data.monthlyIncomes;
            monthlyComparisonChart.data.datasets[1].data = data.monthlyExpenses;
            monthlyComparisonChart.update();
        } else {
            monthlyComparisonChart = createMonthlyComparisonChart(data);
        }

    } catch (error) {
        console.error('Error updating dashboard:', error);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded and parsed');
    // Event listener for currency selector
    const currencySelector = document.getElementById('currencySelector');
    console.log('Currency selector element:', currencySelector);

    if (currencySelector) {
        currencySelector.addEventListener('change', function() {
            console.log('Currency changed to:', this.value);
            updateDashboard(this.value);
        });
    } else {
        console.error('Currency selector not found in the DOM');
    }

    // Initial dashboard update
    console.log('Initializing dashboard with EUR');
    updateDashboard('EUR');
});