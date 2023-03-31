export default function waitForElement(selector: string, parent: Element, multiple = false) : Promise<Element | NodeListOf<Element>> {

    const searchParent = parent || document.body;
    
    const doSelector = () => {
        if (multiple) {
            return searchParent.querySelectorAll(selector);
        }
        return searchParent.querySelector(selector);
    };

    return new Promise(resolve => {
        // try to get the element immediately
        const result = doSelector();

        // if we get a result, return it
        if (result) {
            return resolve(result);
        }

        // otherwise, wait for it to appear
        const observer = new MutationObserver(() => {
            const result = doSelector();
            
            if (result) {
                resolve(result);
                observer.disconnect();
            }
        });

        observer.observe(searchParent, {
            childList: true,
            subtree: true
        });
    });
}
