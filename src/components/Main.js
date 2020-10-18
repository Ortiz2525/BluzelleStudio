import React from "react";
import Editor from "./Editor";
import KeyList from "./KeyList";
import Metadata from "./Metadata";
import Permissioning from "./Permissioning";
import Header from "./Header/Header";

import CollapsibleCard from "./CollapsibleCard";
import useData from "./DataContext/useData";

export default Main = () => {
    const { config } = useData();

    return (
        <ReflexContainer style={{ height: "100%" }}>
            <div>
                <Header />

                <BS.Table style={{ marginBottom: 0, textAlign: "center" }}>
                    <tbody style={{ display: "inline-table" }}>
                        <tr style={{ display: "inline-table" }}>
                            <th scope='row' style={{ border: 0 }}>
                                uuid
                            </th>
                            <td style={{ border: 0 }}>
                                <code>{config.uuid}</code>
                            </td>
                        </tr>
                    </tbody>
                </BS.Table>
                <hr style={{ marginTop: 0 }} />
            </div>
            <ReflexElement flex={1}>
                <ReflexContainer orientation='vertical'>
                    <ReflexElement flex={0.5} style={{ padding: 10 }}>
                        {/* Disabling these for now. Too many variables to have a reliable undo/redo.

                            <CommandControls/>

                            <hr style={{border: 'none'}}/>*/}

                        <CollapsibleCard title='Database Fields'>
                            <KeyList />
                        </CollapsibleCard>

                        <div style={{ height: 20 }}></div>

                        <CollapsibleCard title='Permissioning'>
                            <Permissioning />
                        </CollapsibleCard>

                        <div style={{ height: 20 }}></div>

                        <CollapsibleCard collapsed={true} title='Metadata'>
                            <Metadata />
                        </CollapsibleCard>

                        {/*<div style={{height: 20}}></div>
                            
                            <CollapsibleCard collapsed={true} title="Log">
                                <Log/>
                            </CollapsibleCard>*/}

                        <div style={{ height: 20 }}></div>
                    </ReflexElement>
                    <ReflexSplitter />
                    <ReflexElement flex={0.5}>
                        <Editor />
                    </ReflexElement>
                </ReflexContainer>
            </ReflexElement>
        </ReflexContainer>
    );
};
