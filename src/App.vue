<!--
  Application(root) component. Creates main DOM elements like 'cytoscape'
  canvas and code compare panel.

  @author flatline
-->
<script>
    import CodeCompare from './views/CodeCompare'
    import PhylogeneticTree from './views/PhylogeneticTree'

    export default {
        name: 'IrmaTree',
        components: {
            CodeCompare,
            PhylogeneticTree
        },
        data () {
            return {
                leftCode: [],
                rightCode: []
            }
        },
        methods: {
            onLeftCode (code) {
                this.leftCode = code
            },
            onRightCode (code) {
                this.rightCode = code
            }
        }
    }
</script>

<template>
    <div id="app">
        <CodeCompare v-bind:left="leftCode" v-bind:right="rightCode"/>
        <PhylogeneticTree v-on:lcode="onLeftCode" v-on:rcode="onRightCode"/>
    </div>
</template>

<style lang="less">
    body {
        &#prettydiff {
            text-align: start;
            &.white {
                background: none;
            }
        }
        margin: 0;
    }
    #app {
        width : 100%;
        height: 100%;
    }
</style>
