// Testing environment polyfill
if (typeof TextEncoder === 'undefined') {
    var {TextEncoder, TextDecoder} = require('text-encoding');
}

const ENCODING = 'utf-8';

const te = new TextEncoder(ENCODING);
const td = new TextDecoder(ENCODING);

export const strToByteArray = str => te.encode(str);
export const byteArrayToStr = arr => td.decode(arr);
