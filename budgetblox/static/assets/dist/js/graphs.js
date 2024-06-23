// ... (keep the existing fetchData function) ...
document.addEventListener('DOMContentLoaded', function() {

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
                        'rgba(255, 99, 132, 0.8)',
                        'rgba(54, 162, 235, 0.8)',
                        'rgba(255, 206, 86, 0.8)',
                        'rgba(75, 192, 192, 0.8)',
                        'rgba(153, 102, 255, 0.8)',
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
        const data = await fetchData(currency);
        
        // Update total numbers
        document.getElementById('totalIncome').textContent = data.totalIncome;
        document.getElementById('totalExpenses').textContent = data.totalExpenses;
        document.getElementById('netCashFlow').textContent = data.netCashFlow;
        
        // Update or create charts
        if (window.cashFlowChart) {
            window.cashFlowChart.data.labels = data.dates;
            window.cashFlowChart.data.datasets[0].data = data.incomes;
            window.cashFlowChart.data.datasets[1].data = data.expenses;
            window.cashFlowChart.update();
        } else {
            window.cashFlowChart = createCashFlowChart(data);
        }
        
        if (window.incomeDistributionChart) {
            window.incomeDistributionChart.data.labels = data.incomeDistribution.labels;
            window.incomeDistributionChart.data.datasets[0].data = data.incomeDistribution.values;
            window.incomeDistributionChart.update();
        } else {
            window.incomeDistributionChart = createDistributionChart('incomeDistributionChart', data.incomeDistribution, 'Income Sources');
        }
        
        if (window.expenseDistributionChart) {
            window.expenseDistributionChart.data.labels = data.expenseDistribution.labels;
            window.expenseDistributionChart.data.datasets[0].data = data.expenseDistribution.values;
            window.expenseDistributionChart.update();
        } else {
            window.expenseDistributionChart = createDistributionChart('expenseDistributionChart', data.expenseDistribution, 'Expense Categories');
        }
        
        if (window.monthlyComparisonChart) {
            window.monthlyComparisonChart.data.labels = data.months;
            window.monthlyComparisonChart.data.datasets[0].data = data.monthlyIncomes;
            window.monthlyComparisonChart.data.datasets[1].data = data.monthlyExpenses;
            window.monthlyComparisonChart.update();
        } else {
            window.monthlyComparisonChart = createMonthlyComparisonChart(data);
        }
    }

    // Event listener for currency selector
    document.getElementById('currencySelector').addEventListener('change', function() {
        updateDashboard(this.value);
    });

// Initial dashboard update
    updateDashboard('EUR');
});