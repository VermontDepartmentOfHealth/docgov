document.querySelectorAll("body [title]").forEach(function(el) {
    el.setAttribute('data-tooltip', el.title)
    el.setAttribute('aria-label', el.title)
    el.setAttribute('tabindex', 0)
    el.classList.add("tooltip")
    el.title = ""
  });