export function showAlert(message, type) {
    let container = document.querySelector('.container') || document.querySelector('main') || document.body;
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.role = 'alert';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    container.insertAdjacentElement('afterbegin', alertDiv);
    setTimeout(() => alertDiv.remove(), 5000);
}