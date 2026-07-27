// ============================================================
// सक्षम — SAKSHAM  |  Admin dashboard logic
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
  const loginWrap = document.querySelector("#loginWrap");
  const dashboard = document.querySelector("#dashboard");
  const loginForm = document.querySelector("#loginForm");
  const loginError = document.querySelector("#loginError");
  const logoutBtn = document.querySelector("#logoutBtn");
  const tableBody = document.querySelector("#regTableBody");
  const emptyState = document.querySelector("#emptyState");
  const exportBtn = document.querySelector("#exportBtn");
  const refreshBtn = document.querySelector("#refreshBtn");

  let currentRows = [];
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
    loadData();
  }

  function showLogin() {
    dashboard.style.display = "none";
    loginWrap.style.display = "flex";
  }

  function renderStats(rows) {
    const participants = rows.filter(r => r.type === "Participant").length;
    const stalls = rows.filter(r => r.type === "Stall").length;
    const total = rows.reduce((sum, r) => sum + (parseInt(r.fee, 10) || 0), 0);
    document.querySelector("#statTotal").textContent = rows.length;
    document.querySelector("#statParticipants").textContent = participants;
    document.querySelector("#statStalls").textContent = stalls;
    document.querySelector("#statAmount").textContent = "₹" + total.toLocaleString("en-IN");
  }

  function renderTable(rows) {
    if (!rows.length) {
      tableBody.innerHTML = "";
      emptyState.style.display = "block";
      return;
    }
    emptyState.style.display = "none";
    tableBody.innerHTML = rows.map(r => `
      <tr>
        <td data-label="Date">${escapeHtml(fmtDate(r.createdAt))}</td>
        <td data-label="Name">${escapeHtml(r.name)}</td>
        <td data-label="Phone">${escapeHtml(r.phone)}</td>
        <td data-label="Email">${escapeHtml(r.email)}</td>
        <td data-label="Type">${escapeHtml(r.type)}</td>
        <td data-label="Competition / Stall">${escapeHtml(r.detail)}</td>
        <td data-label="Fee">₹${escapeHtml(r.fee)}</td>
        <td data-label="Payment Ref">${escapeHtml(r.paymentRef || "-")}</td>
      </tr>
    `).join("");
  }

  async function loadData() {
    tableBody.innerHTML = '<tr><td colspan="8" style="text-align:center;">Loading...</td></tr>';
    emptyState.style.display = "none";
    try {
      currentRows = await window.sakshamFetchRegistrations();
      renderTable(currentRows);
      renderStats(currentRows);
    } catch (err) {
      tableBody.innerHTML = '<tr><td colspan="8" style="text-align:center;">Could not load data. Check your connection or Firestore rules.</td></tr>';
    }
  }

  refreshBtn.addEventListener("click", loadData);

  exportBtn.addEventListener("click", () => {
    if (!currentRows.length || typeof XLSX === "undefined") return;
    const data = currentRows.map(r => ({
      Date: fmtDate(r.createdAt),
      Name: r.name || "",
      Phone: r.phone || "",
      Email: r.email || "",
      Type: r.type || "",
      "Competition / Stall Type": r.detail || "",
      "Fee (Rs)": r.fee || "",
      "Payment Reference": r.paymentRef || ""
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Registrations");
    XLSX.writeFile(wb, "saksham-registrations.xlsx");
  });

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
