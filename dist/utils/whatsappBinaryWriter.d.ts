import { WANode } from "./whatsappBinaryReader";
export interface WAMessageNode {
    description: WANode["description"];
    attributes?: WANode["attributes"];
    content?: Uint8Array | WAMessageNode[];
}
export declare function whatsappWriteBinary(node: WAMessageNode): Promise<Uint8Array>;
