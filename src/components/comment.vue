<template>
  <li class="comment">
    <div>
      <span class="comment-author">{{comment.author}}</span> -
      <span class="comment-score">
        <span v-if="comment.score >= 0" class="score--positive">▲</span><span v-else class="score--negative">▼</span> {{comment.score}}
      </span>
      - <span class="comment-created">{{comment.created_utc | UNIXtimeAgo }}</span>
    </div>
    <div class="comment-body" v-html="marked"></div>
    <ul class="comment-kids" v-if="comment.replies">
      <comment
        v-for="reply in comment.replies.data.children"
        v-if="reply.kind !== 'more'"
        :comment="reply.data"
        :depth="depth + 1"
      ></comment>
    </ul>
  </li>
</template>

<script>
import snuownd from 'snuownd'

export default {
  name: 'comment',
  props: ['comment', 'depth'],
  computed: {
    marked: function () {
      return snuownd.getParser().render(this.comment.body)
    }
  }
}
</script>

<style>

  .comment-body {
    border-left: 2px solid white;
    padding-left: 10px;
    line-height: 1.4;
  }

  .comment {
    margin-top: 1rem;
  }

  .comment a {
    color: inherit;
  }

  .comment-kids {
      margin-left: 1.5em;
  }

  .comment-kids {
    padding-left: 0;
  }

  .comment-author {
    margin-bottom: -0.55em;
    display: block;
    color: #d08770;
  }

  .comment-author,
  .comment-score,
  .comment-created {
    display:  inline-block;
  }
</style>
