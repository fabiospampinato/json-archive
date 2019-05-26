# JSON Archive

Simple archive format based on JSON.

## Features

- **Simple**: It converts a directory into a human-inspectable JSON object that maps file paths to their base-64 encoded contents.
- **Tiny**: The whole package comes at about ~1kb, with 0 dependencies.
- **Universal**: This library can be used in browser environments too, and you could also just load the produced JSON archive natively.

## Install

```sh
npm install --save json-archive
```

## Usage

##### Interface

The following interface is provided:

```ts
interface JSONArchive {
  async pack ( source: string, options?: PackOptions ): Promise<Archive>;
  async extract ( source: string | Archive, options?: ExtractOptions ): Promise<void>;
};

// Types

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
```

##### Examples

Do this to pack a directory:

```ts
import JSONArchive from 'json-archive';

JSONArchive.pack ( 'path/to/dir', 'dir.json' );
```

Do this to extract an archive:

```ts
import archive from 'json-archive';

JSONArchive.extract ( 'dir.json', 'dir' );
```

## License

MIT © Fabio Spampinato
