
/* NODE */

// Requiring modules lazily so that this library can be used in the browser also

const Node = {
  is: ( typeof process !== 'undefined' ) && ( process.release.name === 'node' ),
  get fs () {
    return require ( 'fs' ).promises;
  },
  get path () {
    return require ( 'path' );
  },
  get process () {
    return require ( 'process' );
  }
};

/* EXPORT */

export default Node;
