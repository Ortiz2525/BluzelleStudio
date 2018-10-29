import {selectedKey, refreshKeys, tempKey} from '../components/KeyList';
import {getClient} from './BluzelleService'
import {observe} from 'mobx';

export const activeValue = observable(undefined);


observe(selectedKey, ({newValue, oldValue}) => {

	activeValue.set(undefined);


	if(newValue !== undefined) {

		// We can say that if the value is an object, 
		// wrap in an OMR. See: JSONEditor.js.
        
		getClient().read(newValue).then(value =>
			activeValue.set(value))
        .catch(() => alert('Failed to read value due to bluzelle network error.'));

	}

});


export const save = () => 
    getClient().update(selectedKey.get(), activeValue.get())
    .catch(() => alert('Failed to save due to bluzelle network error.'));


export const remove = () => new Promise(resolve => {

    const sk = selectedKey.get(); 
    selectedKey.set();

    tempKey.set(sk);

    return getClient().remove(sk).then(() => {
        reload().then(resolve);
    })
    .catch(() => alert('Failed to remove due to bluzelle network error.'));

});


export const rename = (oldKey, newKey) => new Promise(resolve => {

    getClient().read(oldKey).then(v => {

        getClient().remove(oldKey).then(() => {

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