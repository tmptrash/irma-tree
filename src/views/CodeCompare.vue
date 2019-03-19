<!--
 Component of comparing of code of two organisms. Consists of two panels
 left and right. Uses 'jsdifflib' for comparing

 @author flatline
-->
<script>
    import './../../node_modules/prettydiff/css/index.css'
    const Config = require('./../Config.js')
    const Bytes2Code = require('./../../../irma/src/irma/Bytes2Code')
    const PrettyDiff = require('prettydiff')

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

                const options = PrettyDiff.defaults
                options.diff_format = 'html'
                options.source_label = 'Code before'
                options.diff_label = 'Code after'
                options.source = Bytes2Code.toCode(this.left)
                options.diff = Bytes2Code.toCode(this.right)
                this.$el.innerHTML = PrettyDiff.mode(options)
                //
                // Removes PrettyDiff's title and author elements
                //
                this.$el.removeChild(this.$el.firstChild)
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
    <!-- "prettydiff" id and "white" class - are identifiers for "prettydiff" library -->
    <div v-on:click="onClick" v-bind:style="{ width: width + 'px' }" id="prettydiff" class="compare white"/>
</template>

<style lang="less">
    #prettydiff.compare {
        .diff {
            border-left-width: 0;
            margin: 0;
            .count {
                border-right-color: rgb(204, 204, 204);
            }
            li {
                &.replace {
                    em {
                        background-color: #fec;
                        color: black;
                        border-style: none;
                        border-width: 0;
                        font-weight: normal;
                        margin: 0;
                    }
                }

                &.fold {
                    padding-left: 12px;
                }

                width: 26px;
                font-family: monospace;
            }
        }

        text-align: start;
        position        : absolute;
        right           : 0;
        width           : 20px;
        height          : 100%;
        background-color: #eee;
        border-left     : 1px solid #999;
        cursor          : pointer;
        overflow        : auto;
        z-index         : 1;
        transition      : width 0.2s ease-out;
    }
</style>
