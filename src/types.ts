
/* TYPES */

type Filter = ( relativePath: string ) => boolean;
type Transform = ( file: File ) => File;

type PackOptions = string | {
  dest: string,
  filter?: Filter,
  transform?: Transform,
  pack?: ( archive: Archive ) => void | Promise<void>
};

type ExtractOptions = string | {
  dest: string,
  filter?: Filter,
  transform?: Transform,
  extract?: ( relativePath: string, file: File ) => void | Promise<void>
};

type File = {
  contents: string
};

type Archive = {
  [relativePath: string]: File
};

/* EXPORT */

export {Filter, Transform, PackOptions, ExtractOptions, File, Archive};
