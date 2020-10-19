import React, { useEffect, useState } from "react";
import SelectedInput from "./SelectedInput";

const EditableField = (props) => {
    const [formValue, setFormValue] = useState(props.val);
    const [formActive, setFormActive] = useState(false);
    const [hovering, setHovering] = useState(false);

    useEffect(() => {
        props.active && setFormActive(true);
    }, [props.active]);

    const handleChange = (event) => {
        setFormValue(event.target.value);
    };

    const handleSubmit = (event) => {
        const { onChange } = props;
        event.preventDefault();

        setFormActive(false);

        onChange(formValue);
    };

    const validationState = () => {
        try {
            JSON.parse(formValue);
            return "success";
        } catch (e) {
            return "error";
        }
    };

    const { val, renderVal, validateJSON } = props;
    const renderValWithDefault = renderVal || ((i) => i);

    return (
        <span
            onClick={(e) => {
                e.stopPropagation();
                setFormActive(true);
                setHovering(false);
            }}>
            {formActive ? (
                <BS.Form
                    inline
                    style={{ display: "inline" }}
                    onSubmit={handleSubmit}>
                    <SelectedInput
                        type='text'
                        value={formValue}
                        onChange={handleChange}
                        onBlur={handleSubmit}
                    />
                </BS.Form>
            ) : (
                <span
                    style={{
                        textDecoration: hovering ? "underline" : "none",
                        cursor: "pointer",
                    }}
                    onMouseOver={() => setHovering(true)}
                    onMouseLeave={() => setHovering(false)}>
                    {renderValWithDefault(val)}
                </span>
            )}
        </span>
    );
};

export default EditableField;
