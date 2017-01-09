<template>
  <table>
    <thead>
      <td>ID</td>
      <td>SCORE</td>
      <td>TYPE</td>
      <td>DATE</td>
      <td>TITLE</td>
    </thead>

    <tr v-for="row in content">
      <td>{{ row.id }}</td>
      <td>{{ row.score }}</td>
      <td>
        <span v-if="row.media_type === 'link'">URL</span>
        <span v-if="row.media_type === 'image'">IMAGE</span>
        <span v-if="row.media_type === 'rich:video'">VIDEO </span>
        <span v-if="row.media_type == null">THREAD</span>
      </td>
      <td>{{ row.created_utc | UNIXcalendarDate }}</td>
      <td><a v-bind:href="row.url" @click.prevent="type('comments ' + row.id)" target="_blank">{{ row.title }}</a></td>
    </tr >
  </table>
</template>

<script>
import {bus} from '../../bus'

export default {
  name: 'responseTable',
  props: ['content'],
  methods: {
    type: function (str) {
      bus.$emit('typeCommand', str)
    }
  }
}
</script>

<style scoped>
  table {
    max-width: 100%;
    border-collapse: collapse;
    border-spacing: 0;
    margin: 11px 0;
  }

  td {
    padding: 1px 10px;
  }

  td:first-child {
    padding-left: 0px;
  }

  thead {
    color: #a3be8c;
    text-decoration: underline
  }

  a {
    color: inherit;
  }
</style>
