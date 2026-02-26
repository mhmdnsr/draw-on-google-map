var $t = Object.defineProperty;
var zt = (l) => {
  throw TypeError(l);
};
var jt = (l, s, i) => s in l ? $t(l, s, { enumerable: !0, configurable: !0, writable: !0, value: i }) : l[s] = i;
var h = (l, s, i) => jt(l, typeof s != "symbol" ? s + "" : s, i), Zt = (l, s, i) => s.has(l) || zt("Cannot " + i);
var t = (l, s, i) => (Zt(l, s, "read from private field"), i ? i.call(l) : s.get(l)), r = (l, s, i) => s.has(l) ? zt("Cannot add the same private member more than once") : s instanceof WeakSet ? s.add(l) : s.set(l, i), e = (l, s, i, n) => (Zt(l, s, "write to private field"), n ? n.call(l, i) : s.set(l, i), i);
class qt {
  constructor() {
    h(this, "events");
    this.events = {};
  }
  subscribe(s, i) {
    let n = this;
    return n.events.hasOwnProperty(s) || (n.events[s] = []), n.events[s].push(i);
  }
  publish(s, i = {}) {
    let n = this;
    return n.events.hasOwnProperty(s) ? n.events[s].map((o) => o(i)) : [];
  }
}
class Jt {
  constructor(s) {
    h(this, "actions");
    h(this, "mutations");
    h(this, "states");
    h(this, "status");
    h(this, "events");
    let i = this;
    this.actions = {}, this.mutations = {}, this.states = {}, this.status = "resting", this.events = new qt(), s.hasOwnProperty("actions") && s.actions && (this.actions = s.actions), s.hasOwnProperty("mutations") && s.mutations && (this.mutations = s.mutations), this.states = new Proxy(s.state, {
      set: function(n, o, Z) {
        return n[o] = Z, i.events.publish("stateChange", i.states), i.status = "resting", !0;
      }
    });
  }
  dispatch(s, i) {
    return typeof this.actions[s] != "function" ? (console.error(`Action "${s} doesn't exist.`), !1) : (this.status = "action", this.actions[s](this, i), !0);
  }
  commit(s, i) {
    if (typeof this.mutations[s] != "function")
      return console.error(`Mutation "${s}" doesn't exist`), !1;
    this.status = "mutation";
    let n = this.mutations[s](this.states, i);
    return this.states = Object.assign(this.states, n), !0;
  }
}
var wt, kt, yt, Dt, Lt, bt, vt;
class Kt {
  constructor(s) {
    r(this, wt);
    r(this, kt);
    r(this, yt);
    r(this, Dt);
    r(this, Lt);
    r(this, bt);
    r(this, vt, null);
    h(this, "startDraw", function() {
    });
    h(this, "stopDraw", function() {
    });
    let i = this;
    s instanceof Jt && s.events.subscribe("stateChange", () => {
      i.stopDraw(), i.startDraw();
    });
  }
  set BRUSH(s) {
    e(this, wt, s);
  }
  get BRUSH() {
    return t(this, wt);
  }
  set POLYGON(s) {
    e(this, kt, s);
  }
  get POLYGON() {
    return t(this, kt);
  }
  set POLYLINE(s) {
    e(this, Dt, s);
  }
  get POLYLINE() {
    return t(this, Dt);
  }
  set CIRCLE(s) {
    e(this, Lt, s);
  }
  get CIRCLE() {
    return t(this, Lt);
  }
  set RECTANGLE(s) {
    e(this, bt, s);
  }
  get RECTANGLE() {
    return t(this, bt);
  }
  set MARKER(s) {
    e(this, yt, s);
  }
  get MARKER() {
    return t(this, yt);
  }
  get NONE() {
    return t(this, vt);
  }
}
wt = new WeakMap(), kt = new WeakMap(), yt = new WeakMap(), Dt = new WeakMap(), Lt = new WeakMap(), bt = new WeakMap(), vt = new WeakMap();
var c, p, J, ot, ct;
const Wt = class Wt extends Kt {
  constructor(i, n, o) {
    super(o);
    r(this, c);
    r(this, p);
    r(this, J);
    r(this, ot, !1);
    r(this, ct, []);
    h(this, "startDraw", () => {
      t(this, J).states.selected instanceof Wt && (t(this, c).setOptions({ draggableCursor: "cell" }), e(this, ot, !0), this.BRUSH = this.initTool(), this.setOptions(), this.initEvents());
    });
    h(this, "stopDraw", () => {
      t(this, ot) && (t(this, c).setOptions({ draggableCursor: 'url("https://maps.gstatic.com/mapfiles/openhand_8_8.cur"), default' }), e(this, ot, !1), t(this, p).maps.event.clearListeners(t(this, c), "mousemove"), t(this, p).maps.event.clearListeners(t(this, c), "mouseup"), t(this, p).maps.event.clearListeners(t(this, c), "mouseout"), t(this, p).maps.event.clearListeners(t(this, c), "mousedown"));
    });
    e(this, c, i), e(this, p, n), e(this, J, o);
  }
  initTool() {
    return {
      cache: {},
      map: t(this, c),
      options: { zIndex: 2e5 },
      poly: !1
    };
  }
  // Tools has #BRUSH private, but we need to access it.
  // In the original Tools class (in TS), it has getter/setters for BRUSH.
  // But here we are defining a private property BRUSH that conflicts or isn't compatible.
  // Let's use the setter/getter from base class or rename local property if it's meant to be internal state for this tool instance.
  // The base class Tools seems to hold the state of "current tool instance" in #BRUSH?
  // Let's assume we should use the base class accessor.
  // We remove `private BRUSH: any;` and use `this.BRUSH` accessor from Tools.
  setOptions() {
    this.BRUSH && this.BRUSH.options && (this.BRUSH.options.strokeColor = t(this, J).states.color, this.BRUSH.options.strokeWeight = t(this, J).states.strokeWeight);
  }
  drawStroke(i) {
    if (!i || !this.BRUSH.poly) {
      this.BRUSH.poly = !1;
      return;
    }
    let n = this.BRUSH.cache[this.BRUSH.poly], o = n.getPath();
    o.insertAt(o.getLength(), i.latLng), n.setPath(o);
  }
  initDraw(i, n) {
    let o = this.BRUSH.options;
    o.map = this.BRUSH.map, o.clickable = !1, this.setOptions(), this.BRUSH.poly = "p" + (/* @__PURE__ */ new Date()).getTime(), this.BRUSH.cache[this.BRUSH.poly] = new n.maps.Polyline(o), t(this, ct).push(this.BRUSH.cache[this.BRUSH.poly]), this.drawStroke(i);
  }
  initEvents() {
    t(this, p).maps.event.addListener(t(this, c), "mousemove", (i) => {
      this.drawStroke(i);
    }), t(this, p).maps.event.addListener(t(this, c), "mouseup", (i) => {
      this.drawStroke(0);
    }), t(this, p).maps.event.addListener(t(this, c), "mouseout", (i) => {
      this.drawStroke(0);
    }), t(this, p).maps.event.addListener(t(this, c), "mousedown", (i) => {
      this.initDraw(i, t(this, p));
    });
  }
  clearArt() {
    t(this, ct).map((i) => i.setMap(null)), t(this, ct).length = 0;
  }
  // Alias for compatibility
  clearDrawn() {
    this.clearArt();
  }
  getType() {
    return "BRUSH";
  }
};
c = new WeakMap(), p = new WeakMap(), J = new WeakMap(), ot = new WeakMap(), ct = new WeakMap();
let At = Wt;
var D, d, R, $, j, q, ut, B, u, M;
const Ut = class Ut {
  // Line from last point to cursor
  constructor(s, i) {
    r(this, D);
    r(this, d);
    // Type Store
    r(this, R, !1);
    r(this, $, null);
    r(this, j, null);
    r(this, q, null);
    r(this, ut, []);
    r(this, B, null);
    r(this, u, []);
    r(this, M, null);
    h(this, "startDraw", () => {
      t(this, d).states.selected instanceof Ut && (e(this, R, !0), t(this, D).setOptions({ draggableCursor: "crosshair", clickableIcons: !1, disableDoubleClickZoom: !0 }), e(this, u, []), e(this, $, t(this, D).addListener("click", (s) => {
        !t(this, R) || !s.latLng || this.addPoint(s.latLng);
      })), e(this, j, t(this, D).addListener("mousemove", (s) => {
        !t(this, R) || !s.latLng || t(this, u).length === 0 || this.updateTempLine(s.latLng);
      })), e(this, q, t(this, D).addListener("dblclick", (s) => {
        t(this, R) && this.finishPolygon();
      })));
    });
    h(this, "stopDraw", () => {
      t(this, R) && (e(this, R, !1), t(this, D).setOptions({ draggableCursor: null, clickableIcons: !0, disableDoubleClickZoom: !1 }), t(this, $) && (google.maps.event.removeListener(t(this, $)), e(this, $, null)), t(this, j) && (google.maps.event.removeListener(t(this, j)), e(this, j, null)), t(this, q) && (google.maps.event.removeListener(t(this, q)), e(this, q, null)), this.cleanupTemp());
    });
    e(this, D, s), e(this, d, i);
  }
  addPoint(s) {
    t(this, u).push(s), t(this, B) ? t(this, B).setPath(t(this, u)) : e(this, B, new google.maps.Polyline({
      map: t(this, D),
      path: t(this, u),
      strokeColor: t(this, d).states.color,
      strokeWeight: t(this, d).states.strokeWeight,
      clickable: !1
    }));
  }
  updateTempLine(s) {
    if (t(this, u).length === 0) return;
    const i = t(this, u)[t(this, u).length - 1];
    t(this, M) ? t(this, M).setPath([i, s]) : e(this, M, new google.maps.Polyline({
      map: t(this, D),
      path: [i, s],
      strokeColor: t(this, d).states.color,
      strokeWeight: t(this, d).states.strokeWeight,
      strokeOpacity: 0.5,
      clickable: !1
    }));
  }
  finishPolygon() {
    if (t(this, u).length < 3) {
      this.cleanupTemp();
      return;
    }
    const s = new google.maps.Polygon({
      map: t(this, D),
      paths: t(this, u),
      strokeColor: t(this, d).states.color,
      strokeWeight: t(this, d).states.strokeWeight,
      fillColor: t(this, d).states.polygonFillColor,
      fillOpacity: t(this, d).states.polygonOpacity,
      clickable: !0
    });
    t(this, ut).push(s), this.cleanupTemp();
  }
  cleanupTemp() {
    t(this, B) && (t(this, B).setMap(null), e(this, B, null)), t(this, M) && (t(this, M).setMap(null), e(this, M, null)), e(this, u, []);
  }
  clearArt() {
    t(this, ut).forEach((s) => s.setMap(null)), e(this, ut, []);
  }
  // Alias for compatibility
  clearDrawn() {
    this.clearArt();
  }
  getType() {
    return "POLYGON";
  }
};
D = new WeakMap(), d = new WeakMap(), R = new WeakMap(), $ = new WeakMap(), j = new WeakMap(), q = new WeakMap(), ut = new WeakMap(), B = new WeakMap(), u = new WeakMap(), M = new WeakMap();
let Rt = Ut;
var L, v, E, K, Q, V, gt, T, g, I;
const xt = class xt {
  constructor(s, i) {
    r(this, L);
    r(this, v);
    r(this, E, !1);
    r(this, K, null);
    r(this, Q, null);
    r(this, V, null);
    r(this, gt, []);
    r(this, T, null);
    r(this, g, []);
    r(this, I, null);
    h(this, "startDraw", () => {
      t(this, v).states.selected instanceof xt && (e(this, E, !0), t(this, L).setOptions({ draggableCursor: "crosshair", clickableIcons: !1, disableDoubleClickZoom: !0 }), e(this, g, []), e(this, K, t(this, L).addListener("click", (s) => {
        !t(this, E) || !s.latLng || this.addPoint(s.latLng);
      })), e(this, Q, t(this, L).addListener("mousemove", (s) => {
        !t(this, E) || !s.latLng || t(this, g).length === 0 || this.updateTempLine(s.latLng);
      })), e(this, V, t(this, L).addListener("dblclick", (s) => {
        t(this, E) && this.finishPolyline();
      })));
    });
    h(this, "stopDraw", () => {
      t(this, E) && (e(this, E, !1), t(this, L).setOptions({ draggableCursor: null, clickableIcons: !0, disableDoubleClickZoom: !1 }), t(this, K) && (google.maps.event.removeListener(t(this, K)), e(this, K, null)), t(this, Q) && (google.maps.event.removeListener(t(this, Q)), e(this, Q, null)), t(this, V) && (google.maps.event.removeListener(t(this, V)), e(this, V, null)), this.cleanupTemp());
    });
    e(this, L, s), e(this, v, i);
  }
  addPoint(s) {
    t(this, g).push(s), t(this, T) ? t(this, T).setPath(t(this, g)) : e(this, T, new google.maps.Polyline({
      map: t(this, L),
      path: t(this, g),
      strokeColor: t(this, v).states.color,
      strokeWeight: t(this, v).states.strokeWeight,
      clickable: !1
    }));
  }
  updateTempLine(s) {
    if (t(this, g).length === 0) return;
    const i = t(this, g)[t(this, g).length - 1];
    t(this, I) ? t(this, I).setPath([i, s]) : e(this, I, new google.maps.Polyline({
      map: t(this, L),
      path: [i, s],
      strokeColor: t(this, v).states.color,
      strokeWeight: t(this, v).states.strokeWeight,
      strokeOpacity: 0.5,
      clickable: !1
    }));
  }
  finishPolyline() {
    if (t(this, g).length < 2) {
      this.cleanupTemp();
      return;
    }
    const s = new google.maps.Polyline({
      map: t(this, L),
      path: t(this, g),
      strokeColor: t(this, v).states.color,
      strokeWeight: t(this, v).states.strokeWeight,
      clickable: !0
    });
    t(this, gt).push(s), this.cleanupTemp();
  }
  cleanupTemp() {
    t(this, T) && (t(this, T).setMap(null), e(this, T, null)), t(this, I) && (t(this, I).setMap(null), e(this, I, null)), e(this, g, []);
  }
  clearArt() {
    t(this, gt).forEach((s) => s.setMap(null)), e(this, gt, []);
  }
  clearDrawn() {
    this.clearArt();
  }
  getType() {
    return "POLYLINE";
  }
};
L = new WeakMap(), v = new WeakMap(), E = new WeakMap(), K = new WeakMap(), Q = new WeakMap(), V = new WeakMap(), gt = new WeakMap(), T = new WeakMap(), g = new WeakMap(), I = new WeakMap();
let Bt = xt;
var O, W, U, pt, X, _, tt, x, f, G;
const Ht = class Ht {
  constructor(s, i) {
    r(this, O);
    r(this, W);
    r(this, U, !1);
    r(this, pt, []);
    r(this, X, null);
    r(this, _, null);
    r(this, tt, null);
    r(this, x, null);
    r(this, f, null);
    r(this, G, !1);
    h(this, "startDraw", () => {
      t(this, W).states.selected instanceof Ht && (e(this, U, !0), t(this, O).setOptions({ draggable: !1, draggableCursor: "crosshair", clickableIcons: !1 }), e(this, X, t(this, O).addListener("mousedown", (s) => {
        !t(this, U) || !s.latLng || this.startDragging(s.latLng);
      })), e(this, _, t(this, O).addListener("mousemove", (s) => {
        !t(this, U) || !t(this, G) || !s.latLng || this.updateRadius(s.latLng);
      })), e(this, tt, t(this, O).addListener("mouseup", (s) => {
        !t(this, U) || !t(this, G) || this.finishCircle();
      })));
    });
    h(this, "stopDraw", () => {
      t(this, U) && (e(this, U, !1), t(this, O).setOptions({ draggable: !0, draggableCursor: null, clickableIcons: !0 }), this.cleanupListeners(), this.cleanupTemp());
    });
    e(this, O, s), e(this, W, i);
  }
  cleanupListeners() {
    t(this, X) && (google.maps.event.removeListener(t(this, X)), e(this, X, null)), t(this, _) && (google.maps.event.removeListener(t(this, _)), e(this, _, null)), t(this, tt) && (google.maps.event.removeListener(t(this, tt)), e(this, tt, null));
  }
  startDragging(s) {
    e(this, G, !0), e(this, x, s), e(this, f, new google.maps.Circle({
      map: t(this, O),
      center: t(this, x),
      radius: 0,
      strokeColor: t(this, W).states.color,
      strokeWeight: t(this, W).states.strokeWeight,
      fillColor: t(this, W).states.polygonFillColor,
      fillOpacity: t(this, W).states.polygonOpacity,
      clickable: !1
    }));
  }
  updateRadius(s) {
    if (!t(this, f) || !t(this, x)) return;
    const i = google.maps.geometry.spherical.computeDistanceBetween(t(this, x), s);
    t(this, f).setRadius(i);
  }
  finishCircle() {
    t(this, f) && (t(this, f).setOptions({ clickable: !0 }), t(this, pt).push(t(this, f)), e(this, f, null)), e(this, G, !1), e(this, x, null);
  }
  cleanupTemp() {
    t(this, f) && (t(this, f).setMap(null), e(this, f, null)), e(this, G, !1), e(this, x, null);
  }
  clearArt() {
    t(this, pt).forEach((s) => s.setMap(null)), e(this, pt, []);
  }
  clearDrawn() {
    this.clearArt();
  }
  getType() {
    return "CIRCLE";
  }
};
O = new WeakMap(), W = new WeakMap(), U = new WeakMap(), pt = new WeakMap(), X = new WeakMap(), _ = new WeakMap(), tt = new WeakMap(), x = new WeakMap(), f = new WeakMap(), G = new WeakMap();
let Mt = Ht;
var A, H, N, dt, st, et, it, Y, m, z;
const Nt = class Nt {
  constructor(s, i) {
    r(this, A);
    r(this, H);
    r(this, N, !1);
    r(this, dt, []);
    r(this, st, null);
    r(this, et, null);
    r(this, it, null);
    r(this, Y, null);
    r(this, m, null);
    r(this, z, !1);
    h(this, "startDraw", () => {
      t(this, H).states.selected instanceof Nt && (e(this, N, !0), t(this, A).setOptions({ draggable: !1, draggableCursor: "crosshair", clickableIcons: !1 }), e(this, st, t(this, A).addListener("mousedown", (s) => {
        !t(this, N) || !s.latLng || this.startDragging(s.latLng);
      })), e(this, et, t(this, A).addListener("mousemove", (s) => {
        !t(this, N) || !t(this, z) || !s.latLng || this.updateBounds(s.latLng);
      })), e(this, it, t(this, A).addListener("mouseup", (s) => {
        !t(this, N) || !t(this, z) || this.finishRectangle();
      })));
    });
    h(this, "stopDraw", () => {
      t(this, N) && (e(this, N, !1), t(this, A).setOptions({ draggable: !0, draggableCursor: null, clickableIcons: !0 }), this.cleanupListeners(), this.cleanupTemp());
    });
    e(this, A, s), e(this, H, i);
  }
  cleanupListeners() {
    t(this, st) && (google.maps.event.removeListener(t(this, st)), e(this, st, null)), t(this, et) && (google.maps.event.removeListener(t(this, et)), e(this, et, null)), t(this, it) && (google.maps.event.removeListener(t(this, it)), e(this, it, null));
  }
  startDragging(s) {
    e(this, z, !0), e(this, Y, s), e(this, m, new google.maps.Rectangle({
      map: t(this, A),
      bounds: new google.maps.LatLngBounds(s, s),
      strokeColor: t(this, H).states.color,
      strokeWeight: t(this, H).states.strokeWeight,
      fillColor: t(this, H).states.polygonFillColor,
      fillOpacity: t(this, H).states.polygonOpacity,
      clickable: !1
    }));
  }
  updateBounds(s) {
    if (!t(this, m) || !t(this, Y)) return;
    const i = new google.maps.LatLngBounds();
    i.extend(t(this, Y)), i.extend(s), t(this, m).setBounds(i);
  }
  finishRectangle() {
    t(this, m) && (t(this, m).setOptions({ clickable: !0 }), t(this, dt).push(t(this, m)), e(this, m, null)), e(this, z, !1), e(this, Y, null);
  }
  cleanupTemp() {
    t(this, m) && (t(this, m).setMap(null), e(this, m, null)), e(this, z, !1), e(this, Y, null);
  }
  clearArt() {
    t(this, dt).forEach((s) => s.setMap(null)), e(this, dt, []);
  }
  clearDrawn() {
    this.clearArt();
  }
  getType() {
    return "RECTANGLE";
  }
};
A = new WeakMap(), H = new WeakMap(), N = new WeakMap(), dt = new WeakMap(), st = new WeakMap(), et = new WeakMap(), it = new WeakMap(), Y = new WeakMap(), m = new WeakMap(), z = new WeakMap();
let Et = Nt;
var Ct, ft;
const ht = class ht {
  constructor(s) {
    r(this, Ct);
    e(this, Ct, s);
  }
  icon() {
    const s = t(this, Ct).states.color;
    if (t(ht, ft)[s])
      return t(ht, ft)[s];
    let i = document.createElement("canvas"), n = i.getContext("2d");
    if (!n) return "";
    const o = ".", Z = "600 120px Times New Roman";
    n.font = Z;
    const nt = n.measureText(o);
    let St = 0, Gt = nt.width, Ot = 0;
    nt.actualBoundingBoxAscent !== void 0 && nt.actualBoundingBoxDescent !== void 0 ? (Ot = nt.actualBoundingBoxAscent, St = nt.actualBoundingBoxAscent + nt.actualBoundingBoxDescent) : (St = Gt, Ot = St * 0.8), i.height = St + 8, i.width = Gt + 8, n.font = Z, n.fillStyle = s, n.textBaseline = "alphabetic", n.fillText(o, 4, 4 + Ot);
    const Yt = i.toDataURL();
    return t(ht, ft)[s] = Yt, Yt;
  }
};
Ct = new WeakMap(), ft = new WeakMap(), // Cache for generated icons: color -> dataURL
r(ht, ft, {});
let Tt = ht;
var F, rt, lt, at, mt;
const Ft = class Ft {
  constructor(s, i) {
    r(this, F);
    r(this, rt);
    r(this, lt, !1);
    r(this, at, null);
    r(this, mt, []);
    h(this, "startDraw", () => {
      t(this, rt).states.selected instanceof Ft && (e(this, lt, !0), t(this, F).setOptions({ draggableCursor: "crosshair", clickableIcons: !1 }), e(this, at, t(this, F).addListener("click", (s) => {
        !t(this, lt) || !s.latLng || this.addMarker(s.latLng);
      })));
    });
    h(this, "stopDraw", () => {
      t(this, lt) && (e(this, lt, !1), t(this, F).setOptions({ draggableCursor: null, clickableIcons: !0 }), t(this, at) && (google.maps.event.removeListener(t(this, at)), e(this, at, null)));
    });
    e(this, F, s), e(this, rt, i);
  }
  addMarker(s) {
    let i;
    const n = this.getIcon();
    if (google.maps.marker && google.maps.marker.AdvancedMarkerElement) {
      const o = {
        map: t(this, F),
        position: s
      };
      if (n) {
        const Z = document.createElement("img");
        Z.src = n, o.content = Z;
      }
      i = new google.maps.marker.AdvancedMarkerElement(o);
    } else
      i = new google.maps.Marker({
        map: t(this, F),
        position: s,
        icon: n,
        draggable: !1
      });
    t(this, mt).push(i);
  }
  getIcon() {
    const { markerIcon: s } = t(this, rt).states;
    return !s || s.toLowerCase() === "default" ? null : s.toLowerCase() === "colorful" ? new Tt(t(this, rt)).icon() : s;
  }
  clearArt() {
    t(this, mt).forEach((s) => {
      s.map = null;
    }), e(this, mt, []);
  }
  clearDrawn() {
    this.clearArt();
  }
  getType() {
    return "MARKER";
  }
};
F = new WeakMap(), rt = new WeakMap(), lt = new WeakMap(), at = new WeakMap(), mt = new WeakMap();
let It = Ft;
const Qt = {
  selected: null,
  color: "#fff",
  strokeWeight: 6,
  polygonFillColor: "#fff",
  polygonOpacity: 1,
  markerIcon: null
}, Vt = {
  changeSelected(l, s) {
    l.commit("changeSelected", s);
  },
  changeColor(l, s) {
    l.commit("changeColor", s);
  },
  changeStrokeWeight(l, s) {
    l.commit("changeStrokeWeight", s);
  },
  changePolygonFillColor(l, s) {
    l.commit("changePolygonFillColor", s);
  },
  changePolygonOpacity(l, s) {
    l.commit("changePolygonOpacity", s);
  },
  changeMarkerIcon(l, s) {
    l.commit("changeMarkerIcon", s);
  }
}, Xt = {
  changeSelected(l, s) {
    return l.selected = s, l;
  },
  changeColor(l, s) {
    return l.color = s, l;
  },
  changeStrokeWeight(l, s) {
    return l.strokeWeight = s, l;
  },
  changePolygonFillColor(l, s) {
    return l.polygonFillColor = s, l;
  },
  changePolygonOpacity(l, s) {
    return s > 1 ? s = 1 : s < 0 && (s = 0), l.polygonOpacity = s, l;
  },
  changeMarkerIcon(l, s) {
    return l.markerIcon = s, l;
  }
};
function _t() {
  const l = JSON.parse(JSON.stringify(Qt));
  return new Jt({
    state: l,
    actions: Vt,
    mutations: Xt
  });
}
var b, Pt, C, P, w, k, y, S, a;
class ss {
  constructor(s) {
    r(this, b);
    r(this, Pt);
    r(this, C, null);
    r(this, P, null);
    r(this, w, null);
    r(this, k, null);
    r(this, y, null);
    r(this, S, null);
    r(this, a);
    // Public properties
    h(this, "brush", null);
    h(this, "polygon", null);
    h(this, "polyline", null);
    h(this, "circle", null);
    h(this, "rectangle", null);
    h(this, "marker", null);
    h(this, "holdMap", () => {
      t(this, b).setOptions({ draggable: !1 });
    });
    h(this, "releaseMap", () => {
      t(this, b).setOptions({ draggable: !0 });
    });
    if (console.log("DrawOnMap constructor running"), !s)
      throw new Error("You should pass the map instance.");
    if (!window.google || !window.google.maps)
      throw new Error("Google Maps JavaScript API is not loaded.");
    e(this, Pt, window.google), e(this, b, s), e(this, a, _t()), this.brush = {
      startDraw: () => {
        this.startBrushDraw();
      },
      stopDraw: () => {
        this.stopBrushDraw();
      },
      clearArt: () => {
        this.clearBrushArt();
      }
    }, console.log("Assigned brush:", this.brush), this.polygon = {
      startDraw: () => {
        this.startPolygonDraw();
      },
      stopDraw: () => {
        this.stopPolygonDraw();
      },
      clearArt: () => {
        this.clearPolygonArt();
      },
      changeOpacity: (i) => {
        this.changePolygonOpacity(i);
      },
      changeFillColor: (i) => {
        this.changePolygonFillColor(i);
      }
    }, this.polyline = {
      startDraw: () => {
        this.startPolylineDraw();
      },
      stopDraw: () => {
        this.stopPolylineDraw();
      },
      clearArt: () => {
        this.clearPolylineArt();
      }
    }, this.circle = {
      startDraw: () => {
        this.startCircleDraw();
      },
      stopDraw: () => {
        this.stopCircleDraw();
      },
      clearArt: () => {
        this.clearCircleArt();
      }
    }, this.rectangle = {
      startDraw: () => {
        this.startRectangleDraw();
      },
      stopDraw: () => {
        this.stopRectangleDraw();
      },
      clearArt: () => {
        this.clearRectangleArt();
      }
    }, this.marker = {
      startDraw: () => {
        this.startMarkerDraw();
      },
      stopDraw: () => {
        this.stopMarkerDraw();
      },
      clearArt: () => {
        this.clearMarkerArt();
      },
      changeIcon: (i) => {
        this.changeMarkerIcon(i);
      }
    }, console.log("Assigned circle:", this.circle);
  }
  startBrushDraw() {
    t(this, C) || e(this, C, new At(t(this, b), t(this, Pt), t(this, a))), t(this, a).states.selected !== t(this, C) && t(this, a).dispatch("changeSelected", t(this, C));
  }
  stopBrushDraw() {
    if (!t(this, C))
      throw "Brush Didn't initialized yet! please start Brush drawing before stopping it!";
    t(this, C).stopDraw(), t(this, a).states.selected === t(this, C) && t(this, a).dispatch("changeSelected", null);
  }
  clearBrushArt() {
    t(this, C) && t(this, C).clearDrawn();
  }
  startPolygonDraw() {
    t(this, P) || e(this, P, new Rt(t(this, b), t(this, a))), t(this, a).states.selected !== t(this, P) && t(this, a).dispatch("changeSelected", t(this, P));
  }
  stopPolygonDraw() {
    if (!t(this, P))
      throw "Polygon Didn't initialized yet! please start Polygon drawing before stopping it!";
    t(this, P).stopDraw(), t(this, a).states.selected === t(this, P) && t(this, a).dispatch("changeSelected", null);
  }
  clearPolygonArt() {
    t(this, P) && t(this, P).clearDrawn();
  }
  startPolylineDraw() {
    t(this, w) || e(this, w, new Bt(t(this, b), t(this, a))), t(this, a).states.selected !== t(this, w) && t(this, a).dispatch("changeSelected", t(this, w));
  }
  stopPolylineDraw() {
    if (!t(this, w))
      throw "Polyline Didn't initialized yet! please start Polyline drawing before stopping it!";
    t(this, w).stopDraw(), t(this, a).states.selected === t(this, w) && t(this, a).dispatch("changeSelected", null);
  }
  clearPolylineArt() {
    t(this, w) && t(this, w).clearDrawn();
  }
  startCircleDraw() {
    t(this, k) || e(this, k, new Mt(t(this, b), t(this, a))), t(this, a).states.selected !== t(this, k) && t(this, a).dispatch("changeSelected", t(this, k));
  }
  stopCircleDraw() {
    if (!t(this, k))
      throw "Circle Didn't initialized yet! please start Circle drawing before stopping it!";
    t(this, k).stopDraw(), t(this, a).states.selected === t(this, k) && t(this, a).dispatch("changeSelected", null);
  }
  clearCircleArt() {
    t(this, k) && t(this, k).clearDrawn();
  }
  startRectangleDraw() {
    t(this, y) || e(this, y, new Et(t(this, b), t(this, a))), t(this, a).states.selected !== t(this, y) && t(this, a).dispatch("changeSelected", t(this, y));
  }
  stopRectangleDraw() {
    if (!t(this, y))
      throw "Rectangle Didn't initialized yet! please start Rectangle drawing before stopping it!";
    t(this, y).stopDraw(), t(this, a).states.selected === t(this, y) && t(this, a).dispatch("changeSelected", null);
  }
  clearRectangleArt() {
    t(this, y) && t(this, y).clearDrawn();
  }
  startMarkerDraw() {
    t(this, S) || e(this, S, new It(t(this, b), t(this, a))), t(this, a).states.selected !== t(this, S) && t(this, a).dispatch("changeSelected", t(this, S));
  }
  stopMarkerDraw() {
    if (!t(this, S))
      throw "Marker Didn't initialized yet! please start Marker drawing before stopping it!";
    t(this, S).stopDraw(), t(this, a).states.selected === t(this, S) && t(this, a).dispatch("changeSelected", null);
  }
  clearMarkerArt() {
    t(this, S) && t(this, S).clearDrawn();
  }
  clearAllArt() {
    this.clearBrushArt(), this.clearPolygonArt(), this.clearMarkerArt(), t(this, w) && this.clearPolylineArt(), t(this, k) && this.clearCircleArt(), t(this, y) && this.clearRectangleArt();
  }
  changeColor(s) {
    s && typeof s == "string" && t(this, a).dispatch("changeColor", s);
  }
  changeStrokeWeight(s) {
    s && typeof s == "number" && t(this, a).dispatch("changeStrokeWeight", s);
  }
  changePolygonFillColor(s) {
    s && typeof s == "string" && t(this, a).dispatch("changePolygonFillColor", s);
  }
  changePolygonOpacity(s) {
    s && typeof s == "number" && t(this, a).dispatch("changePolygonOpacity", s);
  }
  changeMarkerIcon(s) {
    t(this, a).dispatch("changeMarkerIcon", s);
  }
  getSelectedTool() {
    return t(this, a).states.selected.getType();
  }
  getSelectedColor() {
    return t(this, a).states.color;
  }
}
b = new WeakMap(), Pt = new WeakMap(), C = new WeakMap(), P = new WeakMap(), w = new WeakMap(), k = new WeakMap(), y = new WeakMap(), S = new WeakMap(), a = new WeakMap();
export {
  ss as default
};
