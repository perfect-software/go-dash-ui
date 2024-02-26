import React from 'react';
import Downshift from 'downshift';
import styles from "../styles/inputDetails.module.css";

export const InputComponent = ({ name, label, divClass,sampleClass,textClass, maxLength, validation, value, onChange, placeholder, required }) => {
  return (
    <div className={styles[divClass]}>
      <label className={styles[sampleClass]} htmlFor={name}>
        {label}
      </label>
      <input
        type="text"
        className={styles[textClass]}
        placeholder={placeholder}
        name={name}
        maxLength={maxLength}
        style={validation === "invalid" ? { border: "2px solid red" } : {}}
        value={value}
        onChange={onChange}
        required={required}
      />
    </div>
  );
};
export const DownshiftInputComponent = ({
    name,
    placeholder,
    selectedItem,
    handleItemChange,
    suggestions,
    handleInputChange,
    showSuggestions,
    validationState,
    showInputLoading
  }) => {
    return (
      <Downshift
        onChange={handleItemChange}
        selectedItem={selectedItem}
      >
        {({ getInputProps, getItemProps, getMenuProps, highlightedIndex }) => (
          <div className={styles.inputWithIcon}>
            <input
              {...getInputProps({
                onChange: (e) => handleInputChange(e),
                name: name,
              })}
              type="text"
              className={styles.basicInput}
              maxLength="20"
              placeholder={placeholder}
              style={validationState === "invalid" ? { border: "2px solid red" } : {}}
              value={selectedItem || ''}
            />
            {showInputLoading && <div className={styles.dropLoader}></div>}
            <div {...getMenuProps()} className={styles.suggestions}>
              {showSuggestions &&
                suggestions.map((suggestion, index) => (
                  <div
                    {...getItemProps({ key: index, index, item: suggestion })}
                    className={
                      highlightedIndex === index
                        ? styles.highlighted
                        : styles.suggestionItem
                    }
                  >
                    {suggestion}
                  </div>
                ))}
            </div>
          </div>
        )}
      </Downshift>
    );
  };
  export const basicInputComponent = ({ name, label, divClass,sampleClass,textClass, maxLength, validation, value, onChange, placeholder, required }) => {
    return (
      <div className={styles[divClass]}>
        <label className={styles[sampleClass]} htmlFor={name}>
          {label}
        </label>
        <input
          type="text"
          className={styles[textClass]}
          placeholder={placeholder}
          name={name}
          maxLength={maxLength}
          style={validation === "invalid" ? { border: "2px solid red" } : {}}
          value={value}
          onChange={onChange}
          required={required}
        />
      </div>
    );
  };
  