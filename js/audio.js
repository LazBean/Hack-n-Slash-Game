

(function() {
    var volume = 0.1;

    window.audio = {
        play: function(clip, v = 1) {
            var a = new Audio(clip);
			a.volume = volume * v;
			a.play();
        }
    };
})();


