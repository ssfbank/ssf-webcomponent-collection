import {assign} from 'es6-object-assign';
Object.assign = assign;

import {TextDecoder, TextEncoder} from 'text-encoding';
Object.assign(Window, { TextEncoder: TextEncoder });
Object.assign(Window, { TextDecoder: TextDecoder });
