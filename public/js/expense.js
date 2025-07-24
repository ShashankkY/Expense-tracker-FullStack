document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "login.html";
    return;
  }

  const logoutBtn = document.getElementById("logoutBtn");
  const form = document.getElementById("expenseForm");
  const list = document.getElementById("expenseList");
  const amountInput = document.getElementById("amount");
  const descInput = document.getElementById("description");
  const catInput = document.getElementById("category");
  const buyBtn = document.getElementById("buyPremiumBtn");
  const premiumStatus = document.getElementById("premiumStatus");
  const premiumBanner = document.getElementById("premiumBanner");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("token");
      window.location.href = "login.html";
    });
  }

  let editingExpenseId = null;

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
    } catch (err) {
      console.error("Error saving expense:", err);
    }
  });

  async function fetchExpenses() {
    try {
      const res = await fetch("http://localhost:3000/api/expenses", {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();
      if (!Array.isArray(data)) throw new Error("Invalid data format from server");

      list.innerHTML = "";
      data.forEach(exp => addExpenseToDOM(exp));
      updateTotal();
    } catch (err) {
      console.error("Error fetching expenses:", err);
    }
  }

  function addExpenseToDOM(expense) {
    const existing = document.getElementById(`expense-${expense.id}`);
    if (existing) existing.remove();

    const li = document.createElement("li");
    li.className = "expense-item";
    li.id = `expense-${expense.id}`;

    const span = document.createElement("span");
    span.textContent = `${expense.amount} ₹ - ${expense.category} - ${expense.description}`;

    const editBtn = document.createElement("button");
    editBtn.textContent = "✏️ Edit";
    editBtn.className = "edit-btn";
    editBtn.onclick = () => {
      amountInput.value = expense.amount;
      descInput.value = expense.description;
      catInput.value = expense.category;
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
      } catch (err) {
        console.error("Delete Error:", err);
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

  // ✅ Handle Premium Upgrade (no Cashfree)
  if (buyBtn) {
    buyBtn.addEventListener("click", async () => {
      try {
        const res = await fetch("http://localhost:3000/api/auth/upgrade", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (!res.ok) throw new Error("Failed to upgrade");

        // Redirect to confirmation
        window.location.href = "paymentsuccess.html";
      } catch (err) {
        console.error("Upgrade failed:", err);
        alert("Something went wrong. Try again.");
      }
    });
  }

  async function checkPremiumStatus() {
    try {
      const res = await fetch("http://localhost:3000/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();
      if (data.isPremium) {
        premiumStatus.textContent = "🌟 Premium User";
        premiumBanner?.classList.add("visible");
        if (buyBtn) buyBtn.style.display = "none";
      }
    } catch (err) {
      console.error("Premium status fetch failed", err);
    }
  }

  fetchExpenses();
  checkPremiumStatus();
});
