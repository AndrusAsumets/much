## Multitouch library (scale, rotate, drag) for HTML5.

Usage:

HTML/CSS: http://codepen.io/hanseklund/pen/izloq

JS: 

```js
var options = {  
    element: document.getElementById('id'),  
    currentScale: 0.5,  
    minScale: 0.1,  
    maxScale: 10,  
    callback: function(settings) {  
        //to something with it  
    }  
}  

much.start(options);
```

```js
much.remove(document.getElementById('id'))
```

```js
much.stop();
```

Author: Hans Eklund, North Kingdom

Modified, improved and packaged into a JavaScript library by Andrus Asumets