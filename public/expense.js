document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "login.html"; // Restrict access
    return;
  }

  document.getElementById("expenseApp").style.display = "block";

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
    } catch (err) {
      console.error("Add Expense Error:", err);
    }
  });

  async function fetchExpenses() {
    const res = await fetch("http://localhost:3000/api/expenses", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const data = await res.json();
    data.forEach(addExpenseToDOM);
  }

  function addExpenseToDOM(expense) {
    const li = document.createElement("li");
    li.textContent = `${expense.amount} - ${expense.category} - ${expense.description}`;

    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete Expense";
    delBtn.onclick = async () => {
      await fetch(`http://localhost:3000/api/expenses/${expense.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      li.remove();
    };

    li.appendChild(delBtn);
    list.appendChild(li);
  }

  fetchExpenses();
});
