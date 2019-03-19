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
    dbOffset: 5800,
    /**
     * {Number} Amount of records we need to load from database for our
     * phylogenetic graph
     */
    dbLimit: 6000,
    /**
     * {Number} Minimum (closed) width of right code compare panel in pixels
     */
    codePanelMinWidth: 20,
    /**
     * {Number} Maximum (opened) width of right code compare panel in pixels
     */
    codePanelMaxWidth: 542
}

module.exports = Config
