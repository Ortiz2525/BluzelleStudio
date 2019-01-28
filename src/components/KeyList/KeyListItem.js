import {ValIcon} from "../ObjIcon";
import {EditableField} from "../EditableField";
import {selectedKey, tempKeys} from "./KeyList";
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

                    if(tempKeys.includes(keyname)) return;

                    selectedKey.get() === keyname ? 
                        this.select(undefined) : 
                        this.select(keyname)}

                }
                active={selectedKey.get() === keyname}>


                <span style={{marginLeft: 15}}>{keyname}</span>


                {/*Loading bar from https://loading.io/css/*/}

                <style>{".lds-ellipsis {\r\n  display: inline-block;\r\n  position: relative;\r\n  width: 64px;\r\n  height: 7px;\r\n}\r\n.lds-ellipsis div {\r\n  position: absolute;\r\n  top: 0px;\r\n  width: 5px;\r\n  height: 5px;\r\n  border-radius: 50%;\r\n  animation-timing-function: cubic-bezier(0, 1, 1, 0);\r\n}\r\n.lds-ellipsis div:nth-child(1) {\r\n  left: 6px;\r\n  animation: lds-ellipsis1 0.6s infinite;\r\n}\r\n.lds-ellipsis div:nth-child(2) {\r\n  left: 6px;\r\n  animation: lds-ellipsis2 0.6s infinite;\r\n}\r\n.lds-ellipsis div:nth-child(3) {\r\n  left: 26px;\r\n  animation: lds-ellipsis2 0.6s infinite;\r\n}\r\n.lds-ellipsis div:nth-child(4) {\r\n  left: 45px;\r\n  animation: lds-ellipsis3 0.6s infinite;\r\n}\r\n@keyframes lds-ellipsis1 {\r\n  0% {\r\n    transform: scale(0);\r\n  }\r\n  100% {\r\n    transform: scale(1);\r\n  }\r\n}\r\n@keyframes lds-ellipsis3 {\r\n  0% {\r\n    transform: scale(1);\r\n  }\r\n  100% {\r\n    transform: scale(0);\r\n  }\r\n}\r\n@keyframes lds-ellipsis2 {\r\n  0% {\r\n    transform: translate(0, 0);\r\n  }\r\n  100% {\r\n    transform: translate(19px, 0);\r\n  }\r\n}"}</style>

                <style>{".list-group-item.active .lds-ellipsis div { background-color: white; }"}</style>
                
                {
                    tempKeys.includes(keyname) &&
                        <div className="lds-ellipsis" style={{marginLeft: 15}}><div className='badge-primary'></div><div className='badge-primary'></div><div className='badge-primary'></div><div className='badge-primary'></div></div>
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