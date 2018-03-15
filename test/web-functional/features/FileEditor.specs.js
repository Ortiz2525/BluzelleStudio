import {newField, save} from "../pageActions";
import {setData, start} from "../../../../emulator/Emulator";
import {reset, checkUndo} from "../util";

describe('File Editor', () => {


    before(() => start());

    beforeEach(() => {

        reset();

        browser.url('http://localhost:8200/?test');

        browser.waitForExist('button=Go');
        browser.element('button=Go').click();

    });


    it('should be able to upload a file', () => {

        browser.waitForExist('.glyphicon-plus');

        newField('file', 'File');

        browser.waitForExist('div*=File size: 0 bytes');


        const path = __dirname + '/testfile.txt';

        browser.chooseFile('input[type=file]', path);

        browser.element('input[type=submit]').click();

        
        browser.waitForExist('div*=File size: 0 bytes', 500, true);


        checkUndo({
            verifyUndo: () => {
                browser.waitForExist('div*=success', 500, true);
            },
            verifyDo: () => {
                browser.waitForExist('div*=success');
            }
        });

    });

    //
    // it.only('should be able to upload a file and hit the save button twice', () => {
    //
    //     browser.waitForExist('.glyphicon-plus');
    //
    //     newField('file', 'File');
    //
    //     const path = __dirname + '/testfile.txt';
    //
    //     browser.chooseFile('input[type=file]', path);
    //
    //     browser.element('input[type=submit]').click();
    //
    //     save();
    //     save();
    //
    //     browser.waitForExist('div*=File size:');
    //
    // });



    it('should be able to download a file', () => {

        browser.waitForExist('.glyphicon-plus');

        newField('file', 'File');

        const path = __dirname + '/testfile.txt';

        browser.chooseFile('input[type=file]', path);

        browser.element('input[type=submit]').click();

        browser.element('.glyphicon-download').click();

    });

    it('should be able to download an empty file', () => {

        browser.waitForExist('.glyphicon-plus');

        newField('emptyfile', 'File');

        browser.element('.glyphicon-download').click();

    });

});
