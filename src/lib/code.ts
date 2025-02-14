import Hashids from "hashids";

const hashids = new Hashids("nextblog", 10); // Secret salt & min length

export function encodeId(id: string) {
  return hashids.encodeHex(id);
}

export function decodeId(hash: string) {
  return hashids.decodeHex(hash);
}
