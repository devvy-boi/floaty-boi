import styles from './app.module.less';
import browser from 'webextension-polyfill';
import { useContext, useEffect, useState } from 'react';
import VideoPageHelper from './helpers/video-page-helper';
import ChannelPageHelper from './helpers/channel-page-helper';
import ContextMenu from './context-menu';

import { AppStateContext } from './providers/use-app-state';

export default function App(){
    const [url, setURL] = useState('');
    const [postId, setPostId] = useState('');
    const [isOnVideoPage, setIsOnVideoPage] = useState(false);
    const { 
        contextMenuOpen, setContextMenuOpen,
        darkMode,
    } = useContext(AppStateContext);

    useEffect(() => {

        let lastURL = '';
        console.log('content script loaded');

        let timeoutId: NodeJS.Timeout | undefined;
        
        const observer = new MutationObserver(() => {
            clearTimeout(timeoutId);

            setTimeout(() => {
                const newURL = window.location.href;
                if (newURL !== lastURL) {
                    setURL(newURL);
                    lastURL = newURL;
                }    
            }, 250);
            
        });

        observer.observe(document, {
            childList: true,
            subtree: true,
        });

    }, []);




    useEffect(() => {
        if (url === '') {
            return; 
        }

        console.log('url changed', url);
        
        if (url.includes('floatplane.com/post/')) {
            setIsOnVideoPage(true);
            setPostId(url.split('/').pop() || '');
            
        } else {
            setIsOnVideoPage(false);   
        }
    }, [url]);

    

    
    return (
        <div className={styles.container}>
            {
                contextMenuOpen && (
                    <ContextMenu/>
                )
            }
            <img 
                onClick={()=> setContextMenuOpen(!contextMenuOpen)} 
                className={styles.icon} 
                src={browser.runtime.getURL(`/assets/icon-${darkMode ? 'darkmode' : 'lightmode'}.svg`)} 
                alt="floaty boi icon" />
            {
                isOnVideoPage ? 
                    (<VideoPageHelper postId={postId}/>) :
                    (<ChannelPageHelper/>)
            }
        </div>
    );
}