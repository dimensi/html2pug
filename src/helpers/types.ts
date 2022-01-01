export interface ILocalStorageParams {
  html: string;
  options: Partial<IOptions>;
}
export type IOptions = {
  nSpaces: number;
  bodyLess: boolean;
  attrComma: boolean;
  encode: boolean;
  doubleQuotes: boolean;
  inlineCSS: boolean;
  indent: "spaces" | "tabs";
  save: boolean;
};
export type TMapElements = Record<string, HTMLInputElement>;
