import jquery from 'jquery';

// Make jQuery available globally
window.jQuery = jquery;
window.$ = jquery;

// Export jQuery for module systems
export default jquery;
export const $ = jquery;
export const jQuery = jquery;