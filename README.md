# draft-js-typeahead

[![NPM version][npm-image]][npm-url]

Typeaheads for Draft.js inspired by Facebook.com.

[Check out an example of mentions in draft using draft-js-typeahead here. 🎉](http://dooly-ai.github.io/draft-js-typeahead/)

This package provides a higher-order component that wraps draft's `Editor` component and augments it with typeahead superpowers. One popular use for draft-js-typeahead is to add support for mentions in draft editors.

-

draft-js-typeahead helps in three ways:
 - It figures out *if* and *where* the typeahead should be showing.
 - It keeps track of the typeahead's highlighted item.
 - It triggers a callback when an item is selected (by hitting return).


## Installation

```sh
$ npm install --save draft-js-typeahead
```


## Examples

[Examples are available under the `/examples` directory.](/examples)


## Usage

First we'll need to import `TypeaheadEditor`:

```javascript
import { TypeaheadEditor } from 'draft-js-typeahead';
```

`TypeaheadEditor` is a react component that wraps draft's `Editor`.

-

It supports all of the same properties as the latter, as well as a few others:

`onTypeaheadChange => (typeaheadState)`:

This method is called when the typeahead's *visibility*, *position*, or *text* changes. `typeaheadState` is an object with `left`, `top`, `text`, and `selectedIndex` properties. A typical callback sets `typeaheadState` on its own state and uses it to render an overlay in its component's `render` method. This method is also called when the typeahead is hidden by passing `null` to `typeaheadState`.

`handleTypeaheadReturn => (text, selectedIndex, selection)`:

This method is called when an item in the typeahead is selected (by hitting return). A typical callback autocompletes the editor with the selected item and tags it with a draft entity.

*Note:* By default draft-js-typeahead does not filter items in the typeahead based on the entered text, [see the mentions example for one approach to filtering](/mentions).


## License

MIT © [Justin Vaillancourt](justin@dooly.ai)


[npm-image]: https://badge.fury.io/js/draft-js-typeahead.svg
[npm-url]: https://npmjs.org/package/draft-js-typeahead
