import browser from 'webextension-polyfill';
import waitForElement from '../utils/wait-for-element';

import styles from '../app.module.less';
import { useEffect } from 'react';


export default function ChannelPageHelper(){
    useEffect(()=>{
        setTimeout(() => {
            // get all the video links
            waitForElement('.ReactVideoFeed a[href*="/post/"]', true).then((videoLinks) => {
            
                // loop through all the video links and get the post id
                videoLinks.forEach((videoLink ) => {
                        
                    const postId = videoLink.href.split('/').pop();
    
                    if (videoLink.querySelector('.floaty-progress')) {
                        return;
                    }
        
                    const thumbnailContainer = videoLink.querySelector('.PostTileThumbnail');
                        
                    if (postId && thumbnailContainer) {
                        // send a message to the background script to get the last time
                        browser.runtime.sendMessage({type: 'getLastTime', postId}).then((postInfo) => {
                            if (!postInfo || !postInfo.lastTime || !postInfo.duration) {
                                return;
                            }

                            const thumbnail = thumbnailContainer.querySelector('img');

                            Object.assign(thumbnail.style, {
                                transition: 'all 0.5s ease',
                                filter: 'brightness(0.5)',
                            });
        
                            const { lastTime, duration } = postInfo;
                                
                            const percentage = lastTime / duration * 100;
                            const progressElement = document.createElement('div');
                            progressElement.className = styles.progress + ' floaty-progress';
                            progressElement.style.width = `${percentage}%`;
                            thumbnailContainer.appendChild(progressElement);
        
                        });
                    }
                });
            });
        }, 1000);
    },[]);
    


    
    return (<></>);
}