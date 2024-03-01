import React, { useState, useEffect, useRef } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';

export const CustomHeader = (props) => {
    const [showPrintOptions, setShowPrintOptions] = useState(false);
    const dateInputRef = useRef(null);

    useEffect(() => {
       
        if (showPrintOptions) {
            dateInputRef.current.focus();
        }
    }, [showPrintOptions]); 

    const onPrintClicked = () => {
        setShowPrintOptions(!showPrintOptions);
        console.log('Print icon clicked');
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            {props.displayName}
            <button onClick={onPrintClicked} style={{ border: 'none', background: 'none', marginLeft:'20px' }}>
                <i className="fa fa-calendar"></i>
            </button>
            {showPrintOptions && (
                <input
                    ref={dateInputRef}
                    type="date"
                    onBlur={() => setShowPrintOptions(false)}
                />
            )}
        </div>
    );
};
