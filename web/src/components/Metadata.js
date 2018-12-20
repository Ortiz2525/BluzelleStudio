import {autorun} from 'mobx';
import {getClient} from '../services/BluzelleService';

import {version} from 'bluzelle';


export const status = observable();


@observer
export class Metadata extends Component {

    render() {

        return (
            <BS.Card>
            <BS.CardBody>
              <BS.CardTitle>Metadata</BS.CardTitle>
               <hr style={{border: 'none'}}/>

               <BS.Table>
                <thead>
                  <tr>
                    <th>Field</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">public key</th>
                    <td><code>{getClient().publicKey()}</code></td>
                  </tr>
                  <tr>
                    <th scope="row">bluzelle-js version</th>
                    <td><code>{version}</code></td>
                  </tr>
                  {
                    Object.entries(status.get()).map(([key, value]) => 
                        <tr key={key}>
                            <th scope="row">{key}</th>
                            <td><code>{value.toString()}</code></td>
                        </tr>)
                  }
                </tbody>
              </BS.Table>

            </BS.CardBody>
            </BS.Card>
        );  

    }

};