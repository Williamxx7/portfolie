/*
 * williamlarsen.dk chat-widget
 * Brug på siden:
 *   <script src="/widget.js"
 *           data-endpoint="https://william-chat.DIT-NAVN.workers.dev"
 *           data-contact="https://williamlarsen.dk/#kontakt"
 *           data-hide-button="true" data-pixel-trigger="true" defer></script>
 */
(function () {
  var script = document.currentScript;
  var ENDPOINT = script && script.dataset.endpoint;
  var CONTACT = (script && script.dataset.contact) || "https://williamlarsen.dk/#kontakt";
  var HIDE_BUTTON = script && script.dataset.hideButton === "true";
  var PIXEL_TRIGGER = script && script.dataset.pixelTrigger === "true";
  if (!ENDPOINT) return console.error("chat-widget: mangler data-endpoint");
  try { new URL(ENDPOINT); } catch (e) { return console.error("chat-widget: ugyldig data-endpoint"); }

  var MAX_CHARS = 500;
  var MAX_MESSAGES = 10; // skal matche Workeren
  var TIMEOUT_MS = 20000;
  var history = [];
  var busy = false;
  function evt(name) {
    window.dispatchEvent(new CustomEvent("williamchat:" + name));
  }

  var css = `
  .p2-root {
    --p2-bg: #faf9f7;
    --p2-ink: #1a1917;
    --p2-muted: #6b6760;
    --p2-line: #e8e5e0;
    --p2-accent: #8b6c4f;
    --p2-accent-ink: #faf9f7;
    --p2-user: #8b6c4f;
    --p2-bot: #f3f1ed;
    position: fixed;
    right: 16px;
    bottom: calc(16px + env(safe-area-inset-bottom, 0px));
    z-index: 2147483000;
    font: 15px/1.45 "DM Sans", system-ui, -apple-system, "Segoe UI", sans-serif;
    color: var(--p2-ink);
  }
  .p2-root * { box-sizing: border-box; }
  .p2-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    border: 1px solid var(--p2-accent);
    border-radius: 999px;
    padding: 12px 18px;
    background: var(--p2-accent);
    color: var(--p2-accent-ink);
    font: inherit;
    font-weight: 500;
    cursor: pointer;
    box-shadow: 0 2px 14px rgba(0, 0, 0, 0.16);
  }
  .p2-btn:hover { opacity: 0.92; }
  .p2-btn:focus-visible,
  .p2-send:focus-visible,
  .p2-close:focus-visible,
  .p2-input:focus-visible {
    outline: 2px solid var(--p2-ink);
    outline-offset: 2px;
  }
  .p2-panel {
    display: none;
    flex-direction: column;
    padding: 0;
    margin: 0;
    width: min(360px, calc(100vw - 32px));
    height: min(520px, calc(100dvh - 90px));
    background: var(--p2-bg);
    border: 1px solid var(--p2-line);
    border-radius: 14px;
    overflow: hidden;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.22);
  }
  .p2-root.open .p2-panel { display: flex; }
  .p2-root.open .p2-btn { display: none; }
  .p2-root.p2-hide-button .p2-btn { display: none; }
  .p2-root.p2-pixel-trigger { bottom: 160px; }
  .p2-root.p2-pixel-trigger .p2-panel { height: min(520px, calc(100dvh - 180px)); }
  .p2-head {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 8px;
    padding: 14px 16px;
    border-bottom: 1px solid var(--p2-line);
    background: #fffdf9;
  }
  .p2-title { font-weight: 600; }
  .p2-sub {
    font-size: 11px;
    color: var(--p2-muted);
    margin-top: 2px;
  }
  .p2-close {
    border: 0;
    background: none;
    color: var(--p2-ink);
    font-size: 22px;
    line-height: 1;
    cursor: pointer;
    padding: 0 4px;
  }
  .p2-log {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    background: var(--p2-bg);
  }
  .p2-msg {
    max-width: 85%;
    padding: 9px 12px;
    border-radius: 12px;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
  }
  .p2-msg.bot { background: var(--p2-bot); align-self: flex-start; }
  .p2-msg.bot:first-child { margin-top: 2px; }
  .p2-msg.user { background: var(--p2-user); color: var(--p2-accent-ink); align-self: flex-end; }
  .p2-msg.note {
    background: none;
    color: var(--p2-muted);
    font-size: 12px;
    align-self: center;
    text-align: center;
    max-width: 100%;
  }
  .p2-msg a { color: inherit; text-decoration: underline; }
  .p2-form {
    display: flex;
    gap: 8px;
    padding: 12px;
    border-top: 1px solid var(--p2-line);
    background: #fffdf9;
  }
  .p2-footnote {
    padding: 0 12px 10px;
    background: #fffdf9;
    color: var(--p2-muted);
    font-size: 10px;
    line-height: 1.4;
    text-align: center;
  }
  .p2-input {
    flex: 1;
    min-width: 0;
    border: 1px solid var(--p2-line);
    border-radius: 10px;
    padding: 10px 12px;
    background: var(--p2-bg);
    color: var(--p2-ink);
    font: inherit;
    font-size: 16px;
  }
  .p2-send {
    border: 0;
    border-radius: 10px;
    padding: 0 14px;
    background: var(--p2-accent);
    color: var(--p2-accent-ink);
    font: inherit;
    font-weight: 600;
    cursor: pointer;
  }
  .p2-send:disabled { opacity: .5; cursor: default; }
  @media (prefers-reduced-motion: no-preference) {
    .p2-panel { animation: p2in .15s ease-out; }
    @keyframes p2in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
  }
  `;

  var style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  var root = document.createElement("div");
  root.className = "p2-root" + (HIDE_BUTTON ? " p2-hide-button" : "") + (PIXEL_TRIGGER ? " p2-pixel-trigger" : "");
  root.innerHTML =
    '<button class="p2-btn" type="button" aria-expanded="false" aria-controls="p2-chat-panel">Spørg om William</button>' +
    '<section class="p2-panel" id="p2-chat-panel" role="dialog" aria-labelledby="p2-chat-title">' +
    '<div class="p2-head"><div><div class="p2-title" id="p2-chat-title">Spørg om William</div>' +
    '<div class="p2-sub">AI-assistent, ikke William selv</div></div>' +
    '<button class="p2-close" type="button" aria-label="Luk chat">×</button></div>' +
    '<div class="p2-log" aria-live="polite"></div>' +
    '<form class="p2-form"><input class="p2-input" type="text" maxlength="' + MAX_CHARS +
    '" placeholder="Skriv dit spørgsmål" aria-label="Dit spørgsmål" autocomplete="off">' +
    '<button class="p2-send" type="submit">Send</button></form>' +
    '<div class="p2-footnote">Skriv ikke følsomme oplysninger. Beskeder behandles af en AI-udbyder.</div></section>';
  document.body.appendChild(root);

  var openBtn = root.querySelector(".p2-btn");
  var closeBtn = root.querySelector(".p2-close");
  var log = root.querySelector(".p2-log");
  var form = root.querySelector(".p2-form");
  var input = root.querySelector(".p2-input");
  var send = root.querySelector(".p2-send");
  var pixelTrigger = document.querySelector(".pixel-chat .pw");

  function add(kind, text) {
    var el = document.createElement("div");
    el.className = "p2-msg " + kind;
    el.textContent = text;
    log.appendChild(el);
    log.scrollTop = log.scrollHeight;
    return el;
  }

  function addContactNote(prefix) {
    var el = document.createElement("div");
    el.className = "p2-msg note";
    el.appendChild(document.createTextNode(prefix + " "));
    var a = document.createElement("a");
    a.href = CONTACT;
    a.textContent = "Brug kontaktsektionen";
    el.appendChild(a);
    log.appendChild(el);
    log.scrollTop = log.scrollHeight;
  }

  function setOpen(open) {
    root.classList.toggle("open", open);
    openBtn.setAttribute("aria-expanded", String(open));
    if (open) {
      evt("open");
      if (!log.children.length) {
        add("bot", "Hej! Spørg mig om Williams uddannelse, projekter, erfaring eller fotografi.");
        log.scrollTop = 0;
      }
      input.focus();
    } else {
      evt("done");
      (pixelTrigger || openBtn).focus();
    }
  }

  openBtn.addEventListener("click", function () { setOpen(true); });
  closeBtn.addEventListener("click", function () { setOpen(false); });
  window.addEventListener("williamchat:toggle", function () {
    setOpen(!root.classList.contains("open"));
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && root.classList.contains("open")) setOpen(false);
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var text = input.value.trim();
    if (!text || busy) return;
    if (history.length + 1 >= MAX_MESSAGES) {
      addContactNote("Samtalen er nået sin grænse.");
      input.disabled = true;
      send.disabled = true;
      return;
    }

    input.value = "";
    add("user", text);
    history.push({ role: "user", content: text });
    busy = true;
    send.disabled = true;
    var wait = add("bot", "…");
    evt("thinking");

    var controller = new AbortController();
    var timer = setTimeout(function () { controller.abort(); }, TIMEOUT_MS);

    fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({ messages: history }),
      signal: controller.signal
    })
      .then(function (r) {
        return r.json().then(function (d) { return { ok: r.ok, data: d }; });
      })
      .then(function (res) {
        if (res.ok && res.data.reply) {
          wait.textContent = res.data.reply;
          evt("reply");
          history.push({ role: "assistant", content: res.data.reply });
        } else {
          wait.remove();
          evt("done");
          history.pop();
          add("note", (res.data && res.data.error) || "Noget gik galt.");
          addContactNote("Eller:");
        }
      })
      .catch(function () {
        wait.remove();
        evt("done");
        history.pop();
        add("note", "Kunne ikke få forbindelse.");
        addContactNote("Prøv igen senere eller:");
      })
      .then(function () {
        clearTimeout(timer);
        busy = false;
        send.disabled = false;
        input.focus();
      });
  });

  // Luk panelet, hvis siden skifter til print.
  window.addEventListener("beforeprint", function () {
    if (root.classList.contains("open")) setOpen(false);
  });
})();
