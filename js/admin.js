// ============================================================
// सक्षम — SAKSHAM  |  Admin dashboard logic
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
  const loginWrap = document.querySelector("#loginWrap");
  const dashboard = document.querySelector("#dashboard");
  const loginForm = document.querySelector("#loginForm");
  const loginError = document.querySelector("#loginError");
  const logoutBtn = document.querySelector("#logoutBtn");

  let stallRows = [];
  let compRows = [];
  let authReady = false;

  function escapeHtml(str) {
    return String(str ?? "").replace(/[&<>"']/g, c => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));
  }

  function fmtDate(ts) {
    if (!ts) return "-";
    const d = typeof ts.toDate === "function" ? ts.toDate() : new Date(ts);
    if (isNaN(d.getTime())) return "-";
    return d.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
  }

  function showDashboard() {
    loginWrap.style.display = "none";
    dashboard.style.display = "block";
    loadStalls();
    loadCompetitions();
  }

  function showLogin() {
    dashboard.style.display = "none";
    loginWrap.style.display = "flex";
  }

  /* ---------- Tabs ---------- */
  document.querySelectorAll(".admin-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".admin-tab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      document.querySelectorAll(".admin-tab-panel").forEach(p => p.style.display = "none");
      document.querySelector("#tab-" + tab.dataset.tab).style.display = "block";
    });
  });

  document.querySelectorAll(".refresh-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      if (btn.dataset.target === "stalls") loadStalls();
      else loadCompetitions();
    });
  });

  /* ---------- Stalls ---------- */
  async function loadStalls() {
    const tbody = document.querySelector("#stallTableBody");
    tbody.innerHTML = '<tr><td colspan="14" style="text-align:center;">Loading...</td></tr>';
    document.querySelector("#stallEmptyState").style.display = "none";
    try {
      stallRows = await window.sakshamFetchStallBookings();
      renderStallStats(stallRows);
      renderStallTable(stallRows);
    } catch (err) {
      tbody.innerHTML = '<tr><td colspan="14" style="text-align:center;">Could not load data. Check your connection or Firestore rules.</td></tr>';
    }
  }

  function renderStallStats(rows) {
    const ac = rows.filter(r => r.hallType === "AC").length;
    const nonAc = rows.filter(r => r.hallType === "NonAC").length;
    const collected = rows.reduce((sum, r) => sum + (parseInt(r.amountPaid, 10) || 0), 0);
    const remaining = rows.reduce((sum, r) => sum + (parseInt(r.remaining, 10) || 0), 0);
    document.querySelector("#stallStatTotal").textContent = rows.length;
    document.querySelector("#stallStatAC").textContent = ac;
    document.querySelector("#stallStatNonAC").textContent = nonAc;
    document.querySelector("#stallStatCollected").textContent = "₹" + collected.toLocaleString("en-IN");
    document.querySelector("#stallStatRemaining").textContent = "₹" + remaining.toLocaleString("en-IN");
  }

  function renderStallTable(rows) {
    const tbody = document.querySelector("#stallTableBody");
    const empty = document.querySelector("#stallEmptyState");
    if (!rows.length) {
      tbody.innerHTML = "";
      empty.style.display = "block";
      return;
    }
    empty.style.display = "none";
    tbody.innerHTML = rows.map(r => `
      <tr>
        <td data-label="Date">${escapeHtml(fmtDate(r.createdAt))}</td>
        <td data-label="Hall">${escapeHtml(r.hallType)}</td>
        <td data-label="Stall #">${escapeHtml(r.stallNumber)}</td>
        <td data-label="Business">${escapeHtml(r.businessName)}</td>
        <td data-label="Category">${escapeHtml(r.category)}</td>
        <td data-label="Phone">${escapeHtml(r.phone)}</td>
        <td data-label="Email">${escapeHtml(r.email || "-")}</td>
        <td data-label="Fee">₹${escapeHtml(r.fee)}</td>
        <td data-label="Paid">₹${escapeHtml(r.amountPaid)}</td>
        <td data-label="Remaining">${r.remaining ? "₹" + escapeHtml(r.remaining) : "Fully Paid"}</td>
        <td data-label="Payment Ref">${escapeHtml(r.paymentRef || "-")}</td>
        <td data-label="Aadhar">${escapeHtml(r.aadhar || "-")}</td>
        <td data-label="FSSAI">${escapeHtml(r.fssai || "-")}</td>
        <td data-label="Actions"><button class="btn-delete" data-id="${r.id}" data-kind="stall" data-hall="${escapeHtml(r.hallType)}" data-stall="${escapeHtml(r.stallNumber)}">Delete</button></td>
      </tr>
    `).join("");
  }

  /* ---------- Competitions ---------- */
  async function loadCompetitions() {
    const tbody = document.querySelector("#compTableBody");
    tbody.innerHTML = '<tr><td colspan="9" style="text-align:center;">Loading...</td></tr>';
    document.querySelector("#compEmptyState").style.display = "none";
    try {
      compRows = await window.sakshamFetchRegistrations();
      renderCompStats(compRows);
      renderCompTable(compRows);
    } catch (err) {
      tbody.innerHTML = '<tr><td colspan="9" style="text-align:center;">Could not load data. Check your connection or Firestore rules.</td></tr>';
    }
  }

  function renderCompStats(rows) {
    const entries = rows.reduce((sum, r) => sum + ((r.competitions && r.competitions.length) || 0), 0);
    const collected = rows.reduce((sum, r) => sum + (parseInt(r.fee, 10) || 0), 0);
    document.querySelector("#compStatTotal").textContent = rows.length;
    document.querySelector("#compStatEntries").textContent = entries;
    document.querySelector("#compStatCollected").textContent = "₹" + collected.toLocaleString("en-IN");
  }

  function renderCompTable(rows) {
    const tbody = document.querySelector("#compTableBody");
    const empty = document.querySelector("#compEmptyState");
    if (!rows.length) {
      tbody.innerHTML = "";
      empty.style.display = "block";
      return;
    }
    empty.style.display = "none";
    tbody.innerHTML = rows.map(r => `
      <tr>
        <td data-label="Date">${escapeHtml(fmtDate(r.createdAt))}</td>
        <td data-label="Name">${escapeHtml(r.name)}</td>
        <td data-label="Age">${escapeHtml(r.age || "-")}</td>
        <td data-label="Phone">${escapeHtml(r.phone)}</td>
        <td data-label="Email">${escapeHtml(r.email || "-")}</td>
        <td data-label="Competitions">${escapeHtml((r.competitions || []).join(", "))}</td>
        <td data-label="Fee">₹${escapeHtml(r.fee)}</td>
        <td data-label="Payment Ref">${escapeHtml(r.paymentRef || "-")}</td>
        <td data-label="Actions"><button class="btn-delete" data-id="${r.id}" data-kind="competition">Delete</button></td>
      </tr>
    `).join("");
  }

  /* ---------- Delete (event delegation, rows re-render on refresh) ---------- */
  document.addEventListener("click", async (e) => {
    const btn = e.target.closest(".btn-delete");
    if (!btn) return;
    const id = btn.dataset.id;
    const kind = btn.dataset.kind;
    if (!confirm("Delete this entry? This cannot be undone.")) return;
    btn.disabled = true;
    btn.textContent = "Deleting...";
    try {
      if (kind === "stall") {
        await window.sakshamDeleteStallBooking(id, btn.dataset.hall, parseInt(btn.dataset.stall, 10));
        loadStalls();
      } else {
        await window.sakshamDeleteRegistration(id);
        loadCompetitions();
      }
    } catch (err) {
      alert("Could not delete this entry. Please try again.");
      btn.disabled = false;
      btn.textContent = "Delete";
    }
  });

  /* ---------- Export to Excel (both sheets) ---------- */
  function exportAll() {
    if (typeof XLSX === "undefined") return;
    const wb = XLSX.utils.book_new();

    const stallData = stallRows.map(r => ({
      Date: fmtDate(r.createdAt),
      Hall: r.hallType,
      "Stall #": r.stallNumber,
      Business: r.businessName || "",
      Category: r.category || "",
      Phone: r.phone || "",
      Email: r.email || "",
      "Fee (Rs)": r.fee || "",
      "Paid (Rs)": r.amountPaid || "",
      "Remaining (Rs)": r.remaining || 0,
      "Payment Reference": r.paymentRef || "",
      Aadhar: r.aadhar || "",
      FSSAI: r.fssai || ""
    }));
    const wsStalls = XLSX.utils.json_to_sheet(stallData);
    XLSX.utils.book_append_sheet(wb, wsStalls, "Stall Bookings");

    const compData = compRows.map(r => ({
      Date: fmtDate(r.createdAt),
      Name: r.name || "",
      Age: r.age || "",
      Phone: r.phone || "",
      Email: r.email || "",
      Competitions: (r.competitions || []).join(", "),
      "Fee (Rs)": r.fee || "",
      "Payment Reference": r.paymentRef || ""
    }));
    const wsComp = XLSX.utils.json_to_sheet(compData);
    XLSX.utils.book_append_sheet(wb, wsComp, "Competition Registrations");

    XLSX.writeFile(wb, "saksham-registrations.xlsx");
  }
  document.querySelector("#exportBtn").addEventListener("click", exportAll);
  document.querySelector("#exportBtn2").addEventListener("click", exportAll);

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    loginError.style.display = "none";
    const username = document.querySelector("#adminUser").value;
    const password = document.querySelector("#adminPass").value;
    const btn = loginForm.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = "Signing in...";
    try {
      await window.sakshamAdminAuth.login(username, password);
    } catch (err) {
      loginError.textContent = "Invalid username or password.";
      loginError.style.display = "block";
    } finally {
      btn.disabled = false;
      btn.textContent = "Login";
    }
  });

  logoutBtn.addEventListener("click", () => {
    window.sakshamAdminAuth.logout();
  });

  // Wait for the Firebase module to register window.sakshamAdminAuth before wiring auth state.
  function waitForFirebase() {
    if (window.sakshamAdminAuth && !authReady) {
      authReady = true;
      window.sakshamAdminAuth.onState(user => {
        if (user) showDashboard();
        else showLogin();
      });
    } else if (!authReady) {
      setTimeout(waitForFirebase, 100);
    }
  }
  waitForFirebase();
});
