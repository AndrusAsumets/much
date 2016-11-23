(function() {
    var width = 400;
    var height = 400;
    var body = document.getElementsByTagName('body')[0];

    var div = document.createElement('div');
    div.id = 'div';
    div.innerHTML = 'Click. Drag. Pinch. Rotate. Click...';

    body.appendChild(div);
    div.addEventListener('click', drawImage);

    function drawImage(event) {
        var id = String(Math.random()).split('.')[1];
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext("2d");

        canvas.id = id;
        canvas.width = width;
        canvas.height = height;
        canvas.className = 'canvas';
        canvas.style.left = event.clientX - (width / 2) + 'px';
        canvas.style.top = event.clientY - (height / 2) + 'px';

        // draw sample image
        ctx.beginPath();
        ctx.lineWidth = width / 30;
        for (var i = -height; i < width; i+=width/10) {
          ctx.moveTo(i, 0);
          ctx.lineTo(i+height, height);
        }
        ctx.stroke();

        div.appendChild(canvas);

        var options = {
            element: canvas,
            currentScale: 0.5,
            minScale: 0.1,
            maxScale: 5,
            easing: 0.8
        }

        much.add(options);
    }

    var GitHub = document.createElement('GitHub');
    GitHub.id = 'GitHub';
    body.appendChild(GitHub);
    GitHub.addEventListener('click', openGitHub);

    function openGitHub() {
        window.open('https://github.com/AndrusAsumets/much','_top')
    }
})();
