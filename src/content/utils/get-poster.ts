export default function() {
    const videoElement = document.querySelector('video');
    if (videoElement) {
        return videoElement.getAttribute('poster') as string;
    }
    return '';
}