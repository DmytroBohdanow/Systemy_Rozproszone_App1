import React from "react";

const CurrencyInput = (props) => {
  

  const handleInputChange = (e) => {
    const inputValue = e.target.value;

    // Remove non-numeric and non-decimal characters
    const cleanedValue = inputValue.replace(/[^0-9.]/g, "");

    props.setTransferValue(cleanedValue);
  };

  return (
    <div>
      <label htmlFor="currencyInput">How much, mate?:</label>
      <input
        id="currencyInput"
        type="text"
        value={props.transferValue}
        onChange={handleInputChange}
        placeholder="Enter value in złoty"
      />
    </div>
  );
};

export default CurrencyInput;
