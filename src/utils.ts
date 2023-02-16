
/* IMPORT */

import fs from 'node:fs';
import path from 'node:path';
import readdir from 'tiny-readdir';
import type {File} from '~/types';

/* MAIN */

const Utils = {

  /* FS API */

  fs: {

    getFile: ( filePath: string, encoding: 'base64' | 'utf8' ): File => {

      const contents = fs.readFileSync ( filePath, encoding );

      return {contents};

    },

    getFilePaths: async ( folderPath: string ): Promise<string[]> => {

      const {files} = await readdir ( folderPath );

      return files;

    }

  },

  /* PATH API */

  path: {

    getAbsolute ( filePath: string ): string {

      return path.resolve ( process.cwd (), filePath );

    },

    getRelative ( filePath: string, basePath: string ): string {

      return path.relative ( basePath, filePath );

    }

  }

};

/* EXPORT */

export default Utils;
