
/* IMPORT */

import {describe} from 'fava';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import * as archive from '../dist/index.js';

/* HELPERS */

const toB64 = str => Buffer.from ( str ).toString ( 'base64' );

/* MAIN */

describe ( 'JSON Archive', it => {

  it ( 'works', async t => {

    /* INIT */

    const archiveBase = {
      '.dot': {
        contents: toB64 ( 'dot' ),
        encoding: 'base64'
      },
      'foo.txt': {
        contents: toB64 ( 'foo' ),
        encoding: 'base64'
      },
      'deeply/nested/nested.txt': {
        contents: toB64 ( 'nested' ),
        encoding: 'base64'
      },
      'image.svg': {
        contents: toB64 ( `<?xml version="1.0" ?><!DOCTYPE svg  PUBLIC '-//W3C//DTD SVG 1.1//EN'  'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'><svg enable-background="new 0 0 50 50" height="50px" id="Layer_1" version="1.1" viewBox="0 0 50 50" width="50px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><rect fill="none" height="50" width="50"/><path d="M46,15v-4  c0-1.104-0.896-2-2-2c0,0-24.648,0-26,0c-1.469,0-2.484-4-4-4H3C1.896,5,1,5.896,1,7v4v29v4c0,1.104,0.896,2,2,2h39  c1.104,0,2-0.896,2-2" fill="none" stroke="#000000" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2"/><path d="M1,44l5-27  c0-1.104,0.896-2,2-2h39c1.104,0,2,0.896,2,2l-5,27" fill="none" stroke="#000000" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2"/></svg>` ),
        encoding: 'base64'
      }
    };

    const archiveFiltered = {
      'foo.txt': archiveBase['foo.txt'],
      'deeply/nested/nested.txt': archiveBase['deeply/nested/nested.txt'],
      'image.svg': archiveBase['image.svg']
    };

    /* VISIT */

    await archive.visit ( archiveBase, {
      visit: ( filePathRelative, file ) => {
        const filePath = path.join ( process.cwd (), 'test', 'output', filePathRelative );
        fs.mkdirSync ( path.dirname ( filePath ), { recursive: true } );
        fs.writeFileSync ( filePath, file.contents, { encoding: file.encoding } );
      }
    });

    /* PACK */

    const archivePacked = await archive.pack ( 'test/output', {
      filter: filePath => !filePath.startsWith ( '.' )
    });

    fs.writeFileSync ( 'test/output.json', JSON.stringify ( archivePacked ) );

    t.deepEqual ( archivePacked, archiveFiltered );

    /* UNPACK */

    const archiveUnpacked = await archive.unpack ( 'test/output.json' );

    t.deepEqual ( archiveUnpacked, archivePacked );

    /* CLEANUP */

    fs.rmSync ( 'test/output', { recursive: true } );
    fs.rmSync ( 'test/output.json' );

  });

});
