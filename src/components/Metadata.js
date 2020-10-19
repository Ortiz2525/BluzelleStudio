import React, { Fragment } from "react"
import { version } from "bluzelle"

import useData from "./DataContext/useData"

const Metadata = () => {
    const { mnemonic, config, metaStatus, metaSize } = useData()

    return (
        <Fragment>
            <BS.Table>
                <thead>
                    <tr>
                        <th>Field</th>
                        <th>Value</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th scope='row'>Mnemonic</th>
                        <td>
                            <code>{mnemonic}</code>
                        </td>
                    </tr>
                    <tr>
                        <th scope='row'>bluzelle-js version</th>
                        <td>
                            <code>{version}</code>
                        </td>
                    </tr>
                    <tr>
                        <th scope='row'>uuid</th>
                        <td>
                            <code>{config.uuid}</code>
                        </td>
                    </tr>

                    {metaSize &&
                        Object.entries(metaSize).map(([key, value]) => (
                            <tr key={key}>
                                <th scope='row'>{key}</th>
                                <td>
                                    <code style={{ whiteSpace: "pre-wrap" }}>
                                        {value.toString()}
                                    </code>
                                </td>
                            </tr>
                        ))}

                    {metaStatus &&
                        Object.entries(metaStatus).map(([key, value]) => (
                            <tr key={key}>
                                <th scope='row'>{key}</th>
                                <td>
                                    <code style={{ whiteSpace: "pre-wrap" }}>
                                        {
                                            // Add a special JSON styling to moduleStatusJson
                                            key === "moduleStatusJson"
                                                ? JSON.stringify(
                                                      JSON.parse(value),
                                                      null,
                                                      4
                                                  )
                                                : value.toString()
                                        }
                                    </code>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </BS.Table>
        </Fragment>
    )
}

export default Metadata
