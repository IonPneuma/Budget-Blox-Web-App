document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.update-project-form').forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const projectId = this.dataset.projectId;
            const formData = new FormData(this);

            fetch(`/update_project/${projectId}`, {
                method: 'POST',
                body: formData,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    const row = document.getElementById(`project-row-${projectId}`);
                    row.querySelector('td:nth-child(2)').textContent = data.name;
                    row.querySelector('td:nth-child(4)').textContent = `${data.currency_symbol} ${data.currency}`;
                    showAlert('Project updated successfully!', 'success');
                } else {
                    showAlert('Failed to update project. ' + JSON.stringify(data.error), 'danger');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showAlert('An error occurred while updating the project.', 'danger');
            });
        });
    });

    function showAlert(message, type) {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
        alertDiv.role = 'alert';
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        document.querySelector('.container').insertAdjacentElement('afterbegin', alertDiv);
        setTimeout(() => alertDiv.remove(), 5000);
    }
});