import React, { useState } from "react"

import EditableField from "../../EditableField"
import useCRUDService from "../../../services/CRUDService"
import useData from "components/DataContext/useData"

const NewKeyField = ({ onChange }) => {
    const [keyField, setKeyField] = useState("")
    const { create } = useCRUDService()
    const { keys } = useData()

    const onChangeKey = (key) => {
        setKeyField(key)

        if (key !== "") {
            exit()

            if (!keys.includes(key)) create(key, "")
        }
    }

    const exit = () => {
        onChange()
    }

    return (
        <React.Fragment>
            <BS.ListGroupItem>
                <EditableField
                    val={keyField}
                    active={true}
                    onChange={onChangeKey}
                />
            </BS.ListGroupItem>
        </React.Fragment>
    )
}

export default NewKeyField
