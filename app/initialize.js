import {connect} from 'react-redux'
import {createStore, compose, applyMiddleware} from 'redux'
import React from 'react'
import {render} from 'react-dom'
import {View} from 'view'

const reducer = (state,action)=> state
const store = createStore(reducer, null, window.devToolsExtension ? compose(devToolsExtension()): compose())
const App = connect((model) => ({ model }))(View)

document.addEventListener('DOMContentLoaded', function() {
  render(<App store={store} />, document.getElementById("app"))
})
