# JSON Archive

Simple archive format based on JSON.

## Features

- **Simple**: It converts a directory into a human-inspectable JSON object that maps file paths to their base-64 encoded contents.
- **Tiny**: The whole package comes at about ~1kb, with 0 third-party dependencies.
- **Universal**: Archives can be visited with the "visit" function in the browser too.

## Install

```sh
npm install --save json-archive
```

## Usage

##### Interface

The following interface is provided:

```ts
interface JSONArchive {
  pack ( folderPath: string, options?: VisitOptions ): Promise<Archive>;
  unpack ( archivePath: string, options?: VisitOptions ): Promise<Archive>;
  visit ( archive: Archive, options?: VisitOptions ): Promise<Archive>;
};

// Types

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
```

##### Examples

Do this to pack a directory:

```ts
import fs from 'fs';
import {pack} from 'json-archive';

const archive = await pack ( 'path/to/dir' );

fs.writeFileSync ( 'archive.json', JSON.stringify ( archive ) );
```

Do this to unpack an archive:

```ts
import fs from 'fs';
import {unpack} from 'json-archive';

const archive = await unpack ( 'archive.json' );
```

Do this to filter/transform/traverse an archive:

```ts
import fs from 'fs';
import {visit} from 'json-archive';

const transformedArchive = await visit ( archive, {
  filter: filePath => {
    return !filePath.startsWith ( '.' );
  },
  visit: ( filePath, file ) => {
    fs.writeFileSync ( filePath, file.contents, { encoding: 'base64' } );
  }
});
```

## License

MIT © Fabio Spampinato
