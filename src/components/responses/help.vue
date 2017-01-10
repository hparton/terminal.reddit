<template v-once>
  <ul>
    <li v-for="command in content">
      {{command.name}} - <span v-if="command.help">{{command.help[0]}}</span>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'responseHelp',
  props: ['content'],
  created () {
    console.log(this.content)
  }
}
</script>
