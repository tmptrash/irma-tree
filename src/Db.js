/**
 * IndexedDB wrapper. Loads data, stored by irma app for phylogenetic tree creation.
 * These data are used to create phylogenetic graph.
 *
 * @author flatline
 */
const Dexie = require('dexie').default

export default class Db {
    constructor () {
        this._db = new Dexie('irma')
        this._db.version(1).stores({orgs: '++id'})
    }

    destroy () {
        this._db.close() // no promise needed
        this._db = null
    }

    /**
     * Fetches organisms from database using standard offset and limit
     * @param {Number} offs
     * @param {Number|undefined} limit
     * @return {Promise}
     */
    fetch (offs = 0, limit = undefined) {
        if (offs === 0 && limit === undefined) {
            return this._db.orgs.toArray()
        } else if (limit === undefined) {
            return this._db.orgs.limit(limit).toArray()
        }
        return this._db.orgs.offset(offs).limit(limit).toArray()
    }
}
