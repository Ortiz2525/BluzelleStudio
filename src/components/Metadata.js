import { config } from "../services/BluzelleService";

import { version } from "bluzelle";

import { Fragment } from "react";
import useData from "./DataContext/useData";

export const status = observable();

export const size = observable();

const Metadata = () => {
    const { mnemonic } = useData();
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
                        <th scope="row">Mnemonic</th>
                        <td>
                            <code>{mnemonic}</code>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">bluzelle-js version</th>
                        <td>
                            <code>{version}</code>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">uuid</th>
                        <td>
                            <code>{config.get().uuid}</code>
                        </td>
                    </tr>

                    {Object.entries(size.get()).map(([key, value]) => (
                        <tr key={key}>
                            <th scope="row">{key}</th>
                            <td>
                                <code style={{ whiteSpace: "pre-wrap" }}>
                                    {value.toString()}
                                </code>
                            </td>
                        </tr>
                    ))}

                    {Object.entries(status.get()).map(([key, value]) => (
                        <tr key={key}>
                            <th scope="row">{key}</th>
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
    );
};

export default Metadata;
