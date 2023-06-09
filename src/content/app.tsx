
import { useContext, useEffect, useState } from 'react';
import browser from 'webextension-polyfill';
import Draggable, { DraggableData, DraggableEventHandler } from 'react-draggable';

import { AppStateContext } from './providers/use-app-state';

import ContextMenu from './context-menu';
import VideoPageHelper from './helpers/video-page-helper';
import ChannelPageHelper from './helpers/channel-page-helper';

import styles from './app.module.less';

let dragTimeoutId: NodeJS.Timeout;

export default function App(){
    const [url, setURL] = useState('');
    const [postId, setPostId] = useState('');
    const [silenceClick, setSilenceClick] = useState(false);
    const { 
        contextMenuOpen, setContextMenuOpen,
        darkMode,
        isOnVideoPage, setIsOnVideoPage,
    } = useContext(AppStateContext);

    useEffect(() => {

        let lastURL = '';
        console.log('Floaty Boi is running');

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
        
        if (url.includes('floatplane.com/post/')) {
            setIsOnVideoPage(true);
            setPostId(url.split('/').pop() || '');
            
        } else {
            setIsOnVideoPage(false);   
        }
    }, [url]);


    const buttonClickHandler = (event: React.MouseEvent) => {
        if (silenceClick) {
            event.stopPropagation();
            event.preventDefault();
        } else {
            setContextMenuOpen(!contextMenuOpen);
        }
    };

    const dragHandler : DraggableEventHandler = (_, data) => {

        if (Math.abs(data.deltaX) < 4 && Math.abs(data.deltaY) < 4) {
            clearTimeout(dragTimeoutId);
            dragTimeoutId = setTimeout(() => {
                setSilenceClick(false);
            }, 500);
        } else {
            setSilenceClick(true);
        }
        
    };

    

    
    return (
        <Draggable 
            bounds={{
                right: 0,
                bottom: 0,
            }}
            onDrag={dragHandler}
            handle={`.${styles.icon}`}
        >
            <div className={styles.container}>
           
                {
                    contextMenuOpen && (
                        <ContextMenu/>
                    )
                }
                <img 
                    onDragStart={(e) => e.preventDefault()}
                    onClick={buttonClickHandler} 
                    className={styles.icon} 
                    src={browser.runtime.getURL(`/assets/icon-${darkMode ? 'darkmode' : 'lightmode'}.svg`)} 
                    alt="floaty boi icon" />

            
            
                {
                    isOnVideoPage ? 
                        (<VideoPageHelper postId={postId}/>) :
                        (<ChannelPageHelper/>)
                }
            </div>
        </Draggable>
    );
}