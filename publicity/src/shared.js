(function () {
  const p = new URLSearchParams(location.search);
  window.P = (k, d) => (p.has(k) ? p.get(k) : d);
  // Circular seal: gold ring with text running round it and the church emblem in the middle.
  window.seal = function (size, text, dark) {
    const col = dark ? "#5B0B13" : "#D9A93B", face = dark ? "#D9A93B" : "#5B0B13";
    const t = (text || "LIVE IN LINCOLN · VIEWING CENTRE · SHILOH 2026 · ").repeat(1);
    return `<svg viewBox="0 0 200 200" width="${size}" height="${size}" style="display:block">
      <circle cx="100" cy="100" r="98" fill="${face}" stroke="${col}" stroke-width="3"/>
      <circle cx="100" cy="100" r="78" fill="none" stroke="${col}" stroke-width="1.5" stroke-dasharray="2 3"/>
      <defs><path id="sp" d="M100,100 m-88,0 a88,88 0 1,1 176,0 a88,88 0 1,1 -176,0"/><clipPath id="cp"><circle cx="100" cy="100" r="46"/></clipPath></defs>
      <text font-family="Barlow Condensed" font-weight="800" font-size="17.5" letter-spacing="2.6" fill="${col}"><textPath href="#sp">${t}</textPath></text>
      <circle cx="100" cy="100" r="50" fill="#fff"/>
      <image href="logo.png" x="54" y="54" width="92" height="92" clip-path="url(#cp)"/>
    </svg>`;
  };
  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-seal]").forEach(el => { el.innerHTML = seal(+el.dataset.seal, el.dataset.text, el.hasAttribute("data-dark")); });
    document.querySelectorAll("[data-fill]").forEach(el => { el.textContent = window.P(el.dataset.fill, el.textContent); });
  });
})();
