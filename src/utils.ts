
/* IMPROT */

import {Filter, Transform, File, Archive} from './types';
import Node from './node';

/* UTILS */

const Utils = {

  lang: {

    isString ( x ): x is string {

      return typeof x === 'string';

    }

  },

  path: {

    getCWD (): string {

      return Node.is ? Node.process.cwd () : '/';

    },

    getFileName ( filePath: string ): string {

      return filePath.replace ( /^.*[\\\/]/, '' );

    },

    getFilePaths ( folderPath: string ): Promise<string[]> {

      async function getFilepaths ( dir: string ) {
        const files: string[] = [];
        const subs = await Node.fs.readdir ( dir );
        await Promise.all ( subs.map ( async sub => {
          const res = Node.path.resolve ( dir, sub );
          const stat = await Node.fs.stat ( res );
          const f = stat.isDirectory () ? await getFilepaths ( res ) : [res];
          files.push ( ...f );
        }));
        return files.sort ();
      }

      return getFilepaths ( folderPath );

    },

    getAbsolute ( filePath: string, basePath?: string ): string {

      if ( !Node.is ) return filePath;

      if ( !basePath ) basePath = Utils.path.getCWD ();

      return Node.path.resolve ( basePath, filePath );

    },

    getRelative ( filePath: string, basePath: string ): string {

      if ( !Node.is ) return filePath;

      return Node.path.relative ( basePath, filePath );

    }

  },

  file: {

    read ( filePath: string, encoding: string ): Promise<string> {

      return Node.fs.readFile ( filePath, {encoding} );

    },

    async write ( filePath: string, contents: string, encoding: string ): Promise<void> {

      const folderPath = Node.path.dirname ( filePath );

      await Utils.folder.ensure ( folderPath );

      return Node.fs.writeFile ( filePath, contents, {encoding} );

    }

  },

  folder: {

    async ensure ( folderPath: string ): Promise<void> {

      try {

        return await Node.fs.mkdir ( folderPath, { recursive: true } );

      } catch {}

    }

  },

  archive: {

    async get ( folderPath: string, filter?: Filter, transform?: Transform ): Promise<Archive> {

      const archive: Archive = {},
            filePaths = await Utils.path.getFilePaths ( folderPath );

      await Promise.all ( filePaths.map ( async filePath => {
        const relativePath = Utils.path.getRelative ( filePath, folderPath );
        if ( filter && ! filter ( relativePath ) ) return;
        let file = await Utils.archive.getFile ( filePath );
        if ( transform ) file = transform ( file );
        archive[relativePath] = file;
      }));

      return archive;

    },

    async read ( filePath: string ): Promise<Archive> {

      const contents = await Utils.file.read ( filePath, 'utf8' );

      return JSON.parse ( contents );

    },

    write ( filePath: string, archive: Archive ): Promise<void> {

      const contents = JSON.stringify ( archive, undefined, 2 );

      return Utils.file.write ( filePath, contents, 'utf8' );

    },

    async getFile ( filePath: string ): Promise<File> {

      const contents = await Utils.file.read ( filePath, 'base64' );

      return {contents};

    },

    writeFile ( filePath: string, file: File ): Promise<void> {

      return Utils.file.write ( filePath, file.contents, 'base64' );

    },

    inferPackName ( folderPath: string ): string {

      const fileName = Utils.path.getFileName ( folderPath );

      return `${fileName}.json`;

    },

    inferExtractName ( source: string | Archive ): string {

      if ( !Utils.lang.isString ( source ) ) return 'archive';

      const fileName = Utils.path.getFileName ( source );

      return fileName.replace ( '\.json$', '' ) || 'archive';

    }

  }

};

/* EXPORT */

export default Utils;
