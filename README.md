# spotlight-vue

[![NPM version](https://img.shields.io/npm/v/spotlight-vue?color=3AB9D4&label=)](https://www.npmjs.com/package/spotlight-vue)

Key activable spotlight for `Vue.js` (initially built for Slidev)

![Spotlight demo](./assets/spotlight.gif)

## Installation

```bash
npm i spotlight-vue
```

## Usage

Import with:
```js
import Spotlight from 'spotlight-vue';
// Also import styles
import 'spotlight-vue/dist/style.css';
```

Register the plugin:
```js
Vue.use(Spotlight);
```

Use it in your `Vue.js` app with:
```vue
<spotlight/>
```

In your app, maintain the <kbd>Shift</kbd> key pressed and the spotlight should appear.

## Parameters

* `activationKey` (type: `string`, default: `'Shift'`): The key to hold down to activate the spotlight
* `active` (type; `boolean`): Activate manually the spotlight
* `color` (type: `string`, default: `'black'`): CSS color of the spotlight shadow
* `opacity` (type: `number | string`, default: `0.75`): Opacity of the spotlight shadow
* `size` (type: `string`, default: `100px`): Size of the spotlight
* `transitionDuration` (type: `string`, default: `200ms`): CSS transition durations
* `x` (type; `number`): Set manually the spotlight X position
* `y` (type; `number`): Set manually the spotlight Y position

## Events

* `activate`: Fired when component is activated
* `deactivate`: Fired when component is deactivated
* `update`: Fired when component is active and position is updated

All three events also send a position object with the following shape:

* `x` (type: `number`): X position in percentage of the container
* `y` (type: `number`): Y position in percentage of the container
