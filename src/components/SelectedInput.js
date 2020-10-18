import React, { useEffect } from "react";

const SelectedInput = () => {
    const inputRef = React.createRef();

    useEffect(() => {
        inputRef.select();
    });

    return (
        <BS.Input
            type='text'
            {...this.props}
            innerRef={inputRef}
            style={{ width: "100%" }}
        />
    );
};

export default SelectedInput;
