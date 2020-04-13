/// <reference types="node" />
export declare function dataUrlToBuffer(dataString: string): {
    type: string;
    data: Buffer;
};
export declare function randHex(n: number): string;
export declare function AESPad(src: Uint8Array): Uint8Array;
export declare function AESUnpad(src: Uint8Array): Uint8Array;
export declare function AESEncrypt(key: Uint8Array, plaintext: Uint8Array, _iv?: Uint8Array | null, includeIv?: boolean): Uint8Array;
export declare function AESDecrypt(key: Uint8Array, cipherbits: Uint8Array): Uint8Array;
export declare function numToBits(n: number): Uint8Array;
export declare function repeatedNumToBits(n: number, repeats: number): Uint8Array;
export declare function HmacSha256(keyBits: Uint8Array, signBits: Uint8Array): Uint8Array;
export declare function Sha256(signBits: Uint8Array): Uint8Array;
export declare function HKDF(_key: Uint8Array, length: number, appInfo?: string): Uint8Array;
export declare function toArrayBuffer(buf: Buffer): ArrayBuffer;
