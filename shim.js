import "./crypto";
import { Buffer } from "buffer";
if (typeof dirname === "undefined") {
  global.dirname = "/";
}
if (typeof filename === "undefined") {
  global.filename = "";
}
// if (typeof BigInt === "undefined") {
//   global.BigInt = require("big-integer");
// }
// if (typeof process === "undefined") {
//   global.process = require("process");
// } else {
//   const bProcess = require("process");
//   for (const p in bProcess) {
//     if (!(p in process)) {
//       process[p] = bProcess[p];
//     }
//   }
// }

process.browser = false;

if (typeof Buffer === "undefined") {
  global.Buffer = require("buffer").Buffer;
}

if (!global.atob || !global.btoa) {
  const Buffer = require("buffer").Buffer;
  global.atob = (data) => {
    return Buffer.from(data, "base64").toString();
  };

  global.btoa = (data) => {
    return Buffer.from(data).toString("base64");
  };
}

// global.Promise.allSettled = require("promise.allsettled");

const isDev = typeof DEV === "boolean" && DEV;
env = process.env ?? {};
import { INJECTED_PROVIDER_URL } from "react-native-dotenv";
env.INJECTED_PROVIDER_URL = INJECTED_PROVIDER_URL;
process.env = env;

import EventEmitter from "eventemitter3";

const eventListener = new EventEmitter();

window.addEventListener = (type, fn, options) => {
  if (options && options.once) {
    eventListener.once(type, fn);
  } else {
    eventListener.addListener(type, fn);
  }
};

window.removeEventListener = (type, fn) => {
  eventListener.removeListener(type, fn);
};

window.dispatchEvent = (event) => {
  eventListener.emit(event.type);
};
