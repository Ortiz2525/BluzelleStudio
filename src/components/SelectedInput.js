import React from "react";

export class SelectedInput extends Component {
    componentDidMount() {
        this.input && this.input.select();
    }

    render() {
        return (
            <BS.Input
                type='text'
                {...this.props}
                innerRef={(c) => (this.input = c)}
                style={{ width: "100%" }}
            />
        );
    }
}
