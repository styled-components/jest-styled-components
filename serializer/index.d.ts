import { NewPlugin } from 'pretty-format'

export interface StyledComponentsSerializerOptions {
  /** Whether to prepend CSS rules to the snapshot output. @default true */
  addStyles?: boolean,
  /** Custom formatter for replacement class names. Receives a zero-based index and returns the placeholder string. @default (index) => `c${index}` */
  classNameFormatter?: (index: number) => string
}

export declare const styleSheetSerializer: NewPlugin & {
  setStyleSheetSerializerOptions: (options?: StyledComponentsSerializerOptions) => void
};

export declare const setStyleSheetSerializerOptions: (options?: StyledComponentsSerializerOptions) => void;
