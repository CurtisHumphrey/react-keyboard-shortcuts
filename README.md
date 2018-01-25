[![license](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/CurtisHumphrey/react-keyboard-shortcuts/blob/master/LICENSE)

A declarative library for handling hotkeys and focus areas in React applications.

## Feature Overview

- Minimal and declarative API
- Intuitive key commands thanks to [Mousetrap](https://github.com/ccampbell/mousetrap)
- Explicate priority based event handling (see more later)

## Inspired by

- [React Hotkeys](https://github.com/greena13/react-hotkeys)
- [React Keyboard](https://github.com/ruanyl/react-keyboard)

## Difference in event handling

  Most hotkey or shortcut managing libraries follow the focus tree for event handling. Meaning that the element that has
focus tries its handler and if it does not process the hotkey allows its parent to try and so on up do the document root.
However, there are many cases where one element has focus but another has the handler but they are not in each other
linage. 
  
```
          + root
          |
      +---+--------+
      |            |
      |            |
  +---+---+        +
  |       |        Text
  |       |
  +       +
  Back    Next
```

For example, let say that you have a text element that currently have focus but you want the hotkeys alt+b and 
alt+n to work for the back and next buttons.  These two buttons are not in the focus tree but are cousins.
You could in those other libraries set the handlers on the root, but that often means that the root either has to have those 
same redux actions or has to have a reference to the next and back button to make those handlers work. Both are messy. 
Instead react-keyboard-shortcuts allows the Back and Next button to register hotkeys that work globally (regardless of what element 
has focus). 

When the Back and Next buttons mount their hotkeys are register.  When they unmount their hotkeys are unregister 
(via a higher-order-component).  Also if two or more components want to have handlers for the same sequence they each 
provide a priority explicitly that determines who gets first chance (think of it like the z-index for css).  

## Usage

### Easy Example

```javascript
import React from 'react'
import {HotKeys} from 'react-keyboard-shortcuts'

class NextButton extends React.PureComponent {
  static propTypes = {
    onClick: PropTypes.func.isRequired,
  }

  hot_keys = {
    'alt+n': {
      priority: 1,
      handler: () => this.props.onClick(),
    },
  }

  render () {
    return (
      <button onClick={this.props.onClick}> Next</button>
    )
  }
}

export default HotKeys(NextButton)
```

## API

* ```HotKeys([component], [options = {}])```
  * options:
    * ```hot_key_property_name``` - defaults to ```hot_keys```

## Thanks

Thanks to @ccampbell for [Mousetrap](https://github.com/ccampbell/mousetrap)


## License

MIT