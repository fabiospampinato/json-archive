
/* MAIN */

type Promisable<T> = T | Promise<T>;

type Filter = ( filePathRelative: string ) => Promisable<boolean>;

type Transform = ( file: File ) => Promisable<File>;

type Visit = ( filePathRelative: string, file: File ) => Promisable<void>;

type File = {
  contents: string
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
