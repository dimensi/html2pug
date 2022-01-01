export interface ILocalStorageParams {
  html: string;
  options: TOptions;
}
export type TOptions = Record<string, boolean | number>;
export type TMapElements = Record<string, HTMLInputElement>;
