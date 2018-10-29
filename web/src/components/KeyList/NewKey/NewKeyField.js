import {TypeModal} from "./TypeModal";
import {EditableField} from "../../EditableField";

export class NewKeyField extends Component {

    constructor(props) {
        super(props);

        this.state = {
            showModal: false,
            keyField: ''
        };
    }

    onChange(key) {

        this.setState({ keyField: key });
        isEmpty() ? this.exit() : this.showModal();

        function isEmpty() {
            return key === '';
        }
    }

    showModal() {
        this.setState({ showModal: true });
    }

    exit() {
        this.props.onChange();
    }

    render() {

        return (

            <React.Fragment>
                <BS.ListGroupItem>

                    <EditableField
                        val={this.state.keyField}
                        active={true}
                        onChange={this.onChange.bind(this)}/>

                </BS.ListGroupItem>

                {this.state.showModal &&

                    <TypeModal
                        onHide={this.exit.bind(this)}
                        keyField={this.state.keyField}/>}

            </React.Fragment>

        );

    }
}