const h = typeof performance !== void 0, d = /* @__PURE__ */ new Map(), l = 5, m = window.fetch, w = XMLHttpRequest.prototype.send;
window.fetch = function(...o) {
  const t = { startTime: performance.now(), endTime: -1 }, e = m.apply(this, o);
  return d.set(e, t), e.then((n) => (t.endTime = performance.now(), n)).catch((n) => {
    throw t.endTime = performance.now(), n;
  }).finally(() => {
    d.delete(e);
  }), e;
};
XMLHttpRequest.prototype.send = function(...o) {
  const t = { startTime: performance.now(), endTime: -1 }, e = this, n = () => {
    t.endTime = performance.now(), d.delete(e);
  };
  return e.addEventListener("load", n), e.addEventListener("error", n), e.addEventListener("abort", n), d.set(e, t), w.apply(this, o);
};
const v = (o, t) => {
  const e = [];
  let n = o.length;
  return h ? new Promise((f) => {
    let u = 0;
    const i = o.length, c = () => {
      let r = u;
      o[r]().then((s) => {
        e[r] = { status: "fulfilled", value: s }, t && t(s, r);
      }).catch((s) => {
        e[r] = { status: "rejected", reason: s }, t && t(s, r);
      }).finally(() => {
        n--;
      });
    }, a = () => {
      const r = l - d.size;
      if (n === 0)
        return p.disconnect(), f(e);
      if (u < i && r > 0)
        for (let s = 0; s < Math.min(r, i); s++)
          c(), u++;
    }, p = new PerformanceObserver(a);
    window.onload = function() {
      p.observe({ type: "resource" }), a();
    };
  }) : new Promise((f) => {
    o.forEach((u, i) => {
      u().then((c) => {
        e[i] = { status: "fulfilled", value: c }, t && t(c, i);
      }).catch((c) => {
        e[i] = { status: "rejected", reason: c }, t && t(c, i);
      }).finally(() => {
        n--, n === 0 && f(e);
      });
    });
  });
};
export {
  v as IdleRequest
};
