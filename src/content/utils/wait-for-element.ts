export default function waitForElement(selector: string, parent: Element, multiple = false) : Promise<Element> {

    const searchParent = parent || document.body;
    
    const doSelector = () => {
        if (multiple) {
            return searchParent.querySelectorAll(selector);
        }
        return searchParent.querySelector(selector);
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

        observer.observe(searchParent, {
            childList: true,
            subtree: true
        });
    });
}
