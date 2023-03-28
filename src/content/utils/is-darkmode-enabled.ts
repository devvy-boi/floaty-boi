export default function isDarkModeEnabled(): boolean {
    const wrapper = document.querySelector('#page-wrapper, floatplane-app');

    if (wrapper) {
        return wrapper.classList.contains('floaty-dark');
    }

    return false;
}