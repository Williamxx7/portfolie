/*
 * Pixel-William: lille animeret pixelfigur (16 x 24). Ingen biblioteker.
 *
 * Brug:  <div data-pixel-william data-scale="5"></div>
 *        <script src="pixel-william.js" defer></script>
 *
 * Animationer: blink, vejrtrækning, kigger til siderne, nikker, hopper, vinker,
 * skriver på laptop, snakker og tager billede (klik).
 * Hover = vinker. Klik = kamera + flash.
 * Slår "reducer bevægelse" til i systemet, står figuren stille.
 *
 * Kobling til chatten (widget.js sender disse events på window):
 *   williamchat:open     -> vinker
 *   williamchat:thinking -> sidder og skriver på laptop
 *   williamchat:reply    -> snakker et øjeblik
 *   williamchat:done     -> stopper skrivning (fx ved fejl)
 *
 * Kald selv: var w = PixelWilliam.mount(el); w.wave(); w.nod(); w.look("l");
 *            w.jump(); w.type(3000); w.talk(2000); w.snap();
 */
(function () {
  // ---- Farver (ret frit) ----
  var PAL = {
    H: "#4b3324", h: "#7a5638", B: "#2e2018",       // hår, highlights, bryn/mund-indre
    S: "#efc4a8", s: "#d9a487", E: "#2b3a40",       // hud, skygge/skæg, øjne
    M: "#b9695f", e: "#e8eef5",                     // mund, ørestik
    N: "#1f2a4d", n: "#3a4a85",                     // marineblå skjorte
    P: "#2a2d36", W: "#e9e7e1",                     // bukser, sko
    C: "#17181a", c: "#8fb4c4", f: "#ffffff",       // kamera, linse, flash
    L: "#9aa0a8", l: "#d5d9de", D: "#3b3f47"        // laptop: låg, logo, base
  };
  var OUTLINE = "#14110f";

  // ---- Sprite 16 x 24 (. = gennemsigtig) ----
  var ROWS = [
    "....H..HH..H....",
    "...HHHHHHHHHH...",
    "..HHhHHHhHHHHH..",
    "..HHHHHHHHHHHH..",
    "..HHhHHHHhHHHH..",
    "..HHSHHHHHHSSH..",
    "...HSSHHSSSSH...",
    "...HBBSSSSBBH...",
    "..SSSESSSSESSS..",
    "..SSSSSSSSSSSS..",
    "..eSSSSssSSSS...",
    "...sSSSMMSSSs...",
    "....sSSSSSSs....",
    "......SSSS......",
    "...NnNNSSNNnN...",
    "..NNNNNnnNNNNN..",
    "..NNNNNnnNNNNN..",
    "..SNNNNnnNNNNS..",
    "...NNNNNNNNNN...",
    "...PPPPPPPPPP...",
    "...PPPPPPPPPP...",
    "...PPPP..PPPP...",
    "...PPPP..PPPP...",
    "..WWWWW..WWWWW.."
  ];

  // ---- Frames som små rettelser [x, y, tegn] ----
  var EYES = { c: [[5, 8], [10, 8]], l: [[4, 8], [9, 8]], r: [[6, 8], [11, 8]], d: [[5, 9], [10, 9]] };
  var MOUTH_OPEN = [[7, 11, "B"], [8, 11, "B"], [7, 12, "M"], [8, 12, "M"]];
  var ARM = [[13, 15, "."], [13, 16, "."], [13, 17, "."], [13, 14, "N"], [14, 13, "N"], [14, 12, "N"]];
  var HAND_A = [[14, 10, "S"], [14, 11, "S"], [15, 11, "S"]];
  var HAND_B = [[15, 10, "S"], [14, 11, "S"], [15, 11, "S"]];
  var NO_ARMS = [[2, 15, "."], [2, 16, "."], [2, 17, "."], [13, 15, "."], [13, 16, "."], [13, 17, "."]];
  var SNAP = NO_ARMS.concat([
    [5, 15, "C"], [6, 15, "C"], [7, 15, "C"], [8, 15, "C"], [9, 15, "C"], [10, 15, "C"],
    [5, 16, "C"], [6, 16, "C"], [7, 16, "c"], [8, 16, "c"], [9, 16, "C"], [10, 16, "C"],
    [4, 16, "S"], [11, 16, "S"]
  ]);
  var TYPE = NO_ARMS.concat([
    [4, 15, "L"], [5, 15, "L"], [6, 15, "L"], [7, 15, "L"], [8, 15, "L"], [9, 15, "L"], [10, 15, "L"], [11, 15, "L"],
    [4, 16, "L"], [5, 16, "L"], [6, 16, "L"], [7, 16, "l"], [8, 16, "l"], [9, 16, "L"], [10, 16, "L"], [11, 16, "L"],
    [4, 17, "L"], [5, 17, "L"], [6, 17, "L"], [7, 17, "L"], [8, 17, "L"], [9, 17, "L"], [10, 17, "L"], [11, 17, "L"],
    [3, 18, "D"], [4, 18, "D"], [5, 18, "D"], [6, 18, "D"], [7, 18, "D"], [8, 18, "D"], [9, 18, "D"], [10, 18, "D"], [11, 18, "D"], [12, 18, "D"]
  ]);
  var TYPE_A = [[3, 17, "S"], [12, 16, "S"]];
  var TYPE_B = [[3, 16, "S"], [12, 17, "S"]];

  function grid(over) {
    var g = ROWS.map(function (r) { return r.split(""); });
    over.forEach(function (p) { g[p[1]][p[0]] = p[2]; });
    return g;
  }

  // Samler alle tilstande til ét billede
  function frame(st) {
    var o = [];
    if (st.snap) {
      o = o.concat(SNAP);
      if (st.snap === 2) o.push([7, 16, "f"], [8, 16, "f"]);
    } else if (st.type) {
      o = o.concat(TYPE, st.type === 1 ? TYPE_A : TYPE_B);
    } else if (st.wave) {
      o = o.concat(ARM, st.wave === 1 ? HAND_A : HAND_B);
    }
    var g = grid(o);
    var look = st.type && !st.snap ? "d" : (st.look || "c");
    if (look !== "c") { g[8][5] = "S"; g[8][10] = "S"; }
    var ec = st.blink && !st.snap ? "s" : "E";
    EYES[look].forEach(function (p) { g[p[1]][p[0]] = ec; });
    if (st.mouth && !st.snap) MOUTH_OPEN.forEach(function (p) { g[p[1]][p[0]] = p[2]; });
    if (st.nod) { // hovedet falder 1 pixel
      for (var y = 12; y >= 0; y--) g[y + 1] = g[y].slice();
      g[0] = new Array(16).fill(".");
    }
    return g;
  }

  // Tegner pixels + 1 px kontur, så figuren kan ses på både lys og mørk baggrund
  function paint(ctx, g) {
    var W = g[0].length, H = g.length;
    ctx.clearRect(0, 0, W + 2, H + 2);
    function solid(x, y) { return x >= 0 && y >= 0 && x < W && y < H && g[y][x] !== "."; }
    for (var y = -1; y <= H; y++) {
      for (var x = -1; x <= W; x++) {
        if (solid(x, y)) {
          ctx.fillStyle = PAL[g[y][x]];
          ctx.fillRect(x + 1, y + 1, 1, 1);
        } else if (solid(x - 1, y) || solid(x + 1, y) || solid(x, y - 1) || solid(x, y + 1)) {
          ctx.fillStyle = OUTLINE;
          ctx.fillRect(x + 1, y + 1, 1, 1);
        }
      }
    }
  }

  function injectCss() {
    if (document.getElementById("pw-css")) return;
    var st = document.createElement("style");
    st.id = "pw-css";
    st.textContent =
      ".pw{border:0;background:none;padding:0;margin:0;cursor:pointer;line-height:0;display:inline-block}" +
      ".pw:focus-visible{outline:2px solid currentColor;outline-offset:4px;border-radius:4px}" +
      ".pw canvas{image-rendering:pixelated;image-rendering:crisp-edges}" +
      ".pw.pw-live canvas{animation:pw-bob 1.4s steps(1,end) infinite}" +
      "@keyframes pw-bob{0%,49%{transform:translateY(0)}50%,100%{transform:translateY(calc(var(--pw-px) * -1))}}" +
      ".pixel-chat{position:fixed;right:16px;bottom:16px;z-index:2147483000;display:flex;flex-direction:column;align-items:center;gap:6px}" +
      ".pixel-chat-label{font:500 11px/1.2 'DM Sans',system-ui,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:#6b6760;background:rgba(250,249,247,.94);border:1px solid #e8e5e0;border-radius:999px;padding:5px 10px;box-shadow:0 2px 10px rgba(0,0,0,.08);pointer-events:none}" +
      "@media(prefers-color-scheme:dark){.pixel-chat-label{color:#d8d5ce;background:rgba(26,25,23,.94);border-color:#363532}}" +
      ".pw.pw-jump{animation:pw-jump .5s steps(1,end)}" +
      "@keyframes pw-jump{0%,100%{transform:translateY(0)}20%,80%{transform:translateY(calc(var(--pw-px) * -2))}40%,60%{transform:translateY(calc(var(--pw-px) * -4))}}" +
      ".pw-flash canvas{filter:brightness(1.8)}";
    document.head.appendChild(st);
  }

  function mount(host, opts) {
    opts = opts || {};
    injectCss();
    var scale = Number(opts.scale || host.dataset.scale) || 5;
    var chatTrigger = host.dataset.chatTrigger === "true";
    var still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "pw" + (still ? "" : " pw-live");
    btn.style.setProperty("--pw-px", scale + "px");
    btn.setAttribute("aria-label", opts.label || (chatTrigger ? "Åbn chat med William" : "Pixelfigur af William. Tryk for at tage et billede."));
    var cv = document.createElement("canvas");
    cv.width = 18; cv.height = 26;
    cv.style.width = 18 * scale + "px";
    cv.style.height = 26 * scale + "px";
    btn.appendChild(cv);
    host.appendChild(btn);
    var ctx = cv.getContext("2d");

    var st = { blink: false, wave: 0, snap: 0, mouth: 0, look: null, type: 0, nod: 0 };
    var T = {};
    var destroyed = false;

    function draw() { paint(ctx, frame(st)); }
    function stop(k) { clearInterval(T[k]); clearTimeout(T[k + "E"]); T[k] = T[k + "E"] = null; }
    function loop(k, ms, step, total, done) {
      if (still || destroyed) return;
      stop(k);
      var i = 0; step(i); draw();
      T[k] = setInterval(function () { step(++i); draw(); }, ms);
      T[k + "E"] = setTimeout(function () { stop(k); if (done) done(); draw(); }, total);
    }
    function busy() { return !!(st.snap || st.wave || st.type || st.nod || st.look); }

    function wave(ms) {
      if (st.snap || st.type) return;
      loop("wave", 220, function (i) { st.wave = (i % 2) + 1; }, ms || 1400, function () { st.wave = 0; });
    }
    function nod() {
      if (busy()) return;
      loop("nod", 170, function (i) { st.nod = i % 2 === 0 ? 1 : 0; }, 700, function () { st.nod = 0; });
    }
    function look(dir) {
      if (busy() || still) return;
      st.look = dir; draw(); stop("look");
      T.lookE = setTimeout(function () { st.look = null; draw(); }, 1300);
    }
    function typeFor(ms) {
      if (st.snap) return;
      stop("wave"); st.wave = 0;
      loop("type", 150, function (i) { st.type = (i % 2) + 1; }, ms || 2400, function () { st.type = 0; });
    }
    function endType() { stop("type"); st.type = 0; draw(); }
    function talk(ms) {
      loop("talk", 130, function (i) { st.mouth = i % 2; }, ms || 1600, function () { st.mouth = 0; });
    }
    function jump() {
      if (still || st.snap) return;
      btn.classList.add("pw-jump");
      setTimeout(function () { btn.classList.remove("pw-jump"); }, 520);
    }
    function snap() {
      stop("wave"); st.wave = 0; endType();
      st.snap = 1; draw();
      if (!still) {
        setTimeout(function () { st.snap = 2; draw(); btn.classList.add("pw-flash"); }, 350);
        setTimeout(function () { btn.classList.remove("pw-flash"); }, 550);
      }
      setTimeout(function () { st.snap = 0; draw(); }, 1000);
      host.dispatchEvent(new CustomEvent("pixelwilliam:snap", { bubbles: true }));
    }

    function scheduleBlink() {
      T.blink = setTimeout(function () {
        if (destroyed) return;
        st.blink = true; draw();
        T.blink = setTimeout(function () {
          st.blink = false; draw();
          scheduleBlink();
        }, 130);
      }, 2500 + Math.random() * 3000);
    }
    // Små tilfældige "liv"-handlinger, når siden bare står
    function scheduleIdle() {
      T.idle = setTimeout(function () {
        if (destroyed) return;
        if (!document.hidden && !busy()) {
          var r = Math.random();
          if (r < 0.30) look(Math.random() < 0.5 ? "l" : "r");
          else if (r < 0.50) nod();
          else if (r < 0.65) wave(1400);
          else if (r < 0.80) jump();
          else typeFor(2200);
        }
        scheduleIdle();
      }, 5000 + Math.random() * 5000);
    }

    function onChatOpen() { wave(1600); }
    function onChatThinking() { typeFor(60000); }
    function onChatReply() { endType(); talk(1800); }
    function onChatDone() { endType(); }

    btn.addEventListener("click", chatTrigger ? function () {
      window.dispatchEvent(new CustomEvent("williamchat:toggle"));
    } : snap);
    btn.addEventListener("pointerenter", function () { wave(1400); });
    window.addEventListener("williamchat:open", onChatOpen);
    window.addEventListener("williamchat:thinking", onChatThinking);
    window.addEventListener("williamchat:reply", onChatReply);
    window.addEventListener("williamchat:done", onChatDone);

    draw();
    if (!still) {
      scheduleBlink();
      scheduleIdle();
      T.hello = setTimeout(function () { if (!destroyed) wave(1600); }, 600);
    }

    function destroy() {
      if (destroyed) return;
      destroyed = true;
      Object.keys(T).forEach(function (key) {
        clearInterval(T[key]);
        clearTimeout(T[key]);
        clearTimeout(T[key + "E"]);
      });
      window.removeEventListener("williamchat:open", onChatOpen);
      window.removeEventListener("williamchat:thinking", onChatThinking);
      window.removeEventListener("williamchat:reply", onChatReply);
      window.removeEventListener("williamchat:done", onChatDone);
      btn.remove();
    }

    return { wave: wave, snap: snap, nod: nod, look: look, type: typeFor, talk: talk, jump: jump, destroy: destroy };
  }

  window.PixelWilliam = { mount: mount, _frame: frame, _pal: PAL };
  if (typeof document !== "undefined") {
    var auto = function () {
      document.querySelectorAll("[data-pixel-william]").forEach(function (el) { mount(el); });
    };
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", auto);
    else auto();
  }
})();
