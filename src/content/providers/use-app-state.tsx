import { useState, createContext, useMemo, useEffect } from 'react';

import {runtime} from 'webextension-polyfill';

export interface State {
    contextMenuOpen: boolean;
    setContextMenuOpen: (open: boolean) => void;

    enableResume: boolean;
    setEnableResume: (enableResume: boolean) => void;

    darkMode: boolean;
    setDarkMode: (darkMode: boolean) => void;

    watchLater: Post[];
    addToWatchLater: (post: Post) => void;

    isOnVideoPage: boolean;
    setIsOnVideoPage: (isOnVideoPage: boolean) => void;
}

export const AppStateContext = createContext({} as State);

interface AppStateProviderProps {
    children: React.ReactNode;
}

export function AppStateProvider({ children }: AppStateProviderProps) {
    const [contextMenuOpen, setContextMenuOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [watchLater, setWatchLater] = useState<Post[]>([]);
    const [enableResume, setEnableResume] = useState(true);
    const [isOnVideoPage, setIsOnVideoPage] = useState(false);


    useEffect(() => {
        const wrapper = document.querySelector('#page-wrapper, floatplane-app');

        if (wrapper) {
            if (darkMode) {
                wrapper.classList.add('floaty-dark');
            } else {
                wrapper.classList.remove('floaty-dark');
            }
        }

    }, [darkMode]);

    useEffect(()=>{
        runtime.sendMessage({type: 'getDarkMode'}).then((value)=>{
            console.log('got dark mode', value);
            setDarkMode(value);
        });

        runtime.sendMessage({type: 'getWatchLater'}).then((value)=>{
            console.log('got watch later', value);
            setWatchLater(value);
        });
    }, []);

    const providerValue = useMemo(() => {
        const returnValue: State = {
            contextMenuOpen,
            setContextMenuOpen,

            enableResume,
            setEnableResume,

            darkMode,
            setDarkMode: (value)=>{
                console.log('set dark mode', value);
                
                setDarkMode(value);
                runtime.sendMessage({type: 'setDarkMode', value});
            },

            watchLater,
            addToWatchLater: (post) => {
                runtime.sendMessage({type: 'addToWatchLater', value: post}).then(() =>{
                    runtime.sendMessage({type: 'getWatchLater'}).then((value)=>{
                        console.log('got watch later', value);
                        setWatchLater(value);
                    });
                });
            },

            isOnVideoPage,
            setIsOnVideoPage,
        };

        return returnValue;
    }, [contextMenuOpen, darkMode, watchLater, enableResume, isOnVideoPage]);

    return (
        <AppStateContext.Provider value={providerValue}>
            {children}
        </AppStateContext.Provider>
    );
}
