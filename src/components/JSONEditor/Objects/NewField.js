import { useState } from "react";
import { observableMapRecursive } from "../../../util/mobXUtils";
import { EditableField } from "../../EditableField";

const NewField = (props) => {
    const [currentInput, setCurrentInput] = useState("key");
    const [key, setKey] = useState("key");

    const { onChange, onError } = props;

    const keyField = (
        <EditableField
            active={currentInput === "key"}
            val={key}
            onChange={(key) => {
                setCurrentInput("val");
                setKey(key);
            }}
        />
    );

    const valField = (
        <EditableField
            active={currentInput === "val"}
            val={'"value"'}
            validateJSON={true}
            onChange={(val) => {
                try {
                    const obj = JSON.parse(val);
                    onChange(key, obj);
                } catch (e) {
                    onError();
                }
            }}
        />
    );

    return (
        <div>
            {keyField}:{valField}
        </div>
    );
};

export default NewField;
