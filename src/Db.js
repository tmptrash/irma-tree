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
     * Fetches organisms from database using standard offset and limit. Returns data
     * which is ready to load into cytoscape.js library
     * @param {Number} offs
     * @param {Number|undefined} limit
     * @return {Promise}
     */
    fetch (offs = 0, limit = undefined) {
        return this._fetch(offs, limit)
            .then(rows => {
                const data = {nodes: new Array(rows.length), edges: new Array(rows.length)}
                const edges = data.edges
                const nodes = data.nodes
                let e = 0

                for (let r = 0, len = rows.length; r < len; r++) {
                    const row = rows[r]
                    nodes[r] = {data: {id: row.id, code: row.code}}
                    row.parent && (edges[e++] = {data: {source: row.parent, target: row.id}})
                }
                edges.splice(e, rows.length - e)

                return data
            })
    }

    clearNodes (data) {
        const nodes = data.nodes
        const edges = data.edges

        for (let n = 0; n < nodes.length; n++) {
            const nodeId = nodes[n].data.id
            if (edges.find(e => e.data.source === nodeId || e.data.target === nodeId) === undefined) {
                nodes.splice(n, 1)
                n--
            }
        }
    }

    clearEdges (data) {
        const nodes = data.nodes
        const edges = data.edges

        for (let e = 0; e < edges.length; e++) {
            const srcId = edges[e].data.source
            const destId = edges[e].data.target
            if (nodes.find(n => n.data.id === srcId) === undefined || nodes.find(n => n.data.id === destId) === undefined) {
                edges.splice(e, 1)
                e--
            }
        }
    }

    _fetch (offs, limit) {
        if (offs === 0 && limit === undefined) {
            return this._db.orgs.toArray()
        } else if (limit === undefined) {
            return this._db.orgs.limit(limit).toArray()
        }
        return this._db.orgs.offset(offs).limit(limit).toArray()
    }
}
