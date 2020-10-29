import React, { useEffect, useState } from "react"

const SelectedInput = (props) => {
    const [inputRef, setInputRef] = useState()

    useEffect(() => {
        if (inputRef) {
            inputRef.focus()
        }
    }, [inputRef])

    return (
        <BS.InputGroup style={{ width: "100%" }}>
            <BS.Input
                type='text'
                {...props}
                innerRef={(ref) => setInputRef(ref)}
                onBlur={() => props.onBlur()}
            />

            <BS.InputGroupAddon addonType='append'>
                <BS.Button color='primary' type='button' onClick={props.onBlur}>
                    <i className='fa fa-check'></i>
                </BS.Button>
            </BS.InputGroupAddon>
        </BS.InputGroup>
    )
}

export default SelectedInput
