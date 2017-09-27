import './js/smoothscroll.js'
import './_sass/manifest.scss'

import Vue from 'vue';

const vm = new Vue({
  delimiters:['${', '}'],
  el: '#app',
  data() {
    return {
      message: "HELLOxxx, VUE IS HERE!!",
      burgerDropdownActive: false,
      mainMenuActive: false
    }
  },
  methods: {
    triggerDropdown () {
      this.burgerDropdownActive = !this.burgerDropdownActive
      this.mainMenuActive = !this.mainMenuActive
    }
  }
})
