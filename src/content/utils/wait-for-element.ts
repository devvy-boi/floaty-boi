export default function waitForElement(selector: string, multiple = false) : Promise<Element> {
    const doSelector = () => {
        if (multiple) {
            return document.querySelectorAll(selector);
        }
        return document.querySelector(selector);
    };

    return new Promise(resolve => {
        if (doSelector()) {
            return resolve(doSelector() as Element);
        }

        const observer = new MutationObserver(() => {
            const result = doSelector();
            
            if (result) {
                resolve(result as Element);
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}
