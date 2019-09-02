document.body.addEventListener('click', function(e) {
        
    var toggleNav = function() {
        var isOpen = !document.body.classList.contains('nav-closed')

        // set nav state on body
        document.body.classList.toggle('nav-closed', isOpen);

        // update aria attributes
        document.querySelectorAll(".nav-toggle").forEach(function(el) {
            el.setAttribute('aria-expanded', !isOpen)
        })
    }
    // check if we clicked on a nav toggle, then do our stuff
    if (e.target.matches(".nav-toggle, .nav-toggle *")) {
        e.preventDefault();
        toggleNav();
        
    } else if (!document.body.classList.contains('nav-closed') && !e.target.matches(".sidenav, .sidenav *")) {
        // if the nav bar is open, and we clicked off it, toggle (close)
        toggleNav();
    }
});