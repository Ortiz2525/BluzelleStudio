import {Editor} from "./Editor";
import {KeyList} from "./KeyList";
import {Log} from "./Log";
import {Metadata} from './Metadata';
import {Permissioning} from './Permissioning';
import {Header} from "./Header/Header";
import 'bootstrap/dist/css/bootstrap.css';
import {CommandControls} from "./CommandControls";


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

                            <CommandControls/>

                            <hr style={{border: 'none'}}/>

                            <Permissioning/>

                            <hr style={{border: 'none'}}/>

                            <BS.Card>
                            <BS.CardBody>
                              <BS.CardTitle>Database Fields</BS.CardTitle>
                               <hr style={{border: 'none'}}/>
                                <KeyList/>
                            </BS.CardBody>
                            </BS.Card>

                            <hr style={{border: 'none'}}/>

                            <Metadata/>

                            <hr style={{border: 'none'}}/>
                            
                            <BS.Card>
                            <BS.CardBody>
                              <BS.CardTitle>Log</BS.CardTitle>
                               <hr style={{border: 'none'}}/>
                                <Log/>
                            </BS.CardBody>
                            </BS.Card>
                            

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