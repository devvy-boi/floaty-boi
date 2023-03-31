import browser from 'webextension-polyfill';
import waitForElement from '../utils/wait-for-element';

import styles from '../app.module.less';
import { useEffect } from 'react';

const parseVideoLink = async (videoLink: HTMLAnchorElement) => {
                        
    const postId = videoLink.href.split('/').pop();

    if (videoLink.querySelector('.floaty-progress')) {
        return;
    }

    const thumbnailContainer = videoLink.querySelector('.PostTileThumbnail');
    
        
    if (postId && thumbnailContainer) {
        // send a message to the background script to get the last time
        browser.runtime.sendMessage({type: 'getLastTime', postId}).then(async (postInfo) => {
            if (!postInfo || !postInfo.lastTime || !postInfo.duration) {
                return;
            }
            

            const thumbnail = await waitForElement('img', thumbnailContainer, false) as HTMLElement;
            

            Object.assign(thumbnail.style, {
                transition: 'all 0.5s ease',
                filter: 'brightness(0.5)',
            });

            const { lastTime, duration } = postInfo;

            console.log('lastTime', lastTime);
            
                
            const percentage = lastTime / duration * 100;
            const progressElement = document.createElement('div');
            progressElement.className = styles.progress + ' floaty-progress';
            progressElement.style.width = `${percentage}%`;
            thumbnailContainer.appendChild(progressElement);

        });
    }
};

export default function ChannelPageHelper(){
    useEffect(()=>{
        setTimeout(() => {
            // get all the video links
            waitForElement('.ReactVideoFeed a[href*="/post/"]', document.body, true).then((videoLinks) => {
            
                // loop through all the video links and get the post id
                videoLinks.forEach(parseVideoLink);

                // create a mutation observer to watch for new videos
                const observer = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        if (mutation.addedNodes.length) {
                            
                            
                            const videoLink = mutation.addedNodes[0].querySelector('a[href*="/post/"]');

                            if (videoLink) {
                                parseVideoLink(videoLink);
                            }
                        }
                    });
                });

                const videoFeedContainer = document.querySelector('.ReactVideoFeed');

                if (!videoFeedContainer) {
                    return;
                }

                // start watching for new videos
                observer.observe(videoFeedContainer, {
                    childList: true,
                });
            });
        }, 1000);
    },[]);
    


    
    return (<></>);
}