import {selectedKey, refreshKeys, tempKeys, keys} from '../components/KeyList';
import {getClient} from './BluzelleService'
import {observe} from 'mobx';


export const activeValue = observable(undefined);

export const loadingValue = observable(false);


observe(selectedKey, ({newValue, oldValue}) => {

	activeValue.set(undefined);


	if(newValue !== undefined) {

		// We can say that if the value is an object, 
		// wrap in an OMR. See: JSONEditor.js.

        loadingValue.set(true);

        getClient().quickread(newValue).then(value => {
            activeValue.set(value);
            loadingValue.set(false);
        }).catch(() => {
            alert('Failed to read value due to bluzelle network error.');
            loadingValue.set(false);
        });
        
		getClient().read(newValue).then(value => {
			activeValue.set(value);
            loadingValue.set(false);
        }).catch(() => {
            alert('Failed to read value due to bluzelle network error.');
            loadingValue.set(false);
        });

	}

});


export const save = () => 
    getClient().update(selectedKey.get(), activeValue.get())
    .catch(() => alert('Failed to save due to bluzelle network error.'));


export const remove = () => new Promise(resolve => {

    const sk = selectedKey.get(); 
    selectedKey.set();

    tempKeys.push(sk);

    return getClient().delete(sk).then(() => {
        reload().then(resolve);
    })
    .catch(() => {

        tempKeys.splice(tempKeys.indexOf(sk), 1);

        selectedKey.set(sk);
        
        alert('Failed to remove due to bluzelle network error.');

    });

});


export const create = (key, value) => {


    keys.push(key);
    tempKeys.push(key);

    getClient().create(key, value).then(() => {
        
        while(tempKeys.includes(key)) {
            tempKeys.splice(tempKeys.indexOf(key), 1);
        }

    }).catch(e => {

        while(tempKeys.includes(key)) {
            tempKeys.splice(tempKeys.indexOf(key), 1);
        }
        
        keys.splice(keys.indexOf(key), 1);
        
        alert('Failed to create key due to bluzelle network error.'); 

    });

};


export const rename = (oldKey, newKey) => new Promise(resolve => {

    getClient().read(oldKey).then(v => {

        getClient().delete(oldKey).then(() => {

            getClient().update(newKey, v).then(() => {

            	const s = selectedKey;

                if(selectedKey.get() === oldKey) {

                    selectedKey.set(newKey);

                }

                reload().then(resolve);

            }).catch(() => alert('Bluzelle network error.'));

        }).catch(() => alert('Bluzelle network error.'));

    }).catch(() => alert('Bluzelle network error.'));

});
    

export const reload = () => new Promise(resolve => {

    refreshKeys().then(keys => {

        const sk = selectedKey.get(); 
        selectedKey.set();

        if(keys.includes(sk)) {

            selectedKey.set(sk);

        }

        resolve();

    });

});