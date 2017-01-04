<template>
    <div class="progress-bar">
      <span>[</span><span v-if="percentage"><span v-for="n in chunks">=</span ><span v-for="n in missingChunks">&nbsp;</span></span><span>]</span>
    </div>
</template>

<script>
export default {
  name: 'progressBar',
  props: ['percentage', 'length'],
  computed: {
    chunks: function () {
      return Math.floor(this.percentage / 100 * this.length)
    },
    missingChunks: function () {
      return Math.floor(this.length - this.chunks)
    }
  }
}
</script>

<style scoped>

  .progress-bar {
    color: white;
    line-height: 1;
  }

</style>
