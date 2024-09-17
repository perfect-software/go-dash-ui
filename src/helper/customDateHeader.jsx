import React, { useState, useEffect, useRef } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';

export const CustomDateHeader = ({ displayName, onDateChange }) => {
    const [showPrintOptions, setShowPrintOptions] = useState(false);
    const dateInputRef = useRef(null);
  
    useEffect(() => {
      if (showPrintOptions) {
        dateInputRef.current.focus();
      }
    }, [showPrintOptions]);
  
    const handleDateChange = (event) => {
      onDateChange(event.target.value);
    };
  
    const onPrintClicked = () => {
      setShowPrintOptions(!showPrintOptions);
    };
  
    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {displayName}
        <button onClick={onPrintClicked} style={{ border: 'none', background: 'none', marginLeft: '20px' }}>
          <i className="fa fa-calendar"></i>
        </button>
        {showPrintOptions && (
          <input
          style={{marginLeft:'4px'}}
            ref={dateInputRef}
            type="date"
            onBlur={() => setShowPrintOptions(false)}
            onChange={handleDateChange} 
          />
        )}
      </div>
    );
  };
  

