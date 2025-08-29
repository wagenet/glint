import type * as TS from 'typescript';
declare type TypeScript = typeof TS;
interface BuildOptions extends TS.BuildOptions {
    clean?: boolean | undefined;
}
export declare function performBuild(ts: TypeScript, projects: string[], buildOptions: BuildOptions): void;
export {};
