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
                    const data = {nodes: [], edges: []}
                    this.db.fetch(Config.dbOffset, Config.dbLimit)
                        .then(rows => {
                            const nodes = data.nodes
                            const edges = data.edges
                            for (let i = 0, len = rows.length; i < len; i++) {
                                nodes.push(...rows[i].orgs)
                                edges.push(...rows[i].edges)
                            }
                            for (let i = 0; i < nodes.length; i++) {
                                const id = nodes[i].data.id
                                if (edges.find(n => n.data.source === id || n.data.target === id) === undefined) {
                                    nodes.splice(i, 1)
                                    i--
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
