

(function() {
    var resourceCache = {};
    var loading = [];
    var readyCallbacks = [];

    var resourcePixelData = {};

    // Load an image url or an array of image urls
    function load(urlOrArr) {
        if(urlOrArr instanceof Array) {
            urlOrArr.forEach(function(url) {
                _load(url);
            });
        }
        else {
            _load(urlOrArr);
        }
    }

    function _load(url) {
        if(resourceCache[url]) {
            return resourceCache[url];
        }
        else {
            var img = new Image();
            img.onload = function() {
                resourceCache[url] = img;

                //MAKE IT USEFULL!
                var px = getPixel(img);
                resourcePixelData[url] = px;
                
                if(isReady()) {
                    readyCallbacks.forEach(function(func) { func(); });
                }
            };
			//img.crossOrigin = "anonymous";
			
            resourceCache[url] = false;
            img.src = url;
        }
    }

    //???
    function getPixel(img, x=0, y=0) {
        var canvas2 = document.createElement('canvas');
        canvas2.width = img.width;
        canvas2.height = img.height;
        var context = canvas2.getContext('2d');
        context.drawImage(img, 0, 0, img.width, img.height);
        return context.getImageData(x, y, img.width, img.height).data;
    }

    function get(url) {
        return resourceCache[url];
    }

    function isReady() {
        var ready = true;
        for(var k in resourceCache) {
            if(resourceCache.hasOwnProperty(k) &&
               !resourceCache[k]) {
                ready = false;
            }
        }
        return ready;
    }

    function onReady(func) {
        readyCallbacks.push(func);
    }

    window.resources = { 
        load: load,
        get: get,
        onReady: onReady,
        isReady: isReady
    };
})();