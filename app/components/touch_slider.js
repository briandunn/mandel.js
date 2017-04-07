import React from 'react'

class TouchSlider extends React.Component {
  onClick(increment) {
    return (e)=> {
      e.stopPropagation()
      e.preventDefault()
      e.target.value = this.props.value + increment
      this.props.onChange(e)
    }
  }

  render() {
    return (
      <div id='slider'>
        <div className='up' onTouchMove={this.onClick(1)} onTouchStart={this.onClick(1)}/>
        <div className='down' onTouchMove={this.onClick(-1)} onTouchStart={this.onClick(-1)}/>
      </div>
    )
  }
}

export default TouchSlider
