/*
 * File: index.d.ts
 * Project: aaptjs2
 * Description:
 * Created By: Tao.Hu 2019-05-28
 * -----
 * Last Modified: 2019-05-28 01:37:45 pm
 * Modified By: Tao.Hu
 * -----
 */

declare module "aaptjs2" {
    export function aapt(args: string[]): Promise<string>;
    export function list(filePath: string): Promise<string>;
    export function dump(filePath: string, values: string): Promise<string>;
    export function packageCmd(filePath: string, command: string): Promise<string>;
    export function remove(filePath: string, files: string|string[]): Promise<string>;
    export function add(filePath: string, files: string|string[]): Promise<string>;
    export function crunch(resource: string|string[], outputFolder: string): Promise<string>;
    export function singleCrunch(inputFile: string, outputFile: string): Promise<string>;
    export function version(): Promise<string>;
    export function getApkInfo(filePath: string): Promise<object>;
    export function getApkAndIcon(filePath: string, outIconName: string, outIconPath?: string): Promise<object>;
}