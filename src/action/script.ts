import {runtime} from 'webextension-polyfill';

// document ready
document.addEventListener('DOMContentLoaded', () => {
    const exportButton = document.querySelector('#exportButton') as HTMLButtonElement;
    const importButton = document.querySelector('#importButton') as HTMLButtonElement;
    const outputElement = document.querySelector('#output') as HTMLTextAreaElement;
    const inputElement = document.querySelector('#input') as HTMLTextAreaElement;
    const messageElement = document.querySelector('#message') as HTMLDivElement;

    const reset = () => {
        messageElement.classList.remove('success');
        messageElement.innerText = '';
    };

    const writeMessage = (message: string, type: 'error' | 'success') => {
        messageElement.classList.remove('success');
        messageElement.classList.remove('error');

        messageElement.classList.add(type);
        messageElement.innerText = message;
    };
    
    
    exportButton.addEventListener('click', async () => {
        reset();

        const data = await runtime.sendMessage({
            type: 'exportStorage'
        });

        try {
            outputElement.value = JSON.stringify(data);
        } catch (error) {
            writeMessage('Error while exporting data. Please try again.', 'error');
            console.error(error);
            return;
        }
    
        outputElement.select();
    
        document.execCommand('copy');

        writeMessage('Data copied to clipboard. Paste the data into the import dialog or save it for later.', 'success');
    
    });
    
    
    importButton.addEventListener('click', async () => {
        reset();

        // open dialog to paste the data
        const data = inputElement.value;

        if (!data || data.length === 0) {
            writeMessage('No data to import. Please paste the data you copied from the export dialog.', 'error');
            return;
        }

        let parsed;
        
        try {
            parsed = JSON.parse(data);
        } catch (error) {
            writeMessage('Error while parsing the data. Please make sure you copied the data from the export dialog.', 'error');
            return;
        }
    
        // confirm the user wants to import the data
        const confirm = window.prompt('Are you sure you want to import the data? This will overwrite your current data. Type "yes" to confirm.') === 'yes';
    
        if (confirm) {
            
            // send the data to the background script
            await runtime.sendMessage({
                type: 'importStorage',
                value: JSON.parse(data)
            });

            writeMessage('Data imported successfully.', 'success');
    
    
        } else {
            writeMessage('Data import canceled. You must type "yes" in the dialog to confirm data deletion', 'error');
        }
    });
});

