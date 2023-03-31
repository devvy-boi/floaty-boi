import { useEffect, useState } from 'react';

import styles from './toggle-button.module.less';

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
        <div className={styles.toggleWrapper}>
            <div className={styles.toggleText}>{text}</div>

            <div onClick={toggle} className={`${styles.toggleButton} ${state ? styles.on : styles.off}`}>
                <div className={styles.toggleCircle}/>
            </div>
        </div>

    );
}