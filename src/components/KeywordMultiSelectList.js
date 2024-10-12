import React, { useState, forwardRef } from 'react';
import './multiselect.css'

const KeywordMultiSelectList = forwardRef(({ options, onSelectionChange }, selectRef) => {
  const [selectedItems, setSelectedItems] = useState([]);

  const handleSelectChange = (event) => {
    const value = Array.from(event.target.selectedOptions).map(option => option.index);
    setSelectedItems(value);
    onSelectionChange(value); // Pass selected items to parent
  };

  return (
    <div>
      <select
        ref={selectRef} // Attach the ref to the select element
        multiple
        value={selectedItems}
        onChange={handleSelectChange}
        style={{
          width: '356px',
          height: '223px',  // This will make it scrollable when content overflows
          overflowY: 'scroll'
        }}
      >
        {options.map((option, index) => (
          <option key={index} value={index}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
});

export default KeywordMultiSelectList;
