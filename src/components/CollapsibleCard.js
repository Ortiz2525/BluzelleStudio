import React from "react";

export class CollapsibleCard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            collapsed: this.props.collapsed || false,
        };
    }

    toggle() {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    }

    render() {
        return (
            <BS.Card>
                <BS.CardBody>
                    <BS.CardTitle style={{ marginBottom: 0 }}>
                        <span
                            style={{ display: "inline-block", width: 30 }}
                            onClick={() => this.toggle()}>
                            {this.state.collapsed ? (
                                <i className='fas fa-caret-right'></i>
                            ) : (
                                <i className='fas fa-caret-down'></i>
                            )}
                        </span>
                        {this.props.title}
                    </BS.CardTitle>

                    <BS.Collapse isOpen={!this.state.collapsed}>
                        <div style={{ height: 20 }}></div>
                        {this.props.children}
                    </BS.Collapse>
                </BS.CardBody>
            </BS.Card>
        );
    }
}
