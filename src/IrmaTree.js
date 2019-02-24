/**
 * This is small application for creating phylogenetic tree of digital
 * organisms population generated by "irma" app.
 *
 * @author flatline
 */
const Cytoscape = require('cytoscape');
const Dagre     = require('cytoscape-dagre');
const Db        = require('./Db');
const Config    = require('./Config');
/**
 * We use this algorithm for creating phylogenetic tree graph
 */
Cytoscape.use(Dagre);

class IrmaTree {
    constructor() {
        this._db = new Db();
    }

    destroy() {
        this._db.destroy();
        this._db = null;
    }

    run() {
        this._loadTree().then(els => {
            window.cy = Cytoscape({
                container          : document.getElementById('cy'),
                boxSelectionEnabled: true,
                autounselectify    : false ,
                layout             : {
                    name                    : 'dagre',
                    animate                 : false,
                    nodeSep                 : 40,
                    rankSep                 : 200 // distance between vertical nodes
                },
                style              : [{
                    selector: 'node',
                    style   : {
                        'background-color'  : '#11479e',
                        label               : 'data(id)',
                        width               : 15, // node circle diameter
                        height              : 15  // node circle diameter
                    }
                }, {
                    selector: 'edge',
                    style   : {
                        width               : 4,
                        'target-arrow-shape': 'triangle',
                        'line-color'        : '#e0ebeb',
                        'target-arrow-color': '#e0ebeb',
                        'curve-style'       : 'bezier'
                    }
                }],
                elements           : els
            });
        });
    }

    _loadTree() {
        return new Promise((resolve, reject) => {
            const data = {nodes: [], edges: []};
            this._db.fetch(Config.dbOffset, Config.dbLimit)
                .then(rows => {
                    const nodes = data.nodes;
                    const edges = data.edges;
                    for (let i = 0, len = rows.length; i < len; i++) {
                        nodes.push(...rows[i].orgs);
                        edges.push(...rows[i].edges);
                    }
                    for (let i = 0; i < nodes.length; i++) {
                        const id = nodes[i].data.id;
                        if (edges.find(n => n.data.source === id || n.data.target === id) === undefined) {
                            nodes.splice(i, 1);
                            i--;
                        }
                    }
                    console.log(data);
                    resolve(data);
                })
                .catch(reject);
        });
    }
}
//
// Global instance of application
//
window.irmaTree = new IrmaTree();

module.exports = IrmaTree;