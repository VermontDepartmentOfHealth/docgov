// add scroll spy
var spy = new Gumshoe('.toc a');

// add smooth scroll to fragment ids
if (document.body.scrollIntoView) {
    document.body.addEventListener('click',function(e) {
        if (e.target.tagName === "A" && e.target.attributes.href.value.slice(0,1)) {
            e.preventDefault();
            var id = e.target.attributes.href.value.slice(1)
            var el = document.getElementById(id)
            el.scrollIntoView({behavior: "smooth"})
        }
    })
}