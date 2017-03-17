import {connect} from 'react-redux'
import {createStore, compose, applyMiddleware} from 'redux'
import React from 'react'
import {render} from 'react-dom'
import View from 'view'

const zoom = (previous, next)=> ({
  height: previous.height * next.height,
  width: previous.width * next.width,
  left: previous.left + (next.left * previous.width),
  top: previous.top + (next.top * previous.height)
})

const reducer = (state,action)=> {
  switch(action.type) {
    case 'ZOOM':
      return zoom(state, action.box)
    default:
      return state
  }
}

const store = createStore(reducer, {width: 5, height: 3, top: -1.5, left: -2.5}, window.devToolsExtension ? compose(devToolsExtension()): compose())
const App = connect((model) => ({ model }))(View)

document.addEventListener('DOMContentLoaded', function() {
  render(<App store={store} />, document.getElementById("app"))
})
