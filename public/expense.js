document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "login.html";
    return;
  }

  const logoutBtn = document.getElementById("logoutBtn");
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "login.html";
  });

  const form = document.getElementById("expenseForm");
  const list = document.getElementById("expenseList");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const expense = {
      amount: document.getElementById("amount").value,
      description: document.getElementById("description").value,
      category: document.getElementById("category").value
    };

    try {
      const response = await fetch("http://localhost:3000/api/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(expense)
      });

      const data = await response.json();
      addExpenseToDOM(data);
      form.reset();
    } catch (err) {
      console.error("Add Expense Error:", err);
    }
  });

  async function fetchExpenses() {
    try {
      const res = await fetch("http://localhost:3000/api/expenses", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      list.innerHTML = '';
      data.forEach(addExpenseToDOM);
    } catch (err) {
      console.error("Fetch Expenses Error:", err);
    }
  }

  function addExpenseToDOM(expense) {
    const li = document.createElement("li");
    li.className = "expense-item";
    li.innerHTML = `
      <span>${expense.amount} ₹ - ${expense.category} - ${expense.description}</span>
      <button class="delete-btn">❌</button>
    `;

    function addExpenseToDOM(expense) {
  const li = document.createElement("li");
  li.className = "expense-item";

  const span = document.createElement("span");
  span.textContent = `${expense.amount} ₹ - ${expense.category} - ${expense.description}`;

  const delBtn = document.createElement("button");
  delBtn.textContent = "❌";
  delBtn.className = "delete-btn";

  delBtn.onclick = async () => {
    try {
      await fetch(`http://localhost:3000/api/expenses/${expense.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      li.remove();
    } catch (err) {
      console.error("Delete Error:", err);
    }
  };

  li.appendChild(span);
  li.appendChild(delBtn);
  list.appendChild(li);
}


    list.appendChild(li);
  }

  fetchExpenses();
});
