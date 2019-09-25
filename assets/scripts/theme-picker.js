// on form load, set radio and body (immediately after body opening tag)
function setTheme(val) {
    // remove all themes 
    document.body.className = document.body.className.split(" ").filter(function(c) { return !c.startsWith("theme-")}).join(" "); 
    // set current theme
    document.body.classList.add("theme-" + val)
}

// get stored value or default
var displayVal = localStorage.getItem('theme-color') || "ocean"

// immediately set style to prevent FOUC
setTheme(displayVal)


// wait for the dom load to parse remaining elements
document.addEventListener("DOMContentLoaded", function(){

    // set appropriate state on checkboxes once they've loaded
    var displayEl = document.querySelector("input[type='radio'][name='theme'][value='" + displayVal + "']")
    if (displayEl) { displayEl.checked = true}


    // on change, set body class and local storage (after dom loaded)
	document.querySelectorAll("input[type='radio'][name='theme']").forEach(function(el) {
        el.addEventListener("change",function(e) {
            var curDisplayVal = e.target.value
            setTheme(curDisplayVal)
            localStorage.setItem('theme-color', curDisplayVal)
        });
    });
});
