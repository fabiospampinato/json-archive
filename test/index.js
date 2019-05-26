
/* IMPORT */

import {describe} from 'ava-spec';
import * as fs from 'fs-extra';
import archive from '../dist';

/* JSON ARCHIVE */

describe ( 'JSON Archive', it => {

  it ( 'works', async t => {

    /* CLEANUP */

    fs.removeSync ( 'test/output' );
    fs.removeSync ( 'test/output_ext' );
    fs.removeSync ( 'test/output.json' );

    /* INIT */

    fs.outputFileSync ( 'test/output/.dot', 'dot' );
    fs.outputFileSync ( 'test/output/foo.txt', 'foo' );
    fs.outputFileSync ( 'test/output/deeply/nested/nested.txt', 'nested' );
    fs.outputFileSync ( 'test/output/image.svg', 'PD94bWwgdmVyc2lvbj0iMS4wIiA/PjwhRE9DVFlQRSBzdmcgIFBVQkxJQyAnLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4nICAnaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkJz48c3ZnIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDUwIDUwIiBoZWlnaHQ9IjUwcHgiIGlkPSJMYXllcl8xIiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCA1MCA1MCIgd2lkdGg9IjUwcHgiIHhtbDpzcGFjZT0icHJlc2VydmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxyZWN0IGZpbGw9Im5vbmUiIGhlaWdodD0iNTAiIHdpZHRoPSI1MCIvPjxwYXRoIGQ9Ik00NiwxNXYtNCAgYzAtMS4xMDQtMC44OTYtMi0yLTJjMCwwLTI0LjY0OCwwLTI2LDBjLTEuNDY5LDAtMi40ODQtNC00LTRIM0MxLjg5Niw1LDEsNS44OTYsMSw3djR2Mjl2NGMwLDEuMTA0LDAuODk2LDIsMiwyaDM5ICBjMS4xMDQsMCwyLTAuODk2LDItMiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDAwMDAwIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc3Ryb2tlLXdpZHRoPSIyIi8+PHBhdGggZD0iTTEsNDRsNS0yNyAgYzAtMS4xMDQsMC44OTYtMiwyLTJoMzljMS4xMDQsMCwyLDAuODk2LDIsMmwtNSwyNyIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDAwMDAwIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9zdmc+', { encoding: 'base64' } );

    /* PACK */

    const archiveResult = await archive.pack ( 'test/output', {
      dest: 'test/output.json',
      filter: filePath => !filePath.startsWith ( '.' )
    });

    const archiveOutput = require ( './output.json' );

    t.deepEqual ( archiveResult, archiveOutput );
    t.is ( Object.keys ( archiveOutput ).length, 3 );
    t.true ( archiveOutput['foo.txt'].contents.length > 0 );
    t.true ( archiveOutput['deeply/nested/nested.txt'].contents.length > 0 );
    t.true ( archiveOutput['image.svg'].contents.length > 0 );

    /* UNPACK */

    await archive.extract ( 'test/output.json', 'test/output_ext' );

    t.deepEqual ( fs.readFileSync ( 'test/output/foo.txt' ), fs.readFileSync ( 'test/output_ext/foo.txt' ) );
    t.deepEqual ( fs.readFileSync ( 'test/output/deeply/nested/nested.txt' ), fs.readFileSync ( 'test/output_ext/deeply/nested/nested.txt' ) );
    t.deepEqual ( fs.readFileSync ( 'test/output/image.svg' ), fs.readFileSync ( 'test/output_ext/image.svg' ) );

    /* CLEANUP */

    fs.removeSync ( 'test/output' );
    fs.removeSync ( 'test/output_ext' );
    fs.removeSync ( 'test/output.json' );

  });

});
