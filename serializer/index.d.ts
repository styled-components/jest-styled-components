import { NewPlugin } from 'pretty-format'

export interface StyledComponentsSerializerOptions {
  addStyles?: boolean,
  classNameFormatter?: (index: number) => string
}

export declare const styleSheetSerializer: NewPlugin & {
  setStyleSheetSerializerOptions: (options?: StyledComponentsSerializerOptions) => void
};

export declare const setStyleSheetSerializerOptions: (options?: StyledComponentsSerializerOptions) => void;
