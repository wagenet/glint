import { ProtocolRequestType, TextEdit } from 'vscode-languageserver';
export declare type Request<Name extends string, T> = {
    name: Name;
    type: T;
};
export declare const GetIRRequest: Request<"glint/getIR", ProtocolRequestType<GetIRParams, GetIRResult | null, void, void, void>>;
export declare const SortImportsRequest: Request<"glint/sortImports", ProtocolRequestType<SortImportsParams, SortImportsResult | null, void, void, void>>;
export interface GetIRParams {
    uri: string;
}
export interface GetIRResult {
    contents: string;
    uri: string;
}
export interface SortImportsParams {
    uri: string;
}
export declare type SortImportsResult = TextEdit[];
