import React from "react";

export default function DecodingButton({ onClick, buttonText }) {
    return (
        <button onClick={onClick}>{buttonText}</button>
    )
}
