
import { useContext, useEffect, useState } from 'react';
import browser from 'webextension-polyfill';
import Draggable, { DraggableData } from 'react-draggable';

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


    const buttonClickHandler = (event: React.MouseEvent) => {
        console.log('button clicked', silenceClick);
        
        if (silenceClick) {
            event.stopPropagation();
            event.preventDefault();
        } else {
            setContextMenuOpen(!contextMenuOpen);
        }

        
    };

    const dragHandler = (_, data: DraggableData) => {
        
        setSilenceClick(true);  

        if (Math.abs(data.deltaX) < 4 && Math.abs(data.deltaY) < 4) {
            clearTimeout(dragTimeoutId);
            dragTimeoutId = setTimeout(() => {
                setSilenceClick(false);
            }, 500);
        }
        
    };

    

    
    return (
        <Draggable 
            bounds={{
                right: 0,
                bottom: 0,
            }}
            onDrag={dragHandler}
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