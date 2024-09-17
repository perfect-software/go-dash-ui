// DateEditor.js
import React, { forwardRef, useState, useEffect, useRef, useImperativeHandle } from 'react';

const DateEditor = forwardRef((props, ref) => {
  const [value, setValue] = useState(props.value);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
    inputRef.current.select();
  }, []);

  useImperativeHandle(ref, () => ({
    getValue: () => {
      return value;
    },
    isPopup: () => false,
  }));

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <input
      ref={inputRef}
      type="date"
      value={value || ''}
      onChange={handleChange}
      className="ag-input"
      style={{ width: '100%' }}
    />
  );
});

export default DateEditor;
