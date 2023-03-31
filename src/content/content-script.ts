import browser from 'webextension-polyfill';

import main from './main';

// window onload 
window.addEventListener('load', async () => {

    console.log('content script loaded');
    
    const disabled = await browser.runtime.sendMessage({
        type: 'getDisabled',
    });

    console.log(disabled);
    

    if (!disabled) {
        main();
    }

    
    

});
