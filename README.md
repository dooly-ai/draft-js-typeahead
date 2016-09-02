# draft-js-typeahead

[![NPM version][npm-image]][npm-url]

Typeaheads for Draft.js inspired by Facebook.com.

This package provides a higher-order component that wraps draft's `Editor` and augments it with typeahead superpowers. One popular use for `draft-js-typeahead` is to add mentions to your editors.

## Installation

```sh
$ npm install --save draft-js-typeahead
```
## Examples

An example is worth a million words. Please check out the examples under the [/examples](examples) directory.

## Usage with ES6

`draft-js-typeahead` helps in three ways:
 - It figures out if and where the typeahead should be showing.
 - It keeps track of the typeahead's currently selected item.
 - It provides a callback for when a typeahead item is locked in (by hitting return).

To start using it, first import `TypeaheadEditor`:

```js
import { TypeaheadEditor } from 'draft-js-typeahead';
```

`TypeaheadEditor` is a react component that wraps draft's `Editor` and subsequently supports all of the same properties as the latter, as well as a few others.

##### `onTypeaheadChange => (typeaheadState)`:

This method is called when the typeahead's visibility, position, or text changes. `typeaheadState` is an object with `left`, `top`, `text`, and `selectedIndex` properties - everything you need to know to render your typeahead. Typically you'd store the typeahead's state on your own component and use that in your component's `render()` method to position and display an overlay.

##### `handleTypeaheadReturn => (text, selectedIndex, selection)`:

This method is called when the typeahead's value is locked in by the user hitting return. This is where you'd autocomplete the selection and tag it with an entity, if wanted.

*Note that by default `draft-js-typeahead` does not help with filtering items in the typeahead based on the entered text, for an example on how to do that please take a look at the mentions example.*

## License

MIT © [Justin Vaillancourt]()


[npm-image]: https://badge.fury.io/js/draft-js-typeahead.svg
[npm-url]: https://npmjs.org/package/draft-js-typeahead
