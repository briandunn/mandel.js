import {connect} from 'react-redux'
import {createStore, compose, applyMiddleware} from 'redux'
import React from 'react'
import {render} from 'react-dom'
import View from 'view'
import {fromHash,toHash} from 'url'

const zoom = (previous, next)=> ({
  height: previous.height * next.height,
  width: previous.width * next.width,
  left: previous.left + (next.left * previous.width),
  top: previous.top + (next.top * previous.height)
})

const reducer = (state,action)=> {
  switch(action.type) {
    case 'ZOOM':
      return Object.assign(
        {},
        state,
        zoom(state, action.box)
      )
    case 'ITERATIONS':
      const iterations = Math.max(Math.min(action.iterations, 0xfff), 0)
      return Object.assign({}, state, {iterations: iterations})
    case 'GL':
      return Object.assign({}, state, {gl: action.gl})
    default:
      return state
  }
}

const defaults = {iterations: 40, width: 5, height: 3, top: -1.5, left: -2.5, gl: true}

const store = createStore(reducer, fromHash(defaults, window.location.hash), window.devToolsExtension ? compose(devToolsExtension()): compose())
const App = connect((model) => ({ model }))(View)

store.subscribe(()=> {
  window.location.hash = toHash(store.getState())
})

document.addEventListener('DOMContentLoaded', function() {
  render(<App store={store} />, document.getElementById("app"))
})
