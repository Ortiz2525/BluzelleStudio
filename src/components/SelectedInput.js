import React, { useEffect, useState } from "react"

const SelectedInput = (props) => {
    const [inputRef, setInputRef] = useState()

    useEffect(() => {
        if (inputRef) {
            inputRef.focus()
        }
    }, [inputRef])

    return (
        <BS.Input
            type='text'
            {...props}
            innerRef={(ref) => setInputRef(ref)}
            style={{ width: "100%" }}
            onBlur={() => props.onBlur()}
        />
    )
}

export default SelectedInput
