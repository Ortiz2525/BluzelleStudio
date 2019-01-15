import {Editor} from "./Editor";
import {KeyList} from "./KeyList";
import {Log} from "./Log";
import {Metadata} from './Metadata';
import {Permissioning} from './Permissioning';
import {Header} from "./Header/Header";

// import 'bootstrap/dist/css/bootstrap.css';
// import './solar.css';

import {CommandControls} from "./CommandControls";
import {CollapsibleCard} from './CollapsibleCard';


@observer
export class Main extends Component {
    render() {
        return (
            <ReflexContainer style={{height: '100%'}}>
                <div>
                    <Header/>
                    <hr/>
                </div>
                <ReflexElement flex={1}>
                    <ReflexContainer orientation='vertical'>
                        <ReflexElement flex={0.5} style={{padding: 10}}>

                            {/* Disabling these for now. Too many variables to have a reliable undo/redo.

                            <CommandControls/>

                            <hr style={{border: 'none'}}/>*/}

                            <CollapsibleCard title="Database Fields">
                                <KeyList/>
                            </CollapsibleCard>

                            <div style={{height: 20}}></div>

                            <CollapsibleCard title="Permissioning">
                                <Permissioning/>
                            </CollapsibleCard>

                            <div style={{height: 20}}></div>

                            <CollapsibleCard collapsed={true} title="Metadata">
                                <Metadata/>
                            </CollapsibleCard>

                            <div style={{height: 20}}></div>
                            
                            <CollapsibleCard collapsed={true} title="Log">
                                <Log/>
                            </CollapsibleCard>
                            
                            <div style={{height: 20}}></div>

                        </ReflexElement>
                        <ReflexSplitter/>
                        <ReflexElement flex={0.5}>

                            <Editor/>

                        </ReflexElement>
                    </ReflexContainer>
                </ReflexElement>
            </ReflexContainer>
        );
    }
}