import React, { useRef } from 'react';
import Downshift from 'downshift';
import styles from '../styles/inputDetails.module.css'

const GenericDownshiftDropdown = ({
  name,
  selectedItem,
  onChange,
  items,
  showInputLoading,
  handleButtonClick,
  showSuggestions,
  placeholder,
  validationState,
  handleChange,
}) => {
  const inputRef = useRef(null);

  return (
    <Downshift
      onChange={onChange}
      selectedItem={selectedItem}
      itemToString={(item) => (item ? item.name : "")}
    >
      {({ getInputProps, getItemProps, getMenuProps, highlightedIndex }) => (
        <div className={styles.inputWithIcon}>
          <input
            {...getInputProps({
              onChange: handleChange,
              name: name,
            })}
            type="text"
            ref={inputRef}
            className={styles.basicInput}
            style={
              validationState === "invalid"
                ? { border: "2px solid red" }
                : {}
            }
            placeholder={placeholder}
            value={selectedItem}
          />
          {showInputLoading ? (
            <div className={styles.dropLoader}></div>
          ) : (
            <button
              onClick={() => {
                handleButtonClick(name);
                inputRef.current?.focus();
              }}
              className={styles.dropBtn}
              aria-label="dropDorn"
            ></button>
          )}

          {showSuggestions && (
            <div {...getMenuProps()} className={styles.suggestions}>
              {items.map((item, index) => (
                <div
                  {...getItemProps({ key: index, index, item })}
                  className={
                    highlightedIndex === index
                      ? styles.highlighted
                      : styles.suggestionItem
                  }
                >
                  {item.name}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </Downshift>
  );
};

export default GenericDownshiftDropdown;
