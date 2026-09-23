// ---- Config: edit these ----
const CONTACT_EMAIL = "sales@preflexsol.com";
const CURRENCY = { locale: "en-IN", code: "INR" };

// Placeholder catalogue. price: null => "Request quote".
const PRODUCTS = [
  { id: "tw-1", cat: "servers", icon: "server", name: "Entry Tower Server", specs: ["1 CPU, 16 GB RAM", "2 × 1 TB SATA, RAID 1", "Ideal for branch offices"], price: 68500 },
  { id: "rk-1", cat: "servers", icon: "server", name: "2U Rack Server – Dual CPU", specs: ["2 CPU, 128 GB RAM", "8 × SAS, hardware RAID", "Redundant power supplies"], price: 245000, was: 265000, badge: "Hot" },
  { id: "bl-1", cat: "servers", icon: "server", name: "Blade Enclosure Kit", specs: ["8-bay chassis", "Shared power & cooling", "Single management interface"], price: 680000 },
  { id: "gp-1", cat: "servers", icon: "server", name: "GPU Compute Server", specs: ["4 × GPU cards, NVMe", "For AI / ML & graphics", "High-airflow chassis"], price: 990000, badge: "New" },

  { id: "na-1", cat: "storage", icon: "storage", name: "8-Bay NAS", specs: ["File sharing over NFS / CIFS", "CCTV & archive friendly", "10 GbE ports"], price: 115000 },
  { id: "sn-1", cat: "storage", icon: "storage", name: "All-Flash SAN Array – 20 TB", specs: ["FC / iSCSI block storage", "For databases & mission-critical apps", "Dual controllers"], price: 1150000, badge: "Hot" },
  { id: "un-1", cat: "storage", icon: "storage", name: "Unified Storage – 50 TB", specs: ["File and block on one platform", "Snapshots & replication", "Scales with capacity"], price: 1490000 },
  { id: "fc-1", cat: "storage", icon: "network", name: "32G Fibre Channel SAN Switch", specs: ["24 ports", "Dedicated storage fabric", "Redundant PSU & fans"], price: 310000 },

  { id: "hc-1", cat: "hci", icon: "hci", name: "HCI Cluster – 3 Nodes", specs: ["Compute + storage + virtualization", "Single management console", "Scale out node by node"], price: 1850000, badge: "Popular" },
  { id: "hc-2", cat: "hci", icon: "hci", name: "HCI Edge Kit – 2 Nodes", specs: ["Remote / branch office", "VDI & dev-test ready", "Simple deployment"], price: null },

  { id: "bk-1", cat: "protection", icon: "shield", name: "Disk Backup Appliance – 50 TB", specs: ["Deduplicated backup to disk", "Fast restore", "Replication to a second site"], price: 760000 },
  { id: "bk-2", cat: "protection", icon: "shield", name: "Tape Library – 24 Slot", specs: ["Low-cost long-term retention", "Archive & off-site vaulting", "Barcode reader"], price: 420000 },
  { id: "bk-3", cat: "protection", icon: "shield", name: "Cyber Recovery Vault", specs: ["Air-gapped copy of critical data", "Ransomware recovery", "Analysis & reporting"], price: null, badge: "Quote" },

  { id: "nw-1", cat: "network", icon: "network", name: "10G Network Switch – 24 Port", specs: ["24 × SFP+", "Layer 3 features", "Rack-mount 1U"], price: 135000 },
  { id: "nw-2", cat: "network", icon: "network", name: "Next-Gen Firewall – HA Pair", specs: ["Threat prevention", "High-availability ready", "1U appliance"], price: 185000 },

  { id: "cl-1", cat: "cloud", icon: "cloud", name: "Cloud Backup – per TB / month", specs: ["Off-site copy of your backups", "Pay only for what you store", "Encrypted in transit and at rest"], price: 1800, unit: "/TB/mo" },
  { id: "cl-2", cat: "cloud", icon: "cloud", name: "Cloud Disaster Recovery", specs: ["Replicate to the cloud", "Defined recovery targets", "Tested failover plans"], price: null }
];

