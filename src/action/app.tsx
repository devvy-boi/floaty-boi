import { useEffect, useState, useRef } from 'react';

import {runtime } from 'webextension-polyfill';

import './style.less';

import ToggleButton from '../shared/toggle-button';

let messageTimeout: NodeJS.Timeout;

export default function App(){
    const outputRef = useRef<HTMLTextAreaElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const [version, setVersion] = useState<string>('');
    const [exportedData, setExportedData] = useState({});
    const [disabled, setDisabled] = useState<boolean>(false);

    const [message, setMessage] = useState<string>('');

    // init
    useEffect(() => {
        const {version} = runtime.getManifest();
        setVersion(version);

        runtime.sendMessage({
            type: 'exportStorage'
        }).then((data) => {
            setExportedData(data);

            setDisabled(!!data.disabled);
        });



    }, []);

    useEffect(() => {
        if (outputRef.current) {
            outputRef.current.value = JSON.stringify(exportedData);
        }
    }, [exportedData]);


    // import data
    const importData = async () => {
        try {
            if (!inputRef.current) {
                throw new Error('Could not find input ref');
            }

            const importedData = inputRef.current.value;
            const data = JSON.parse(importedData);

            await runtime.sendMessage({
                type: 'importStorage',
                value: data
            });
            showMessage('Data imported successfully');
        } catch (error) {
            showMessage('Error importing data');
        }

    };

    const handleToggle = async (state: boolean) => {
        try {
            await runtime.sendMessage({
                type: 'setDisabled',
                value: state
            });

            const data = await runtime.sendMessage({
                type: 'exportStorage'
            });
            
            setExportedData(data);

            setDisabled(state);
            showMessage(state ? 'Disabled injection' : 'Enabled injection');
        } catch (error) {
            showMessage('Error toggling injection');
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
        <div>
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

            <h2>Floaty Boi Tools</h2>
            <p>Version: {version}</p>

            <ToggleButton onToggle={handleToggle} text='Disable Injection' externalState={disabled} />

            <label htmlFor="output">Your Data:</label>
            <textarea onClick={handleOutputClick} ref={outputRef} readOnly placeholder="data will appear here" id="output"/>

            <label htmlFor="input">Import Data:</label>
            <textarea ref={inputRef} placeholder="paste data here" id="input"></textarea>
            <button onClick={importData}>Import Data</button>

            
        </div>
    );
}