import React, { useState } from "react"
import useData from "components/DataContext/useData"

const PlainTextEditor = () => {
    const { isWriter, activeValue, setActiveValue } = useData()

    const [value, setValue] = useState(activeValue)

    const onSubmit = (e) => {
        e && e.preventDefault()

        setActiveValue(value)

        // const {keyName, keyData} = this.props;

        // const oldVal = keyData.get('localChanges');
        // const newVal = this.state.val;

        // this.context.execute({
        //     doIt: () => keyData.set('localChanges', newVal),
        //     undoIt: () => keyData.set('localChanges', oldVal),
        //     message: <span>Updated <code key={1}>{keyName}</code>.</span>
        // });
    }

    const onChange = (e) => {
        setValue(e.target.value)
    }

    return (
        <div style={{ flex: "auto" }}>
            <BS.Form style={{ height: "100%" }}>
                <BS.Input
                    style={{
                        fontFamily: "monospace",
                        height: "100%",
                        resize: "none",
                        border: "none",
                        borderRadius: 0,
                        borderLeft: "2px solid #007bff",
                    }}
                    spellCheck='false'
                    type='textarea'
                    disabled={isWriter === "read-only"}
                    placeholder={
                        isWriter === "read-only"
                            ? "No value"
                            : "Enter value here"
                    }
                    value={value}
                    onChange={onChange}
                    onBlur={onSubmit}
                />
            </BS.Form>
        </div>
    )
}

export default PlainTextEditor
