/**
 * Entry point of application. Creates main Vue instance and run it
 * 'vue' alias set in webpack.base.conf.
 *
 * @author flatline
 */
import Vue from 'vue'
import App from './App'

window.app = new Vue({
    el: '#app',
    components: {App},
    template: '<App/>'
})
