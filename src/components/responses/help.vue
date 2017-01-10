<template>
  <div>
  <p>You can use the following commands to get around, <br>when you see <span class="faded">&lt;example&gt;</span> you don't need to put the symbols:<br>
  like so <span class="faded">sort top</span></p>
  <table>
    <template v-for="command in content">
      <tr>
        <td class="command">{{command.name}}</td><td class="command-definition" v-if="command.help">{{command.help[0]}}</td>
      </tr>
      <tr>
        <td class="command"></td>
        <td v-if="command.help[1]" class="command-example">eg. {{command.help[1]}}</td>
        <td v-else class="command-example">eg. {{command.name}}</td>
      </tr>
    </template>
  </table>
  </div>
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

<style scoped>
  table {
    border-collapse: collapse;
  }

  p{
    margin-top: 0;
    line-height: 1.2;
  }

  .command {
    width: 100px;
    display: inline-block;
  }

  .command-definition,
  .command-example {
    display: inline-block;
    width: calc(100% - 100px);
  }

  .command-example,
  .faded {
    color: #65737e;
    padding-bottom: 5px;
  }
</style>
