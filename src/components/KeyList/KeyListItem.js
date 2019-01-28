import {ValIcon} from "../ObjIcon";
import {EditableField} from "../EditableField";
import {selectedKey, tempKeys} from "./KeyList";
import {activeValue, rename} from '../../services/CRUDService';

import {execute} from '../../services/CommandQueueService';

import {loadingBar} from '../loadingBar';


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

                    if(tempKeys.includes(keyname)) return;

                    selectedKey.get() === keyname ? 
                        this.select(undefined) : 
                        this.select(keyname)}

                }
                active={selectedKey.get() === keyname}>


                <span style={{marginLeft: 15}}>{keyname}</span>


                {
                    tempKeys.includes(keyname) && loadingBar
                }

                {

                    keyname === selectedKey.get() &&

                        <i style={{
                                float: 'right',
                                lineHeight: '24px'
                            }}
                            className="fas fa-chevron-right"></i>

                }

            </BS.ListGroupItem>

        );
    }
}