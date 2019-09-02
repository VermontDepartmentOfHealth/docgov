// on form load, set radio and body (immediately after body opening tag)
function setDisplayDensity(val) {
    var displayCard = val === "card"
    document.body.classList.toggle("display-card", displayCard)
    document.body.classList.toggle("display-list", !displayCard)
}

// get stored value or default
var displayVal = localStorage.getItem('display-toggle') || "card"

// immediately set style to prevent FOUC
setDisplayDensity(displayVal)


// wait for the dom load to parse remaining elements
document.addEventListener("DOMContentLoaded", function(){

    // set appropriate state on checkboxes once they've loaded
    var displayEl = document.querySelector("input[type='radio'][name='display-toggle'][value='" + displayVal + "']")
    displayEl.checked = true


    // on change, set body class and local storage (after dom loaded)
	document.querySelectorAll("input[type='radio'][name='display-toggle']").forEach(function(el) {
        el.addEventListener("change",function(e) {
            var curDisplayVal = e.target.value
            setDisplayDensity(curDisplayVal)
            localStorage.setItem('display-toggle', curDisplayVal)
        });
    });
});
