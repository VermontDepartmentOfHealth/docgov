let NavigatePrev = function() {
    let prev = document.querySelector(".pagination-item.prev")
    if (prev) {prev.click()}
}
let NavigateNext = function() {
    let next = document.querySelector(".pagination-item.next")
    if (next) {next.click()}
}

// can't attach to body (it will be removed)
document.addEventListener("keydown", function(event) {
    if (event.code === "ArrowLeft") {
        NavigatePrev()
    } else if (event.code === "ArrowRight") {
        NavigateNext()
    }
})

if (document.querySelector(".typed-text")) {
    var options = {
        strings: ['Fast', 'Awesome', 'Secure', 'Simple', 'Serverless', 'Amazing', 'Deployable'],
        typeSpeed: 90,
        backDelay: 1400,
        loop: true
    };
    
    var typed = new Typed('.typed-text', options);
}