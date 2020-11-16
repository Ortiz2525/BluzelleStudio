import React, { useEffect, useState } from "react"

import useCRUDService from "../../../services/CRUDService"
import useData from "components/DataContext/useData"

const NewKeyField = ({ onChange }) => {
    const [keyField, setKeyField] = useState("")
    const [value, setValue] = useState("")
    const [inputRef, setInputRef] = useState()
    const { create } = useCRUDService()
    const { keys } = useData()

    useEffect(() => {
        if (inputRef) inputRef.focus()
    }, [inputRef])

    const exit = () => {
        onChange()
        if (!keys.some((item) => item.key == keyField)) create(keyField, value)
    }

    return (
        <React.Fragment>
            <BS.ListGroupItem
                style={{
                    display: "flex",
                    flexDirection: "row",
                }}>
                <div style={{ flex: 1 }}>
                    <BS.Input
                        type='text'
                        placeholder='Enter key here...'
                        innerRef={(ref) => setInputRef(ref)}
                        value={keyField}
                        focus='true'
                        onChange={(e) => setKeyField(e.target.value)}
                    />
                    <BS.Input
                        type='text'
                        value={value}
                        placeholder='Enter value here...'
                        style={{
                            marginTop: 5,
                        }}
                        onChange={(e) => setValue(e.target.value)}
                    />
                </div>
                <BS.Button
                    color='primary'
                    type='button'
                    onClick={exit}
                    style={{ marginLeft: 5 }}>
                    <i className='fa fa-check'></i>
                </BS.Button>
            </BS.ListGroupItem>
        </React.Fragment>
    )
}

export default NewKeyField
