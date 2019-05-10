import { assign } from 'es6-object-assign';
Object.assign = assign;

import { TextDecoder, TextEncoder } from 'text-encoding';
Object.assign(Window, { TextEncoder: TextEncoder });
Object.assign(Window, { TextDecoder: TextDecoder });

var link = document.createElement("link");
link.href = 'https://onlinebank-2775b.firebaseapp.com/fonts/ssf-icon-font/style.css'
link.type = "text/css";
link.rel = "stylesheet";
link.media = "screen,print";

document.getElementsByTagName("head")[0].appendChild(link);
