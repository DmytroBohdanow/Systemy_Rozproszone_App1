import React from "react";
import Form from "react-bootstrap/Form";

const PESELInput = (props) => {
  const handleInputChange = (e) => {
    const inputValue = e.target.value;

    // Remove non-numeric and non-decimal characters
    const cleanedValue = inputValue.replace(/[^0-9.]/g, "");

    props.setTransferValue(cleanedValue);
  };

  return (
    <>
      {/* <Form.Group className="mb-3" controlId="newUserPesel">
        <Form.Label>PESEL</Form.Label>
        <PESELInput />
        <Form.Control
          type="text"
          placeholder="PESEL"
          value={props.transferValue}
          onChange={handleInputChange}
          required
          minLength={11}
          maxLength={11}
        />
      </Form.Group> */}
    </>
  );
};

export default PESELInput;
