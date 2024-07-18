import { initializeSorting } from './sorting.js';
import { updateDashboard, setupEventListeners } from './tableOperations.js';

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded event fired');
    initializeSorting();
    updateDashboard();
    setupEventListeners();
});