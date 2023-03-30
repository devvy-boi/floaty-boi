import browser from 'webextension-polyfill';


// get messages from the content script

browser.runtime.onInstalled.addListener(() => {
    const url = browser.runtime.getURL('/assets/welcome.html');

    browser.tabs.create({
        url,
        active: true
    });
});

browser.runtime.onMessage.addListener((message) => {
    if (message.type === 'timeUpdate') {

        // store the current time in the extension local storage
        browser.storage.local.set({
            [message.postId]: {
                lastTime: message.currentTime,
                duration: message.duration,
            }
        });

        return Promise.resolve();
    }

    if(message.type === 'getLastTime'){
        // get the current time from the extension local storage
        return browser.storage.local.get(message.postId)
            .then((data) => {
                // send a message to the content script with the current time
                return Promise.resolve(data[message.postId]);
            })
            .catch((error) => {
                return Promise.reject(error);
            });
    }

    if(message.type === 'addToWatchLater'){
        const value = message.value as Post;
        
        // store the postId in the extension local storage
        browser.storage.local.get('watchLater')
            .then(({watchLater})=>{
                let _watchLater = watchLater || [];

                _watchLater = _watchLater.filter((item: Post)=>{
                    console.log(item);
                    
                    return item.id !== value.id;
                });

                _watchLater.push(value);

                return browser.storage.local.set({
                    watchLater: _watchLater
                });
            })
            .catch(error=>{
                console.log(error);
            });

    }

    if(message.type === 'removeFromWatchLater'){
        const value = message.value as Post;
        
        // store the postId in the extension local storage
        browser.storage.local.get('watchLater')
            .then(({watchLater})=>{
                let _watchLater = watchLater || [];

                _watchLater = _watchLater.filter((item: Post)=>{
                    console.log(item);
                    
                    return item.id !== value.id;
                });

                return browser.storage.local.set({
                    watchLater: _watchLater
                });
            })
            .catch(error=>{
                console.log(error);
            });
    }

    if(message.type === 'getWatchLater'){
        // get the watch later list from the extension local storage
        return browser.storage.local.get('watchLater')
            .then(({watchLater})=>{
                console.log(watchLater);
                
                return Promise.resolve(watchLater || []);
            })
            .catch(error=>{
                return Promise.reject(error);
            });
    }

    if(message.type === 'setDarkMode'){
        // store the dark mode in the extension local storage
        browser.storage.local.set({
            darkMode: message.value
        });
    }

    if(message.type === 'getDarkMode'){
        // get the dark mode from the extension local storage
        return browser.storage.local.get('darkMode')
            .then(({darkMode})=>{
                return Promise.resolve(darkMode);
            })
            .catch(error=>{
                return Promise.reject(error);
            });
    }

    if (message.type ==='exportStorage') {
        return browser.storage.local.get()
            .then((data)=>{
                return Promise.resolve(data);
            })
            .catch((error)=>{
                return Promise.reject(error);
            });
    }

    if (message.type ==='importStorage') {
        return browser.storage.local.set(message.value)
            .then(()=>{
                return Promise.resolve();
            })
            .catch((error)=>{
                return Promise.reject(error);
            });
    }


    
});
