import { useEffect, useState, useContext } from 'react';
import browser from 'webextension-polyfill';

import { AppStateContext } from '../providers/use-app-state';

import waitForElement from '../utils/wait-for-element';

interface VideoPageHelperProps {
    postId: string;
}

export default function VideoPageHelper({postId}: VideoPageHelperProps){
    const {enableResume} = useContext(AppStateContext);

    useEffect(() => {
        setTimeout(() => {
            browser.runtime.sendMessage({type: 'getLastTime', postId}).then((postInfo) => {

                waitForElement('video.vjs-tech', document.body).then((element) =>{
                    const videoElement = element as HTMLVideoElement;
                    
                    if (postInfo?.lastTime && enableResume) {
                        console.log('got last time', postInfo.lastTime);
                        videoElement.currentTime = postInfo.lastTime;
                    }
    
                    console.log('video element found');
                    
                    let timeUpdates = 0;
    
                    // add a listener to the video element to send a message to the background script with the current time
                    videoElement.addEventListener('timeupdate', () => {
    
                        const currentTime = videoElement.currentTime;
    
                        timeUpdates++;
    
                        if (timeUpdates > 4 && currentTime != 0) {
                            timeUpdates = 0;
                            console.log('time update', currentTime);
                        
                            browser.runtime.sendMessage({
                                type: 'timeUpdate',
                                postId,
                                currentTime: currentTime,
                                duration: videoElement.duration,
                            });    
                        }
                    });
                });
            });
        }, 1000);

    }, []);

    return (
        <div>
        </div>
    );
}