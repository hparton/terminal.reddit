<template>
  <div v-html="content"></div>
</template>

<script>
export default {
  name: 'response',
  props: ['content']
}
</script>
