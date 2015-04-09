## Javascript multi-touch library (scale, rotate, drag) for mobile

Demo (on mobile only): http://andrusasumets.github.io/much/

USAGE:

```js
var options = {
    element: document.getElementById('id'),
    currentScale: 0.5,
    minScale: 0.1,
    maxScale: 10,
    easing: 0.8,
    callback: function(settings) {
        //returns settings object for the element 60 frames per second
    }
}

much.add(options);
```

```js
much.data() // returns settings objects for all of the elements in an array
```

```js
much.remove(document.getElementById('id'))
```

```js
much.stop();
```

Author: Hans Eklund, North Kingdom

Modified, improved and packaged into a JavaScript library by Andrus Asumets.
