const toHash = (state)=> `i${state.iterations}x${state.x}y${state.y}s${state.scale}`

const fromHash = (defaults, hash)=> {
  const decimalRegExp = /(-?\d+(?:\.\d+)?(?:[eE][-+]?\d+)?)/,
        segments      = hash.substr(1).split(decimalRegExp).slice(0,-1),
        keys          = Object.keys(defaults)
  let o = {}
  for(let i = 0; i <= segments.length; i += 2) {
    let key = keys.find((k)=> k[0] == segments[i])
    if(key)
      o[key] = parseFloat(segments[i+1])
  }
  return Object.assign(defaults, o)
}

export {toHash,fromHash}
