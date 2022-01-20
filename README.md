# vue-spotlight

Key activable spotlight for Vue.js (initially built for Slidev)

## Installation

```bash
npm i vue-spotlight
```

## Usage

```vue
<Spotlight/>
```

Then maintain the <kbd>Alt</kbd> key pressed and the spotlight should appear.

## Parameters

* `activationKey` (type: `string`, default: `'Alt'`): The key to hold down to activate the spotlight
* `color` (type: `string`, default: `'black'`): CSS color of the spotlight shadow
* `opacity` (type: `number | string`, default: `0.75`): Opacity of the spotlight shadow
* `size` (type: `string`, default: `100px`): Size of the spotlight
* `transitionDuration` (type: `string`, default: `200ms`): CSS transition durations
