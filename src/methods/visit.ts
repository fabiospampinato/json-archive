
/* IMPORT */

import type {Archive, VisitOptions} from '../types';

/* HELPERS */

const identity = <T> ( value: T ): T => value;
const yes = (): true => true;

/* MAIN */

const visitArchive = async ( archive: Archive, options: VisitOptions = {} ): Promise<Archive> => {

  const filter = options.filter || yes;
  const transform = options.transform || identity;

  const clone = JSON.parse ( JSON.stringify ( archive ) );
  const filePathsRelative = Object.keys ( clone );

  for ( const filePathRelative of filePathsRelative ) {

    if ( !await filter ( filePathRelative ) ) {

      delete clone[filePathRelative];

    } else {

      clone[filePathRelative] = await transform ( clone[filePathRelative] );

      await options.visit?.( filePathRelative, clone[filePathRelative] );

    }

  }

  return clone;

};

/* EXPORT */

export default visitArchive;
