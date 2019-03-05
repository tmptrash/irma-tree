<!--
 Component of comparing of code of two organisms. Consists of two panels
 left and right. Uses 'jsdifflib' for comparing

 @author flatline
-->
<script>
    import './../../node_modules/jsdifflib/index.css'
    const Config = require('./../Config.js')
    const Diff = require('jsdifflib')
    const Bytes2Code = require('./../../../irma/src/irma/Bytes2Code')

    export default {
        name: 'CodeCompare',
        props: {
            left: {
                type: Array
            },
            right: {
                type: Array
            }
        },
        data () {
            return {
                width: Config.codePanelMinWidth
            }
        },
        watch: {
            left: function () { this.update() },
            right: function () { this.update() }
        },
        methods: {
            onClick () {
                this.width = this.width === Config.codePanelMaxWidth ? Config.codePanelMinWidth : Config.codePanelMaxWidth
            },
            update () {
                this.$el.innerHTML = ''
                if (this.$el.style.width === Config.codePanelMinWidth + 'px') { return }

                this.$el.appendChild(Diff.buildView({
                    baseText: Bytes2Code.toCode(this.left),
                    newText: Bytes2Code.toCode(this.right),
                    baseTextName: 'Before',
                    newTextName: 'After'
                }))
                const authorEl = this.$el.getElementsByClassName('author')[0]
                authorEl.parentElement.removeChild(authorEl)
            }
        },
        updated () {
            this.update()
        }
    }
</script>

<template>
    <div v-on:click="onClick" v-bind:style="{ width: width + 'px' }" class="compare"/>
</template>

<style lang="less">
    .compare {
        position        : absolute;
        right           : 0;
        width           : 20px;
        height          : 100%;
        background-color: #eee;
        border-left     : 1px solid #9e9e9e;
        cursor          : pointer;
        overflow        : auto;
        z-index         : 1;
        transition      : width 0.2s ease-out;
        font-family     : monospace;

        .diff {
            width: 100%;
            thead {
                font-family: monospace;
            }
            tbody {
                th {
                    width: 30px;
                }
            }
            th {
                padding: 0 5px 0 0;
                vertical-align: middle;
            }
            td {
                padding: 0 0 0 5px;
                font-family: monospace;
            }
        }
    }
</style>
