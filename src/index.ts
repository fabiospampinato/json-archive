
/* IMPORT */

import {PackOptions, ExtractOptions, Archive} from './types';
import Utils from './utils';

/* JSON ARCHIVE */

//TODO: Add a CLI aliased to `jsar` (inspired to asar)
//TODO: Add support for more stuff (symlinks, empty dirs, preserving permissions etc.)

const Archive = {

  async pack ( source: string, options?: PackOptions ): Promise<Archive> {

    if ( Utils.lang.isString ( options ) ) return Archive.pack ( source, { dest: options } );

    if ( !options ) return Archive.pack ( source, { dest: Utils.archive.inferPackName ( source ) } );

    if ( !options.dest ) return Archive.pack ( source, { ...options, dest: Utils.archive.inferPackName ( source ) } );

    const src = Utils.path.getAbsolute ( source ),
          dst = Utils.path.getAbsolute ( options.dest ),
          archive = await Utils.archive.get ( src, options.filter, options.transform );

    if ( options.pack ) {
      await options.pack ( archive );
    } else {
      await Utils.archive.write ( dst, archive );
    }

    return archive;

  },

  async extract ( source: string | Archive, options?: ExtractOptions ): Promise<void> {

    if ( Utils.lang.isString ( options ) ) return Archive.extract ( source, { dest: options } );

    if ( !options ) return Archive.extract ( source, { dest: Utils.archive.inferExtractName ( source ) } );

    if ( !options.dest ) return Archive.extract ( source, { ...options, dest: Utils.archive.inferExtractName ( source ) } );

    if ( Utils.lang.isString ( source ) ) return Archive.extract ( await Utils.archive.read ( Utils.path.getAbsolute ( source ) ), options );

    const dst = Utils.path.getAbsolute ( options.dest ),
          relativePaths = Object.keys ( source );

    await Promise.all ( relativePaths.map ( relativePath => {
      if ( options.filter && !options.filter ( relativePath ) ) return;
      let file = source[relativePath];
      if ( options.transform ) file = options.transform ( file );
      const filePath = Utils.path.getAbsolute ( relativePath, dst );
      if ( options.extract ) return options.extract ( filePath, file );
      return Utils.archive.writeFile ( filePath, file );
    }));

  }

};

/* EXPORT */

export default Archive;
