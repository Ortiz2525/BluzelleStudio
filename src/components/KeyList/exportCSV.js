import {getClient} from '../../services/BluzelleService'

import {isLoading, keys} from './KeyList';

import download from 'downloadjs';


export const exportCSV = async () => {

    if(isLoading.get()) {
        alert('Cannot export while loading keys list.'); 
        return;
    }


    isLoading.set(true);
    
    try {

        const values = await Promise.all(keys.map(key => getClient().read(key)));

        const fields = keys.map((key, i) => [key, values[i]]);

        console.log(fields);

        downloadCSV(fields);


    } catch(e) {

        alert('Couldn\'t complete export due to network error');
        console.error(e);

    }

    isLoading.set(false);
    


};


const downloadCSV = fields => {


    const content = fields.map(field => field.map(sanitize).join(',')).join('\n');


    download(content, 'download', 'text/csv');

};


const sanitize = str => '"' + str.replace(/"/g, '""') + '"';
