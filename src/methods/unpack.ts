
/* IMPORT */

import visit from '~/methods/visit';
import Utils from '~/utils';
import type {Archive, VisitOptions} from '~/types';

/* MAIN */

const unpack = async ( archivePath: string, options: VisitOptions = {} ): Promise<Archive> => {

  const src = Utils.path.getAbsolute ( archivePath );
  const archiveFile = await Utils.fs.getFile ( src, 'utf8' );
  const archive: Archive = JSON.parse ( archiveFile.contents );

  return visit ( archive, options );

};

/* EXPORT */

export default unpack;
