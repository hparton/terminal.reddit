import moment from 'moment'

export function timeAgo (time) {
  return moment(time, 'x').fromNow()
}

export function UNIXtimeAgo (time) {
  return moment(time * 1000, 'x').fromNow()
}

export function UNIXcalendarDate (time) {
  return moment(time * 1000, 'x').format('DD/MM/YYYY')
}
