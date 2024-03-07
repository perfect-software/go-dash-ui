import React, { useState, useEffect, useRef } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';

export const CustomHeader = ({ displayName, onRateChange }) => {
  const [showPrintOptions, setShowPrintOptions] = useState(false);
  const [tempValue, setTempValue] = useState(''); 
  const inputRef = useRef(null);

  useEffect(() => {
    if (showPrintOptions) {
      inputRef.current.focus();
    }
  }, [showPrintOptions]);


  const handleChange = (event) => {
    setTempValue(event.target.value);
  };


  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      onRateChange(tempValue); 
      setShowPrintOptions(false); 
    }
  };

  const onPrintClicked = () => {
    setShowPrintOptions(!showPrintOptions);
  };
  
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {displayName}
      <button onClick={onPrintClicked} style={{ border: 'none', background: 'none', marginLeft: '20px' }}>
      <i className="fa-sharp fa-solid fa-tags"></i>
      </button>
      {showPrintOptions && (
        <input
          style={{
            marginLeft: '4px',
            width: '100px', 
            padding: '5px 10px', 
            textAlign: 'left',
            border: '1px solid #ccc',
            borderRadius: '4px',
          }}
          ref={inputRef}
          type="text"
          value={tempValue}
          onBlur={() => setShowPrintOptions(false)}
          onChange={handleChange}
          onKeyDown={handleKeyDown} 
        />
      )}
    </div>
  );
};
