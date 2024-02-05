(function() {
    var volume = 0.1;
    var isUserInteracted = false;

    document.addEventListener('click', function() {
        isUserInteracted = true;
    });

    window.audio = {
        play: function(clip, v = 1) {
            var a = new Audio(clip);
            a.volume = volume * v;
            
            var playPromise = a.play();

            if (playPromise !== undefined) {
                playPromise.then(_ => {
                    
                }).catch(error => {
                    if (!isUserInteracted) {
                        console.log("Audio Playback is blocked until user interaction");
                        
                    } else {
                        console.error("Audio play error:", error);
                    }
                });
            }
        }
    };
})();
