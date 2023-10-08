import "./crypto";
import { Buffer } from "buffer";
if (typeof Buffer === "undefined") {
  console.log(Buffer);
  global.Buffer = Buffer;
}
