/**
 * Global app configuration
 *
 * @author flatline
 */

const Config = {
    /**
     * {Number} Database offset, which is used to get data from IndexedDB.
     * Amount of skipped records from the beginning
     */
    dbOffset   : 0,
    /**
     * {Number} Amount of records (organisms) in one chunk (table row). Should
     * be the same like irma.cfg.DB_CHUNK_SIZE
     */
    dbChunkSize: 200,
    /**
     * {Number} Amount of records we need to load from database for our
     * phylogenetic graph
     */
    dbLimit    : 26 * 200
};

module.exports = Config;