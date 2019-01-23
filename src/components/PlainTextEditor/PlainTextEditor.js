import {activeValue} from '../../services/CRUDService';
import {is_writer} from '../Permissioning';


@observer
export class PlainTextEditor extends Component {

    constructor() {
        super();

        this.state = {
            value: activeValue.get()
        };

    }

    onSubmit(e) {
        e && e.preventDefault();

        activeValue.set(this.state.value);


        // const {keyName, keyData} = this.props;

        // const oldVal = keyData.get('localChanges');
        // const newVal = this.state.val;


        // this.context.execute({
        //     doIt: () => keyData.set('localChanges', newVal),
        //     undoIt: () => keyData.set('localChanges', oldVal),
        //     message: <span>Updated <code key={1}>{keyName}</code>.</span>
        // });
    }

    onChange(e) {

        this.setState({
            value: e.target.value
        });

    }


    render() {

        return (

            <div style={{height: '100%'}}>
                <BS.Form style={{height: '100%'}}>
                    <BS.Input
                        style={{
                            fontFamily: 'monospace',
                            height: '100%', 
                            resize: 'none',
                            border: 'none',
                            borderRadius: 0,
                            borderLeft: '2px solid #007bff'
                        }}
                        spellCheck="false"
                        type="textarea"
                        disabled={is_writer.get() === 'read-only'}

                        placeholder={
                            is_writer.get() === 'read-only' ?
                                "No value" :
                                "Enter value here"}

                        value={this.state.value}

                        onChange={this.onChange.bind(this)}

                        onBlur={this.onSubmit.bind(this)}

                        />

                </BS.Form>
            </div>

        );

    }
}