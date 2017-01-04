<template>
  <div class="loading" v-if="!loaded">
    <pre class="ascii-logo">
        ,--,         ,--.
      ,--.'|       ,--.'|
   ,--,  | :   ,--,:  : |
,---.'|  : ',`--.'`|  ' :
|   | : _' ||   :  :  | |
:   : |.'  |:   |   \ | :
|   ' '  ; :|   : '  '; |
'   |  .'. |'   ' ;.    ;
|   | :  | '|   | | \   |
'   : |  : ;'   : |  ; .'
|   | '  ,/ |   | '`--'
;   : ;--'  '   : |
|   ,/      ;   |.'
'---'       '---'
    </pre>
    <progressBar :percentage="percentage" :length="20"></progressBar>
  </div>
</template>

<script>
import progressBar from './progressBar'

export default {
  name: 'loading',
  props: ['loading'],
  data () {
    return {
      percentage: 0,
      loaded: false
    }
  },
  created () {
    var self = this
    setInterval(function () {
      if (self.percentage < 100) {
        self.percentage++
      } else if (!self.loaded) {
        self.loaded = true
        self.$emit('loaded')
      }
    }, 20)
  },
  components: {
    progressBar
  }
}
</script>

<style>

  .ascii-logo {
    color: #ff6600;
    display: table;
    margin: 1em auto;
  }

</style>
