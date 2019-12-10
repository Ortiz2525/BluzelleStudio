import {EditableField} from "../../EditableField";
import {rename} from '../../../services/CRUDService';


export class RenameKeyField extends Component {

    constructor(props) {
        super(props);

        this.state = {
            keyField: ''
        };
    }

    onChange(key) {

        this.setState({ keyField: key });

        if(key !== '') {

            this.exit();

            rename(this.props.keyname, key);

        }

 
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

            </React.Fragment>

        );

    }
}