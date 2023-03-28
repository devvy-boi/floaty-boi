export default function (){
    const url = window.location.href;

    if (url.includes('floatplane.com/post/')) {
        return url.split('/').pop() || '';
    }
}