const CAT_LABEL = { servers: "Servers", storage: "Storage", hci: "HCI", protection: "Data Protection", network: "Networking", cloud: "Cloud" };

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const fmt = n => new Intl.NumberFormat(CURRENCY.locale, { style: "currency", currency: CURRENCY.code, maximumFractionDigits: 0 }).format(n);
const byId = id => PRODUCTS.find(p => p.id === id);

// ---- Catalogue ----
let state = { cat: "all", q: "" };

function renderProducts() {
  const q = state.q.trim().toLowerCase();
  const list = PRODUCTS.filter(p =>
    (state.cat === "all" || p.cat === state.cat) &&
    (!q || (p.name + " " + p.specs.join(" ") + " " + CAT_LABEL[p.cat]).toLowerCase().includes(q))
  );
  const grid = $("#productGrid");
  grid.innerHTML = list.map(p => `
    <article class="product">
      <div class="p-img"><svg class="i"><use href="#i-${p.icon}"/></svg>${p.badge ? `<span class="badge">${p.badge}</span>` : ""}</div>
      <div class="p-body">
        <span class="p-cat">${CAT_LABEL[p.cat]}</span>
        <h3 class="p-name">${p.name}</h3>
        <ul class="p-specs">${p.specs.map(s => `<li>${s}</li>`).join("")}</ul>
        <div class="p-foot">
          ${p.price == null
            ? `<span class="price quote">Request quote</span>`
            : `<span class="price">${p.was ? `<s>${fmt(p.was)}</s>` : ""}${fmt(p.price)}${p.unit ? `<small>${p.unit}</small>` : ""}</span>`}
          <button class="add" data-add="${p.id}">${p.price == null ? "Add to quote" : "Add to cart"}</button>
        </div>
      </div>
    </article>`).join("") || `<div class="empty">No products match “${escapeHtml(state.q)}”. <a href="#contact">Ask us</a> — we can source it.</div>`;

  const label = state.cat === "all" ? "all categories" : CAT_LABEL[state.cat];
  $("#resultNote").textContent = `${list.length} product${list.length === 1 ? "" : "s"} in ${label}${q ? ` matching “${state.q}”` : ""}`;
  $$("#filters .chip").forEach(c => c.classList.toggle("active", c.dataset.cat === state.cat));
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function setCat(cat) { state.cat = cat; state.q = ""; $("#searchInput").value = ""; $("#searchCat").value = cat; renderProducts(); }

// category links anywhere on the page
document.addEventListener("click", e => {
  const link = e.target.closest("a[data-cat]");
  if (link) setCat(link.dataset.cat);
});
$("#filters").addEventListener("click", e => {
  const chip = e.target.closest(".chip");
  if (chip) setCat(chip.dataset.cat);
});
$("#searchForm").addEventListener("submit", e => {
  e.preventDefault();
  state.cat = $("#searchCat").value;
  state.q = $("#searchInput").value;
  renderProducts();
  $("#shop").scrollIntoView();
});

// ---- Cart ----
let cart = {};
try { cart = JSON.parse(localStorage.getItem("xyz-hardware-cart")) || {}; } catch (_) { cart = {}; }
// drop anything no longer in the catalogue
Object.keys(cart).forEach(id => { if (!byId(id)) delete cart[id]; });

function saveCart() { try { localStorage.setItem("xyz-hardware-cart", JSON.stringify(cart)); } catch (_) {} }
function cartCount() { return Object.values(cart).reduce((a, b) => a + b, 0); }

function renderCart() {
  const ids = Object.keys(cart);
  $("#cartCount").textContent = cartCount();
  const body = $("#cartItems");
  if (!ids.length) {
    body.innerHTML = `<p class="empty-cart">Your cart is empty.</p>`;
    $("#cartTotal").textContent = "—";
    return;
  }
  let total = 0, hasQuote = false;
  body.innerHTML = ids.map(id => {
    const p = byId(id), q = cart[id];
    if (p.price == null) hasQuote = true; else total += p.price * q;
    return `<div class="line-item">
      <h4>${p.name}</h4>
      <span class="lp">${p.price == null ? "Quote" : fmt(p.price * q)}</span>
      <div class="qty"><button data-dec="${id}" aria-label="Decrease quantity">−</button><span>${q}</span><button data-inc="${id}" aria-label="Increase quantity">+</button></div>
      <button class="rm" data-rm="${id}">Remove</button>
    </div>`;
  }).join("");
  $("#cartTotal").textContent = (total ? fmt(total) : "—") + (hasQuote ? " + quote items" : "");
}

function addToCart(id) { cart[id] = (cart[id] || 0) + 1; saveCart(); renderCart(); }

$("#productGrid").addEventListener("click", e => {
  const btn = e.target.closest("[data-add]");
  if (!btn) return;
  addToCart(btn.dataset.add);
  const original = btn.textContent;
  btn.textContent = "Added ✓"; btn.classList.add("added");
  setTimeout(() => { btn.textContent = original; btn.classList.remove("added"); }, 1200);
});

$("#cartItems").addEventListener("click", e => {
  const t = e.target;
  if (t.dataset.inc) cart[t.dataset.inc]++;
  else if (t.dataset.dec) { if (--cart[t.dataset.dec] <= 0) delete cart[t.dataset.dec]; }
  else if (t.dataset.rm) delete cart[t.dataset.rm];
  else return;
  saveCart(); renderCart();
});
$("#cartClear").addEventListener("click", () => { cart = {}; saveCart(); renderCart(); });

const drawer = $("#drawer"), scrim = $("#scrim");
function openCart() { drawer.classList.add("open"); drawer.setAttribute("aria-hidden", "false"); scrim.hidden = false; $("#cartClose").focus(); }
function closeCart() { drawer.classList.remove("open"); drawer.setAttribute("aria-hidden", "true"); scrim.hidden = true; $("#cartBtn").focus(); }
$("#cartBtn").addEventListener("click", openCart);
$("#cartClose").addEventListener("click", closeCart);
scrim.addEventListener("click", closeCart);
document.addEventListener("keydown", e => { if (e.key === "Escape" && drawer.classList.contains("open")) closeCart(); });

// Turn the cart into a quote request
$("#cartQuote").addEventListener("click", () => {
  const ids = Object.keys(cart);
  if (!ids.length) return;
  const lines = ids.map(id => `- ${cart[id]} × ${byId(id).name}`).join("\n");
  $("#message").value = `Please quote the following items:\n${lines}\n\nAdditional requirements:\n`;
  closeCart();
  $("#contact").scrollIntoView();
  $("#quoteForm [name=name]").focus({ preventScroll: true });
});

// ---- Quote form (opens the visitor's mail app; swap for a backend / form service when ready) ----
$("#quoteForm").addEventListener("submit", e => {
  e.preventDefault();
  const f = e.target.elements, note = $("#formNote");
  const name = f.name.value.trim(), email = f.email.value.trim();
  f.name.classList.toggle("invalid", !name);
  f.email.classList.toggle("invalid", !/^\S+@\S+\.\S+$/.test(email));
  if (!name || !/^\S+@\S+\.\S+$/.test(email)) { note.textContent = "Please enter your name and a valid email."; return; }

  const body = [
    `Name: ${name}`, `Company: ${f.company.value.trim()}`, `Email: ${email}`, `Phone: ${f.phone.value.trim()}`,
    `Interested in: ${f.interest.value}`, `Capacity / quantity: ${f.capacity.value.trim()}`, "", f.message.value.trim()
  ].join("\n");
  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Quote request – " + f.interest.value)}&body=${encodeURIComponent(body)}`;
  note.textContent = "Opening your email app… if nothing happens, write to " + CONTACT_EMAIL + ".";
});

$("#year").textContent = new Date().getFullYear();
renderProducts();
renderCart();
