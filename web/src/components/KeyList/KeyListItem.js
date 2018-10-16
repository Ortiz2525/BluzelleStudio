import {ValIcon} from "../ObjIcon";
import {EditableField} from "../EditableField";
import {selectedKey, tempKey} from "./KeyList";
import {activeValue, rename} from '../../services/CRUDService';

import {execute} from '../../services/CommandQueueService';


@observer
export class KeyListItem extends Component {

    select(target) {

        const old = selectedKey.get();

        execute({

            doIt: () => Promise.resolve(selectedKey.set(target)),
            undoIt: () => Promise.resolve(selectedKey.set(old)),
            message: <span>Selected <code key={1}>{target}</code>.</span>

        });
    }

    rename(newKey) {

        const { keyname: oldKey } = this.props;

        execute({
            doIt: () => rename(oldKey, newKey),
            undoIt: () => rename(newKey, oldKey),
            message: <span>Renamed <code key={1}>{oldKey}</code> to <code key={2}>{newKey}</code>.</span>
        });

    }


    render() {

        const {keyname} = this.props;


        return (

            <BS.ListGroupItem
                onClick={() => {

                    if(keyname === tempKey.get()) return;

                    selectedKey.get() === keyname ? 
                        this.select(undefined) : 
                        this.select(keyname)}

                }
                active={selectedKey.get() === keyname}
                disabled={keyname === tempKey.get()}>

                <Icon keyname={keyname}/>



          {/*      <EditableField
                    val={keyname}
                    onChange={this.rename.bind(this)}/>
*/}

                <span>{keyname}</span>

                {
                    
                }


                {

                    keyname === selectedKey.get() &&

                        <BS.Glyphicon
                            style={{float: 'right'}}
                            glyph='chevron-right'/>

                }

            </BS.ListGroupItem>

        );
    }
}


const Icon = observer(({keyname}) =>

    <span style={{display: 'inline-block', width: 25}}>
        {

            activeValue.get() !== undefined &&
            selectedKey.get() === keyname &&

                <ValIcon val={activeValue.get()}/>
                

        }

        {
            keyname === tempKey.get() &&
                <BS.Glyphicon style={{ 
                        color: 'orange'
                    }}
                    glyph='transfer'/>
        }
    </span>

);