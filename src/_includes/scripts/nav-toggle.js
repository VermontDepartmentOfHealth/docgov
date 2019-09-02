document.body.addEventListener('click', function(e) {
        
    // check if we clicked on a nav toggle, then do our stuff
    if (e.target.matches(".nav-toggle, .nav-toggle > *")) {
        e.preventDefault();

        var isOpen = !document.body.classList.contains('nav-closed')

        // set nav state on body
        document.body.classList.toggle('nav-closed', isOpen);

        // update aria attributes
        document.querySelectorAll(".nav-toggle").forEach(function(el) {
            el.setAttribute('aria-expanded', !isOpen)
        })
    }
});