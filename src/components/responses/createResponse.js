import table from './table'
import motd from './motd'
import help from './help'
import simple from './simple'

export default {
  functional: true,
  render: function (createElement, context) {
    function appropriateResponse () {
      var type = context.props.type

      if (type === 'list') return table
      if (type === 'motd') return motd
      if (type === 'help') return help
      else return simple
    }

    return createElement(
      appropriateResponse(),
      {
        props: context.props
      },
      'response'
    )
  },
  props: ['content', 'type']
}
