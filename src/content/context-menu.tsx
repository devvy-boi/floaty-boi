import React, { useEffect, useState, useContext } from 'react';

import { AppStateContext } from './providers/use-app-state';

import styles from './context-menu.module.less';
import getPoster from './utils/get-poster';
import getCurrentPostId from './utils/get-current-post-id';

import { runtime } from 'webextension-polyfill';

export default function ContextMenu(){
    const { 
        darkMode, setDarkMode,
        watchLater, addToWatchLater, removeFromWatchLater,
        isOnVideoPage
    } = useContext(AppStateContext);

    const saveForLater = () => {
        const postId = getCurrentPostId();
        const title = document.querySelector('video-title')?.textContent || document.title;
        if (postId) {
            addToWatchLater({
                id: postId,
                poster: getPoster(),
                title
            });
        }
    };
    
    const removeWatchlistedVideo = (post: Post, event: React.MouseEvent) => {
        event.stopPropagation();
        event.preventDefault();
        removeFromWatchLater(post);
    };

    const clampText = (text: string, length: number) => {
        if (text.length > length) {
            return `${text.substring(0, length)}...`;
        }
        return text;
    };




    return (
        <div className={`${styles.container} ${darkMode ? styles.dark: ''}`}>
            <h2>Floaty Boi Settings</h2>
            <button onClick={()=>setDarkMode(!darkMode)}>
                Turn {darkMode ? 'Off' : 'On'} Dark Mode
            </button>
            
            {
                isOnVideoPage && (
                    <button onClick={saveForLater}>
                        Add to Watch Later
                    </button>
                )
            }
            

            {
                watchLater.length === 0 ? 
                    <h3>Watchlist is empty</h3> :
                    <h3>Watchlist</h3>

            }
            <div className={styles.watchLaterContainer}>
                {
                    watchLater.map((post) => {
                        return (
                            <a className={styles.postTile} href={`/post/${post.id}`} key={post.id}>
                                <img className={styles.posterBg} src={post.poster} alt={post.title} />

                                <img src={post.poster} className={styles.posterSquare} alt={post.title} />
                                <h5>{clampText(post.title as string, 50)}</h5>

                                <div onClick={(event)=> removeWatchlistedVideo(post, event)} className={styles.remove}>
                                    ×
                                </div>
                            </a>
                        );
                    })
                }
            </div>
        </div>
    );
}