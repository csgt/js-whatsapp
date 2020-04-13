export interface WANode {
    description: string;
    attributes?: {
        [k: string]: string | null;
    };
    content?: WANode[] | Uint8Array;
}
export declare class WABinaryReader {
    data: Uint8Array;
    index: number;
    constructor(data: Uint8Array);
    checkEOS(length: number): void;
    readByte(): number;
    readIntN(n: number, littleEndian?: boolean): number;
    readInt16(littleEndian?: boolean): number;
    readInt20(): number;
    readInt32(littleEndian?: boolean): number;
    readInt64(littleEndian?: boolean): number;
    readPacked8(tag: number): string;
    unpackByte(tag: number, value: number): string;
    unpackNibble(value: number): string;
    unpackHex(value: number): string;
    isListTag(tag: number): boolean;
    readListSize(tag: number): number;
    readString(tag: number): Uint8Array;
    readStringFromChars(length: number): Uint8Array;
    readAttributes(n: number): {
        [k: string]: string;
    } | undefined;
    readList(tag: number): WANode[];
    readNode(): WANode;
    readBytes(n: number): Uint8Array;
    getToken(index: number): string;
    getDoubleToken(index1: number, index2: number): never;
}
export declare function whatsappReadMessageArray(msgs: WANode["content"]): Promise<Uint8Array | {
    [k: string]: any;
}[] | undefined>;
export declare function whatsappReadBinary(data: Uint8Array, withMessages?: boolean): Promise<WANode>;
