import React from "react";

import EditableField from "../../EditableField";
import { create } from "../../../services/CRUDService";

const NewKeyField = ({ onChange }) => {
    const [keyField, setKeyField] = useState("");

    const onChangeKey = (key) => {
        setKeyField(key);

        if (key !== "") {
            exit();

            create(key, "");
        }
    };

    const exit = () => {
        onChange();
    };

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
    );
};

export default NewKeyField;
