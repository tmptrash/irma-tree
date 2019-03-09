<!--
 Component for showing phylogenetic tree of organisms

 @author flatline
-->
<script>
    import Db from './../Db'
    const Cytoscape = require('cytoscape')
    const Dagre = require('cytoscape-dagre')
    const Config = require('./../Config.js')
    /**
     * We use this algorithm for creating phylogenetic tree graph
     */
    Cytoscape.use(Dagre)

    export default {
        name: 'PhylogeneticTree',
        methods: {
            onLeftClick (e) {
                this.$emit('lcode', e.target.data().code)
            },
            onRightClick (e) {
                this.$emit('rcode', e.target.data().code)
            },
            loadTree () {
                return new Promise((resolve, reject) => {
                    this.db.fetch(Config.dbOffset, Config.dbLimit)
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
                            for (let n = 0; n < nodes.length; n++) {
                                const id = nodes[n].data.id
                                if (edges.find(n => n.data.source === id || n.data.target === id) === undefined) {
                                    nodes.splice(n, 1)
                                    n--
                                }
                            }
                            resolve(data)
                        })
                        .catch(reject)
                })
            }
        },
        created () {
            !this.db && (this.db = new Db())
        },
        mounted () {
            this.loadTree().then(els => {
                const cy = window.cy = Cytoscape({
                    container: document.getElementById('cy'),
                    boxSelectionEnabled: true,
                    autounselectify: false,
                    layout: {
                        name: 'dagre',
                        animate: false,
                        nodeSep: 40,
                        rankSep: 200 // distance between vertical nodes
                    },
                    style: [{
                        selector: 'node',
                        style: {
                            'background-color': '#11479e',
                            label: 'data(id)',
                            width: 15, // node circle diameter
                            height: 15 // node circle diameter
                        }
                    }, {
                        selector: 'edge',
                        style: {
                            width: 4,
                            'target-arrow-shape': 'triangle',
                            'line-color': '#e0ebeb',
                            'target-arrow-color': '#e0ebeb',
                            'curve-style': 'bezier'
                        }
                    }],
                    elements: els
                })

                cy.nodes().on('cxttap', this.onRightClick.bind(this))
                cy.nodes().on('click', this.onLeftClick.bind(this))
            })
        }
    }
</script>

<template>
    <div id="cy"></div>
</template>

<style lang="less">
    #cy {
        width   : 100%;
        height  : 100%;
        position: absolute;
        left    : 0;
        top     : 0;
    }
</style>
