// utils.js
export function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.role = 'alert';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

    // Try to find a suitable container for the alert
    const container = document.querySelector('.container') || 
                      document.querySelector('main') || 
                      document.querySelector('body');

    if (container) {
        container.insertAdjacentElement('afterbegin', alertDiv);
        setTimeout(() => alertDiv.remove(), 5000);
    } else {
        console.warn('No suitable container found for the alert message');
        console.log('Alert message:', message);
    }
}