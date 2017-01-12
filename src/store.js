import axios from 'axios'

var store = {
  debug: true,
  state: {
    sort: 'hot',
    currentSub: 'all',
    popularSubs: [],
    latestListings: [],
    pagination: {
      last: false,
      count: 25
    }
  },
  getPosts (after) {
    return axios.get('https://www.reddit.com/r/' + this.state.currentSub + '/' + this.state.sort + '.json', {
      params: {
        after: after,
        limit: this.state.pagination.count
      }
    })
  },
  getPost (name) {
    return axios.get('https://www.reddit.com/by_id/' + name + '.json')
  },
  getSubReddits () {
    return axios.get('https://www.reddit.com/subreddits/popular.json')
  },
  getSubReddit (sub) {
    return axios.get('https://www.reddit.com/r/' + sub + '.json')
  },
  setLatestListings (response) {
    var output = []
    for (var i = 0; i < response.data.data.children.length; i++) {
      var child = response.data.data.children[i].data
      // ID, Score, Type, Date ?, Name,
      var line = {
        id: child.id,
        name: child.name,
        score: child.score,
        sub: child.subreddit,
        media_type: child.post_hint,
        created_utc: child.created_utc,
        title: child.title,
        permalink: child.permalink,
        url: child.url.replace(/&amp;/g, '&')
      }
      output.push(line)
    }

    this.state.pagination.last = response.data.data.children[response.data.data.children.length - 1].data.name
    this.state.latestListings = output
  },
  setPopularSubs (subs) {
    this.state.popularSubs = subs
  },
  setSortMode (mode) {
    return new Promise((resolve, reject) => {
      if (mode === 'hot' || mode === 'new' || mode === 'rising' || mode === 'top') {
        this.state.sort = mode
        this.state.pagination.last = false
        resolve(`Now sorting by ${mode}`)
      } else {
        reject('Please specify a valid sorting mode (hot/new/rising/top)')
      }
    })
  },
  setLimit (count) {
    return new Promise((resolve, reject) => {
      if (count > 0 && count <= 100) {
        this.state.pagination.count = count
        resolve(`Limit set to ${this.state.pagination.count}`)
      } else {
        reject('Limit has to be between 1 - 100')
      }
    })
  },
  setCurrentSub (sub) {
    return new Promise((resolve, reject) => {
      if (sub === 'random') {
        this.state.currentSub = this.state.popularSubs[Math.floor(Math.random() * this.state.popularSubs.length)]
        this.state.pagination.last = false
        resolve()
      } else {
        this.getSubReddit(sub).then(() => {
          this.state.currentSub = sub
          this.state.pagination.last = false
          resolve()
        }).catch(() => {
          reject('Please specify a valid subreddit to move to')
        })
      }
    })
  }
}

export default store
