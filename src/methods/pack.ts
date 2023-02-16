
/* IMPORT */

import visit from '~/methods/visit';
import Utils from '~/utils';
import type {Archive, VisitOptions} from '~/types';

/* MAIN */

const pack = async ( folderPath: string, options: VisitOptions = {} ): Promise<Archive> => {

  const src = Utils.path.getAbsolute ( folderPath );
  const filePaths = await Utils.fs.getFilePaths ( src );
  const filePathsRelative = filePaths.map ( filePath => Utils.path.getRelative ( filePath, src ) );
  const fileFiles = filePaths.map ( filePath => Utils.fs.getFile ( filePath, 'base64' ) );
  const fileEntries = filePathsRelative.map ( ( _, index ) => [filePathsRelative[index], fileFiles[index]] );
  const archive: Archive = Object.fromEntries ( fileEntries );

  return visit ( archive, options );

};

/* EXPORT */

export default pack;
