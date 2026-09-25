(function () {
  // Carry ad attribution (UTM / fbclid) into the signup form
  var params = new URLSearchParams(location.search);
  var keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid'];
  var stored = {};
  try { stored = JSON.parse(sessionStorage.getItem('nereus_attr') || '{}'); } catch (e) {}
  keys.forEach(function (k) { if (params.get(k)) stored[k] = params.get(k); });
  try { sessionStorage.setItem('nereus_attr', JSON.stringify(stored)); } catch (e) {}
  keys.forEach(function (k) {
    var input = document.querySelector('input[name="' + k + '"]');
    if (input && stored[k]) input.value = stored[k];
  });

  // Sticky mobile CTA: show after the hero CTA scrolls away, hide once the form is on screen
  var bar = document.querySelector('[data-sticky-cta]');
  var hero = document.getElementById('hero-cta');
  var join = document.getElementById('join');
  if (bar && hero && join && 'IntersectionObserver' in window) {
    var heroVisible = true, joinVisible = false;
    var update = function () {
      var show = !heroVisible && !joinVisible;
      bar.classList.toggle('is-visible', show);
      bar.setAttribute('aria-hidden', show ? 'false' : 'true');
      bar.querySelector('a').tabIndex = show ? 0 : -1;
    };
    new IntersectionObserver(function (e) { heroVisible = e[0].isIntersecting || e[0].boundingClientRect.top > 0; update(); }).observe(hero);
    new IntersectionObserver(function (e) { joinVisible = e[0].isIntersecting; update(); }).observe(join);
  }

  var year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();
})();
