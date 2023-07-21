
/* MAIN */

type Promisable<T> = T | Promise<T>;

type Filter = ( filePathRelative: string ) => Promisable<boolean>;

type Transform = ( file: File ) => Promisable<File>;

type Visit = ( filePathRelative: string, file: File ) => Promisable<void>;

type Encoding = 'ascii' | 'base64' | 'base64url' | 'binary' | 'hex' | 'latin1' | 'utf8' | 'utf-8' | 'utf16le' | 'ucs2' | 'ucs-2';

type File = {
  contents: string,
  encoding: Encoding
};

type Archive = {
  [filePathRelative: string]: File
};

type VisitOptions = {
  filter?: Filter,
  transform?: Transform,
  visit?: Visit
};

/* EXPORT */

export type {File, Archive, VisitOptions};
