import { useEffect, useState } from 'react';

interface ToggleButtonProps {
    externalState: boolean;
    text: string;
    onToggle: (state: boolean) => void;
}

export default function ToggleButton({externalState, text, onToggle}: ToggleButtonProps){
    const [state, setState] = useState<boolean>(externalState);

    useEffect(() => {
        setState(externalState);
    }, [externalState]);

    const toggle = () => {
        const newState = !state;
        setState(newState);

        onToggle(newState);
    };

    return (
        <div className='toggleWrapper'>
            <div className='toggleText'>{text}</div>

            <div onClick={toggle} className={`toggleButton ${state ? 'on':'off'}`}>
                <div className='toggleCircle'/>
            </div>
        </div>

    );
}