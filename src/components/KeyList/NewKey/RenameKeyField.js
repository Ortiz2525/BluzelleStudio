import React, { useState } from "react"

import EditableField from "../../EditableField"
import useCRUDService from "../../../services/CRUDService"
import useData from "components/DataContext/useData"

const RenameKeyField = ({ keyname, onChange }) => {
    const { selectedKey } = useData()
    const [keyField, setKeyField] = useState(selectedKey)
    const { rename } = useCRUDService()

    const onChangeKey = (key) => {
        setKeyField(key)

        if (key !== "") {
            exit()

            rename(keyname, key)
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

export default RenameKeyField
