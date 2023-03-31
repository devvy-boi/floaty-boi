import { useEffect, useState, useRef } from 'react';

import { runtime, tabs } from 'webextension-polyfill';

import './style.less';

import ToggleButton from '../shared/toggle-button';

let messageTimeout: NodeJS.Timeout;

export default function App(){
    const outputRef = useRef<HTMLTextAreaElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const [version, setVersion] = useState<string>('');
    const [exportedData, setExportedData] = useState({});
    const [disabled, setDisabled] = useState<boolean>(false);
    const [darkMode, setDarkMode] = useState<boolean>(false);

    const [message, setMessage] = useState<string>('');

    // init
    useEffect(() => {
        const {version} = runtime.getManifest();
        setVersion(version);

        runtime.sendMessage({
            type: 'exportStorage'
        }).then((data) => {
            setExportedData(data);
        });



    }, []);

    useEffect(() => {
        if (outputRef.current) {
            outputRef.current.value = JSON.stringify(exportedData);
        }

        setDisabled(!!exportedData.disabled);
        setDarkMode(!!exportedData.darkMode);
    }, [exportedData]);


    // import data
    const importData = async () => {
        try {
            const confirm = window.confirm('IMPORTANT\nAre you sure you want to import data? This will overwrite your current data and is irreversible.');

            if (!confirm) {
                return;
            }
            
            if (!inputRef.current) {
                throw new Error('Could not find input ref');
            }

            const importedData = inputRef.current.value;
            const data = JSON.parse(importedData);

            await runtime.sendMessage({
                type: 'importStorage',
                value: data
            });

            setExportedData(data);
            showMessage('Data imported successfully');
        } catch (error) {
            showMessage('Error importing data');
        }

    };

    const handleKillSwitchToggle = async (state: boolean) => {
        try {
            await runtime.sendMessage({
                type: 'setDisabled',
                value: state
            });

            const data = await runtime.sendMessage({
                type: 'exportStorage'
            });

            tabs.reload();
            
            setExportedData(data);

            setDisabled(state);
            showMessage(state ? 'Disabled injection' : 'Enabled injection');
        } catch (error) {
            showMessage('Error toggling injection');
        }

    };

    const handleDarkModeToggle = async (state: boolean) => {
        try {
            await runtime.sendMessage({
                type: 'setDarkMode',
                value: state
            });

            const data = await runtime.sendMessage({
                type: 'exportStorage'
            });

            tabs.reload();
            
            setExportedData(data);

            setDarkMode(state);
            showMessage(state ? 'Enabled Dark Mode' : 'Disabled Dark Mode');
        } catch (error) {
            showMessage('Error toggling dark mode');
        }
    };

    const showMessage = (message: string) => {
        clearTimeout(messageTimeout);

        setMessage(message);
        
        messageTimeout = setTimeout(() => {
            setMessage('');
        }, 3000);
    };

    const handleOutputClick = () => {
        if (!outputRef.current) {
            return;
        }

        outputRef.current.select();
        document.execCommand('copy');

        showMessage('Copied to clipboard');
    };


    return (
        <div className={`root ${exportedData.darkMode ? 'dark':''}`}>
            {
                message && (
                    <div className='message'>
                        <span className='text'>
                            {message}
                        </span>
                        <div className="progress"/>
                    </div>
                )
            }

            <div className='header'>
                <img className='icon' src={runtime.getURL(`/assets/icon-${darkMode ? 'darkmode' : 'lightmode'}.svg`)} alt="" />
                <h2 className='title'>Settings & Data</h2>
                <span className='version'>v{version}</span>
            </div>

            <ToggleButton onToggle={handleKillSwitchToggle} text='Kill switch' externalState={disabled} />
            <ToggleButton onToggle={handleDarkModeToggle} text='Dark mode' externalState={darkMode} />

            <label htmlFor="output">Your Data:</label>
            <textarea onClick={handleOutputClick} ref={outputRef} readOnly placeholder="data will appear here" id="output"/>

            <label htmlFor="input">Import Data:</label>
            <textarea ref={inputRef} placeholder="paste data here" id="input"></textarea>
            <button onClick={importData}>Import Data</button>

            
        </div>
    );
}