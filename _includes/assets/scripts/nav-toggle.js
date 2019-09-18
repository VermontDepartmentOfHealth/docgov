document.body.addEventListener('click', function(e) {
    // check if we clicked on a nav toggle, then do our stuff
    if (e.target.matches(".nav-toggle, .nav-toggle *")) {
        e.preventDefault();
        toggleNav();
        
    } else if (!document.body.classList.contains('nav-closed') &&
               !e.target.matches(".sidenav, .sidenav *")) {
        // if the nav bar is open, and we clicked off it, toggle (close)
        toggleNav();
    }
});

function toggleNav() {
    var isOpen = !document.body.classList.contains('nav-closed')

    // set nav state on body
    document.body.classList.toggle('nav-closed', isOpen);

    // update aria attributes
    document.querySelectorAll(".nav-toggle").forEach(function(el) {
        el.setAttribute('aria-expanded', !isOpen)
    })
}


document.addEventListener('touchstart', handleTouchStart, false);        
document.addEventListener('touchend', handleTouchEnd, false);

// declare variables in parent scope
var xDown = null;                                                        
var yDown = null;  

function handleTouchStart(evt) {                                         
    xDown = evt.touches[0].clientX;                                      
    yDown = evt.touches[0].clientY;                                      
}; 

function handleTouchEnd(evt) {
    if ( ! xDown || ! yDown ) {
        return;
    }
    var xUp = evt.changedTouches[0].clientX;
    var yUp = evt.changedTouches[0].clientY;
    var xDiff = xDown - xUp;
    var yDiff = yDown - yUp;

	// we moved more x than y and moved at least 20px x
    if ( Math.abs( xDiff ) > Math.abs( yDiff ) && Math.abs( xDiff ) > 40 ) {
        if ( xDiff < 0 ) {
            // right swipe
            // if nav closed and started on left half, open
            var isOpen = !document.body.classList.contains('nav-closed')
            if (!isOpen) {
                toggleNav()
            }
        } else {
            // left swipe 
            // if nav open, close
            console.log("left", xDiff)
            toggleNav()
        }                       
    }

    // reset values
    xDown = null;
    yDown = null;                                             
};