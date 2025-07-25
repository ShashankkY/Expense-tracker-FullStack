document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "login.html";
    return;
  }

  const logoutBtn = document.getElementById("logoutBtn");
  const premiumStatus = document.getElementById("premiumStatus");
  const list = document.getElementById("expenseList");
  const form = document.getElementById("expenseForm");
  const amountInput = document.getElementById("amount");
  const descInput = document.getElementById("description");
  const catInput = document.getElementById("category");

  let editingExpenseId = null;

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("token");
      window.location.href = "login.html";
    });
  }

  async function verifyPremiumStatus() {
    try {
      const res = await fetch("http://localhost:3000/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();

      if (data.isPremium) {
        premiumStatus.innerHTML = `<span class="crown">👑</span> Premium User`;
        fetchExpenses();
        loadLeaderboard();
      } else {
        alert("You're not a premium user. Redirecting...");
        window.location.href = "expense.html";
      }
    } catch (err) {
      console.error("Profile check failed:", err);
      window.location.href = "login.html";
    }
  }

  async function loadLeaderboard() {
    try {
      const res = await fetch("http://localhost:3000/api/premium/leaderboard", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const users = await res.json();
      const list = document.getElementById("leaderboardList");
      list.innerHTML = "";

      users.forEach((user, index) => {
        const li = document.createElement("li");
        li.innerHTML = `<strong>${index + 1}. ${user.name}</strong> - ₹${user.totalExpense || 0}`;
        list.appendChild(li);
      });
    } catch (err) {
      console.error("Leaderboard error:", err);
    }
  }

  async function fetchExpenses() {
    try {
      const res = await fetch("http://localhost:3000/api/expenses", {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();
      console.log("Fetched expense data:", data);

      if (!Array.isArray(data)) throw new Error("Invalid data format");

      list.innerHTML = "";
      data.forEach(exp => addExpenseToDOM(exp));
      updateTotal();
    } catch (err) {
      console.error("Fetch expenses error:", err);
    }
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const expense = {
      amount: parseFloat(amountInput.value),
      description: descInput.value.trim(),
      category: catInput.value.trim()
    };

    if (!expense.amount || !expense.description || !expense.category) {
      alert("All fields are required!");
      return;
    }

    try {
      let res;
      if (editingExpenseId) {
        res = await fetch(`http://localhost:3000/api/expenses/${editingExpenseId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(expense)
        });

        const updatedExpense = await res.json();
        updateExpenseInDOM(updatedExpense);
        editingExpenseId = null;
      } else {
        res = await fetch("http://localhost:3000/api/expenses", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(expense)
        });

        const newExpense = await res.json();
        addExpenseToDOM(newExpense);
      }

      form.reset();
      updateTotal();
      loadLeaderboard();
    } catch (err) {
      console.error("Error saving expense:", err);
    }
  });

  function addExpenseToDOM(expense) {
    console.log("Expense received:", expense);

    const existing = document.getElementById(`expense-${expense.id}`);
    if (existing) existing.remove();

    const li = document.createElement("li");
    li.className = "expense-item";
    li.id = `expense-${expense.id}`;

    const amount = expense?.amount ?? 0;
    const category = expense?.category ?? "N/A";
    const description = expense?.description ?? "N/A";

    const span = document.createElement("span");
    span.textContent = `${amount} ₹ - ${category} - ${description}`;

    const editBtn = document.createElement("button");
    editBtn.textContent = "✏️ Edit";
    editBtn.className = "edit-btn";
    editBtn.onclick = () => {
      amountInput.value = amount;
      descInput.value = description;
      catInput.value = category;
      editingExpenseId = expense.id;
    };

    const delBtn = document.createElement("button");
    delBtn.textContent = "🗑️ Delete";
    delBtn.className = "delete-btn";
    delBtn.onclick = async () => {
      try {
        await fetch(`http://localhost:3000/api/expenses/${expense.id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` }
        });
        li.remove();
        updateTotal();
        loadLeaderboard();
      } catch (err) {
        console.error("Delete error:", err);
      }
    };

    li.appendChild(span);
    li.appendChild(editBtn);
    li.appendChild(delBtn);
    list.appendChild(li);
  }

  function updateExpenseInDOM(expense) {
    addExpenseToDOM(expense);
  }

  function updateTotal() {
    const items = document.querySelectorAll(".expense-item span");
    let total = 0;

    items.forEach(item => {
      const match = item.textContent.match(/^(\d+(\.\d+)?) ₹/);
      if (match) {
        total += parseFloat(match[1]);
      }
    });

    const totalBox = document.getElementById("totalExpense");
    if (totalBox) {
      const formatted = total.toLocaleString("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 2
      });

      totalBox.style.opacity = 0;
      setTimeout(() => {
        totalBox.textContent = `Total: ${formatted}`;
        totalBox.style.opacity = 1;
      }, 200);
    }
  }

  verifyPremiumStatus();
});
