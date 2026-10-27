/* ==========================================================================
   Shared helpers for lesson pages.
   Include after the page content:  <script src="../assets/lesson.js"></script>
   Provides window.HN with:
     HN.Plot      canvas plot with axes, curves, arrows, dragging, contour fields
     HN.eig2      eigen-decomposition of a symmetric 2×2 matrix
     HN.jacobi    eigen-decomposition of a symmetric n×n matrix
     HN.setTex    render a LaTeX string into an element (MathJax)
     HN.fmt       number formatting with a true minus sign
     HN.range     bind a range slider to a readout
   It also wires every .quiz and every .try-block on the page automatically.
   ========================================================================== */
(function () {
  "use strict";
  const HN = (window.HN = {});
  const root = document.documentElement;

  HN.reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  HN.css = (n) => getComputedStyle(root).getPropertyValue(n).trim();

  /* ---------- numbers ---------- */
  HN.fmt = (v, d = 2) => {
    if (!isFinite(v)) return "—";
    let s = Number(v).toFixed(d);
    if (/^-0(\.0*)?$/.test(s)) s = s.slice(1);
    return s.replace("-", "−");
  };
  HN.trim = (v, d = 3) => {
    let r = parseFloat(Number(v).toFixed(d));
    if (Object.is(r, -0)) r = 0;
    return String(r).replace("-", "−");
  };
  HN.tex = (v, d = 2) => {
    let r = parseFloat(Number(v).toFixed(d));
    if (Object.is(r, -0)) r = 0;
    return String(r);
  };
  HN.texf = (v, d = 2) => { let s = Number(v).toFixed(d); if (/^-0(\.0*)?$/.test(s)) s = s.slice(1); return s; };

  /* ---------- MathJax ---------- */
  HN.typeset = (el) => {
    const MJ = window.MathJax;
    if (MJ && MJ.typesetPromise) { MJ.typesetClear([el]); MJ.typesetPromise([el]).catch(() => {}); }
  };
  HN.setTex = (el, s) => {
    if (!el || el._tex === s) return;
    el._tex = s; el.innerHTML = s; HN.typeset(el);
  };

  /* ---------- theme changes ---------- */
  const themeCbs = [];
  HN.onTheme = (cb) => themeCbs.push(cb);
  const fireTheme = () => themeCbs.forEach((cb) => cb());
  new MutationObserver(fireTheme).observe(root, { attributes: true, attributeFilter: ["data-theme"] });
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", fireTheme);

  const hex = (h) => {
    h = (h || "#888").trim().replace("#", "");
    if (h.length === 3) h = h.split("").map((c) => c + c).join("");
    return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
  };
  HN.rgb = (n) => hex(HN.css(n));

  /* ---------- linear algebra ---------- */
  // symmetric [[a,b],[b,c]] -> { l:[l1<=l2], v:[[x,y],[x,y]] } (unit eigenvectors)
  HN.eig2 = (a, b, c) => {
    const tr = a + c, d = Math.sqrt(((a - c) / 2) ** 2 + b * b);
    const l1 = tr / 2 - d, l2 = tr / 2 + d;
    let v1;
    if (Math.abs(b) > 1e-12) v1 = [b, l1 - a];
    else v1 = a <= c ? [1, 0] : [0, 1];
    const n = Math.hypot(v1[0], v1[1]); v1 = [v1[0] / n, v1[1] / n];
    return { l: [l1, l2], v: [v1, [-v1[1], v1[0]]] };
  };
  // cyclic Jacobi for symmetric n×n; returns eigenvalues ascending with eigenvector columns
  HN.jacobi = (A0) => {
    const n = A0.length, A = A0.map((r) => r.slice()), V = A0.map((_, i) => A0.map((__, j) => (i === j ? 1 : 0)));
    for (let sweep = 0; sweep < 100; sweep++) {
      let off = 0;
      for (let p = 0; p < n; p++) for (let q = p + 1; q < n; q++) off += A[p][q] * A[p][q];
      if (off < 1e-22) break;
      for (let p = 0; p < n; p++) for (let q = p + 1; q < n; q++) {
        if (Math.abs(A[p][q]) < 1e-300) continue;
        const th = (A[q][q] - A[p][p]) / (2 * A[p][q]);
        const t = Math.sign(th || 1) / (Math.abs(th) + Math.sqrt(th * th + 1));
        const c = 1 / Math.sqrt(t * t + 1), s = t * c;
        for (let k = 0; k < n; k++) { const akp = A[k][p], akq = A[k][q]; A[k][p] = c * akp - s * akq; A[k][q] = s * akp + c * akq; }
        for (let k = 0; k < n; k++) { const apk = A[p][k], aqk = A[q][k]; A[p][k] = c * apk - s * aqk; A[q][k] = s * apk + c * aqk; }
        for (let k = 0; k < n; k++) { const vkp = V[k][p], vkq = V[k][q]; V[k][p] = c * vkp - s * vkq; V[k][q] = s * vkp + c * vkq; }
      }
    }
    const idx = [...Array(n).keys()].sort((i, j) => A[i][i] - A[j][j]);
    return { l: idx.map((i) => A[i][i]), v: idx.map((i) => V.map((r) => r[i])) };
  };

  /* ---------- range sliders ---------- */
  HN.range = (id, onChange, show) => {
    const el = document.getElementById(id), out = document.getElementById(id + "-v");
    const f = () => { const v = parseFloat(el.value); if (out) out.textContent = show ? show(v) : HN.fmt(v, 2); onChange && onChange(v); };
    el.addEventListener("input", f);
    return { el, get: () => parseFloat(el.value), set: (v) => { el.value = v; f(); }, fire: f };
  };
  HN.seg = (groupEl, onChange) => {
    const btns = groupEl.querySelectorAll("button");
    btns.forEach((b) => b.addEventListener("click", () => {
      btns.forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      onChange(b.dataset.v);
    }));
  };

  /* ==========================================================================
     Plot: a canvas with a data frame.
       opts: xr, yr, aspect, pad {l,r,t,b}, xlabel, ylabel, xticks, yticks,
             equal (keeps 1:1 scale), field (f(x,y) for a contour map),
             fieldOpts {mode:"seq"|"div", transform:"sqrt"|"lin", step, min, max}
     ========================================================================== */
  const niceStep = (span, target) => {
    const raw = span / target, p = Math.pow(10, Math.floor(Math.log10(raw))), m = raw / p;
    return (m < 1.5 ? 1 : m < 3.5 ? 2 : m < 7.5 ? 5 : 10) * p;
  };

  class Plot {
    constructor(canvas, o) {
      this.c = canvas; this.ctx = canvas.getContext("2d");
      this.o = Object.assign({ aspect: 0.62, pad: { l: 46, r: 14, t: 14, b: 38 }, grid: true, axes: true }, o);
      this.draw = o.draw || (() => {});
      this.fieldCache = null;
      this._ro = new ResizeObserver(() => this.resize());
      this._ro.observe(canvas);
      HN.onTheme(() => { this.fieldCache = null; this.render(); });
      this.resize();
    }
    resize() {
      const w = this.c.clientWidth; if (!w) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.dpr = dpr; this.W = Math.round(w * dpr); this.H = Math.round(w * this.o.aspect * dpr);
      this.c.width = this.W; this.c.height = this.H; this.c.style.height = w * this.o.aspect + "px";
      const p = this.o.pad; this.L = p.l * dpr; this.R = this.W - p.r * dpr; this.T = p.t * dpr; this.B = this.H - p.b * dpr;
      if (this.o.equal) {   // keep 1 unit in x = 1 unit in y, centred on the requested y range
        if (this._yc == null) this._yc = (this.o.yr[0] + this.o.yr[1]) / 2;
        const span = (this.B - this.T) / ((this.R - this.L) / (this.o.xr[1] - this.o.xr[0]));
        this.o.yr = [this._yc - span / 2, this._yc + span / 2];
      }
      this.fieldCache = null; this.render();
    }
    X(x) { const [a, b] = this.o.xr; return this.L + ((x - a) / (b - a)) * (this.R - this.L); }
    Y(y) { const [a, b] = this.o.yr; return this.B - ((y - a) / (b - a)) * (this.B - this.T); }
    ix(px) { const [a, b] = this.o.xr; return a + ((px - this.L) / (this.R - this.L)) * (b - a); }
    iy(py) { const [a, b] = this.o.yr; return a + ((this.B - py) / (this.B - this.T)) * (b - a); }
    sx() { return (this.R - this.L) / (this.o.xr[1] - this.o.xr[0]); }   // px per unit x
    sy() { return (this.B - this.T) / (this.o.yr[1] - this.o.yr[0]); }   // px per unit y
    setRange(xr, yr) { if (xr) this.o.xr = xr; if (yr) this.o.yr = yr; this.fieldCache = null; }
    invalidate() { this.fieldCache = null; }
    font(px, w = 500) { return `${w} ${px * this.dpr}px "IBM Plex Mono", ui-monospace, Menlo, monospace`; }

    render() {
      if (!this.W) return;
      const g = this.ctx;
      g.setTransform(1, 0, 0, 1, 0, 0);
      g.fillStyle = HN.css("--sheet"); g.fillRect(0, 0, this.W, this.H);
      if (this.o.field) this.drawField();
      if (this.o.axes) this.drawAxes();
      g.save(); g.beginPath(); g.rect(this.L, this.T, this.R - this.L, this.B - this.T); g.clip();
      this.draw(this, g);
      g.restore();
      if (this.o.after) this.o.after(this, g);
    }

    drawField() {
      const g = this.ctx;
      if (!this.fieldCache) {
        const w = Math.max(1, Math.round(this.R - this.L)), h = Math.max(1, Math.round(this.B - this.T));
        const off = document.createElement("canvas"); off.width = w; off.height = h;
        const oc = off.getContext("2d"), img = oc.createImageData(w, h);
        const fo = Object.assign({ mode: "seq", transform: "sqrt", step: 0.1 }, this.o.fieldOpts || {});
        const f = this.o.field, vals = new Float64Array(w * h);
        let vmin = Infinity, vmax = -Infinity;
        for (let j = 0; j < h; j++) { const y = this.iy(this.T + j + 0.5); for (let i = 0; i < w; i++) { const v = f(this.ix(this.L + i + 0.5), y); vals[j * w + i] = v; if (v < vmin) vmin = v; if (v > vmax) vmax = v; } }
        if (fo.min != null) vmin = fo.min; if (fo.max != null) vmax = fo.max;
        const sheet = HN.rgb("--sheet"), acc = HN.rgb("--accent"), mark = HN.rgb("--mark"), line = HN.rgb("--ink-3");
        const dark = window.hnIsDark ? window.hnIsDark() : false;
        const band = new Int32Array(w * h), tval = new Float32Array(w * h);
        for (let k = 0; k < w * h; k++) {
          const v = vals[k];
          if (fo.mode === "div") {
            const m = Math.max(Math.abs(vmin), Math.abs(vmax)) || 1;
            const t = Math.max(-1, Math.min(1, v / m));
            tval[k] = t; band[k] = Math.floor(v / fo.step);
          } else {
            const span = Math.max(1e-12, vmax - vmin), u = Math.min(span, Math.max(0, v - vmin));
            const tt = fo.transform === "sqrt" ? Math.sqrt(u / span) : u / span;
            tval[k] = Math.min(1, tt);
            band[k] = Math.floor((fo.transform === "sqrt" ? Math.sqrt(u) : u) / fo.step);
          }
        }
        const base = dark ? 0.5 : 0.38, lm = dark ? 0.42 : 0.34;
        for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
          const k = j * w + i, t = tval[k];
          let col, a;
          if (fo.mode === "div") { col = t < 0 ? mark : acc; a = base * Math.pow(Math.abs(t), 0.7); }
          else { col = acc; a = base * (1 - Math.pow(t, 0.8)); }
          let r = sheet[0] * (1 - a) + col[0] * a, gg = sheet[1] * (1 - a) + col[1] * a, b = sheet[2] * (1 - a) + col[2] * a;
          const n = band[k];
          if ((i + 1 < w && band[k + 1] !== n) || (j + 1 < h && band[k + w] !== n)) { r = r * (1 - lm) + line[0] * lm; gg = gg * (1 - lm) + line[1] * lm; b = b * (1 - lm) + line[2] * lm; }
          const o = k * 4; img.data[o] = r; img.data[o + 1] = gg; img.data[o + 2] = b; img.data[o + 3] = 255;
        }
        oc.putImageData(img, 0, 0);
        this.fieldCache = off;
      }
      this.ctx.drawImage(this.fieldCache, Math.round(this.L), Math.round(this.T));
    }

    drawAxes() {
      const g = this.ctx, o = this.o, d = this.dpr;
      const rule = HN.css("--rule"), ink3 = HN.css("--ink-3");
      const xs = o.xticks || niceStep(o.xr[1] - o.xr[0], 6), ys = o.yticks || niceStep(o.yr[1] - o.yr[0], 5);
      g.lineWidth = 1 * d; g.strokeStyle = rule; g.fillStyle = ink3; g.font = this.font(10.5, 400);
      g.textAlign = "center"; g.textBaseline = "top";
      const fmtT = (v, s) => HN.trim(v, s < 0.01 ? 4 : s < 0.1 ? 3 : s < 1 ? 2 : 0);
      for (let x = Math.ceil(o.xr[0] / xs) * xs; x <= o.xr[1] + 1e-9; x += xs) {
        const px = Math.round(this.X(x)) + 0.5;
        if (o.grid && !o.field) { g.beginPath(); g.moveTo(px, this.T); g.lineTo(px, this.B); g.stroke(); }
        g.fillText(fmtT(x, xs), px, this.B + 6 * d);
      }
      g.textAlign = "right"; g.textBaseline = "middle";
      for (let y = Math.ceil(o.yr[0] / ys) * ys; y <= o.yr[1] + 1e-9; y += ys) {
        const py = Math.round(this.Y(y)) + 0.5;
        if (o.grid && !o.field) { g.beginPath(); g.moveTo(this.L, py); g.lineTo(this.R, py); g.stroke(); }
        g.fillText(fmtT(y, ys), this.L - 6 * d, py);
      }
      g.strokeStyle = ink3; g.lineWidth = 1.2 * d;
      g.strokeRect(this.L + 0.5, this.T + 0.5, this.R - this.L - 1, this.B - this.T - 1);
      if (!o.field) {
        if (o.yr[0] < 0 && o.yr[1] > 0) { g.beginPath(); g.moveTo(this.L, this.Y(0)); g.lineTo(this.R, this.Y(0)); g.stroke(); }
        if (o.xr[0] < 0 && o.xr[1] > 0) { g.beginPath(); g.moveTo(this.X(0), this.T); g.lineTo(this.X(0), this.B); g.stroke(); }
      }
      g.fillStyle = ink3; g.font = this.font(11, 500);
      if (o.xlabel) { g.textAlign = "right"; g.textBaseline = "bottom"; g.fillText(o.xlabel, this.R, this.H - 2 * d); }
      if (o.ylabel) { g.save(); g.translate(12 * d, this.T); g.rotate(-Math.PI / 2); g.textAlign = "right"; g.textBaseline = "middle"; g.fillText(o.ylabel, 0, 0); g.restore(); }
    }

    /* drawing primitives in data coordinates */
    curve(f, color, w = 2.2, dash, x0, x1) {
      const g = this.ctx, a = x0 ?? this.o.xr[0], b = x1 ?? this.o.xr[1], n = Math.max(2, Math.round(Math.abs(this.X(b) - this.X(a)) / (2 * this.dpr)));
      g.strokeStyle = color; g.lineWidth = w * this.dpr; g.setLineDash(dash ? dash.map((v) => v * this.dpr) : []);
      g.beginPath(); let started = false;
      for (let i = 0; i <= n; i++) {
        const x = a + ((b - a) * i) / n, y = f(x);
        if (!isFinite(y)) { started = false; continue; }
        const py = Math.max(-1e4, Math.min(1e4, this.Y(y)));
        started ? g.lineTo(this.X(x), py) : (g.moveTo(this.X(x), py), started = true);
      }
      g.stroke(); g.setLineDash([]);
    }
    path(pts, color, w = 2, dash) {
      const g = this.ctx; g.strokeStyle = color; g.lineWidth = w * this.dpr; g.setLineDash(dash ? dash.map((v) => v * this.dpr) : []);
      g.beginPath(); pts.forEach(([x, y], i) => (i ? g.lineTo(this.X(x), this.Y(y)) : g.moveTo(this.X(x), this.Y(y)))); g.stroke(); g.setLineDash([]);
    }
    seg(x0, y0, x1, y1, color, w = 1.5, dash) { this.path([[x0, y0], [x1, y1]], color, w, dash); }
    dot(x, y, color, r = 5, ring) {
      const g = this.ctx; g.beginPath(); g.arc(this.X(x), this.Y(y), r * this.dpr, 0, 2 * Math.PI);
      if (ring) { g.strokeStyle = color; g.lineWidth = 2 * this.dpr; g.stroke(); } else { g.fillStyle = color; g.fill(); }
    }
    text(s, x, y, color, opts = {}) {
      const g = this.ctx; g.fillStyle = color || HN.css("--ink"); g.font = this.font(opts.size || 12, opts.weight || 500);
      g.textAlign = opts.align || "left"; g.textBaseline = opts.base || "middle";
      g.fillText(s, this.X(x) + (opts.dx || 0) * this.dpr, this.Y(y) + (opts.dy || 0) * this.dpr);
    }
    // arrow between two data points
    arrow(x0, y0, x1, y1, color, w = 2.4) { this.arrowPx(this.X(x0), this.Y(y0), this.X(x1), this.Y(y1), color, w); }
    arrowPx(px0, py0, px1, py1, color, w = 2.4) {
      const g = this.ctx, d = this.dpr, L = Math.hypot(px1 - px0, py1 - py0); if (L < 1) return;
      const ang = Math.atan2(py1 - py0, px1 - px0), h = Math.min(11 * d, L * 0.45);
      g.strokeStyle = color; g.fillStyle = color; g.lineWidth = w * d;
      g.beginPath(); g.moveTo(px0, py0); g.lineTo(px1 - Math.cos(ang) * h * 0.6, py1 - Math.sin(ang) * h * 0.6); g.stroke();
      g.beginPath(); g.moveTo(px1, py1);
      g.lineTo(px1 - h * Math.cos(ang - 0.42), py1 - h * Math.sin(ang - 0.42));
      g.lineTo(px1 - h * Math.cos(ang + 0.42), py1 - h * Math.sin(ang + 0.42)); g.closePath(); g.fill();
    }
    // arrow from a data point along a data-space direction, length in css px
    arrowDir(x, y, dx, dy, lenPx, color, w) {
      const vx = dx * this.sx(), vy = -dy * this.sy(), n = Math.hypot(vx, vy); if (n < 1e-12) return;
      const L = lenPx * this.dpr;
      this.arrowPx(this.X(x), this.Y(y), this.X(x) + (vx / n) * L, this.Y(y) + (vy / n) * L, color, w);
    }
    // pointer dragging: cb(x, y, phase) with phase "down" | "move" | "up"
    drag(cb) {
      const c = this.c; c.style.touchAction = "none"; c.style.cursor = "crosshair";
      let on = false;
      const pos = (e) => { const r = c.getBoundingClientRect(); const px = (e.clientX - r.left) * this.dpr, py = (e.clientY - r.top) * this.dpr; return [this.ix(px), this.iy(py)]; };
      c.addEventListener("pointerdown", (e) => { on = true; c.setPointerCapture(e.pointerId); const [x, y] = pos(e); cb(x, y, "down"); });
      c.addEventListener("pointermove", (e) => { if (!on) return; const [x, y] = pos(e); cb(x, y, "move"); });
      const up = () => { if (on) { on = false; cb(null, null, "up"); } };
      c.addEventListener("pointerup", up); c.addEventListener("pointercancel", up);
    }
  }
  HN.Plot = Plot;

  /* ---------- animation loop that pauses off-screen ---------- */
  HN.loop = (canvas, step) => {
    if (HN.reduce) return { start() {}, stop() {} };
    let raf = 0, visible = true, running = false, t0 = performance.now();
    const io = new IntersectionObserver((es) => { visible = es[0].isIntersecting; if (visible && running && !raf) raf = requestAnimationFrame(tick); });
    io.observe(canvas);
    function tick(now) { raf = 0; if (!running || !visible) return; step((now - t0) / 1000); raf = requestAnimationFrame(tick); }
    return {
      start() { if (running) return; running = true; t0 = performance.now(); raf = requestAnimationFrame(tick); },
      stop() { running = false; if (raf) cancelAnimationFrame(raf); raf = 0; },
    };
  };

  /* ---------- quizzes ---------- */
  document.querySelectorAll(".quiz").forEach((q) => {
    const answer = +q.dataset.answer, fbEl = q.querySelector(".feedback"), fb = JSON.parse(fbEl.dataset.fb);
    const opts = q.querySelectorAll(".options button");
    opts.forEach((b, i) => b.addEventListener("click", () => {
      opts.forEach((o) => o.classList.remove("right", "wrong"));
      if (i === answer) b.classList.add("right"); else if (i !== opts.length - 1) b.classList.add("wrong");
      fbEl.textContent = fb[i];
    }));
  });

  /* ---------- "Your turn" exercises ----------
     <div class="try-block" data-solution="text">
       <input data-ans="6" data-tol="0.01"> ...
       <button class="btn check">  <button class="btn show">  <p class="feedback"> */
  document.querySelectorAll(".try-block").forEach((blk) => {
    const ins = blk.querySelectorAll("input[data-ans]"), fb = blk.querySelector(".feedback");
    const parse = (s) => parseFloat(s.trim().replace(/−/g, "-").replace(",", "."));
    blk.querySelector(".check").addEventListener("click", () => {
      let ok = 0, filled = 0;
      ins.forEach((inp) => {
        inp.classList.remove("right", "wrong");
        if (!inp.value.trim()) return;
        filled++;
        const want = parseFloat(inp.dataset.ans), tol = parseFloat(inp.dataset.tol || "0.01");
        const good = Math.abs(parse(inp.value) - want) <= tol;
        inp.classList.add(good ? "right" : "wrong"); if (good) ok++;
      });
      fb.textContent = !filled ? "Fill in at least one box first." : ok === ins.length ? "All correct. " + (blk.dataset.solution || "")
        : ok === filled ? "Correct so far. Fill in the remaining boxes." : (blk.dataset.hint || "Not yet. Check the highlighted box and try again.");
    });
    blk.querySelector(".show").addEventListener("click", () => {
      ins.forEach((inp) => { inp.value = inp.dataset.ans; inp.classList.remove("wrong"); inp.classList.add("right"); });
      fb.textContent = blk.dataset.solution || "";
    });
  });
})();
