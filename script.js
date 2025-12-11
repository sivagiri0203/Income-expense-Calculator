let entries = JSON.parse(localStorage.getItem("entries")) || [];
let editId = null;

const descInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");
const entryList = document.getElementById("entry-list");

document.getElementById("add-btn").addEventListener("click", addEntry);
document.getElementById("reset-btn").addEventListener("click", resetInputs);

document.querySelectorAll("input[name='filter']").forEach(radio => {
  radio.addEventListener("change", renderEntries);
});

function addEntry() {
  const description = descInput.value.trim();
  const amount = Number(amountInput.value);
  const type = typeInput.value;

  if (!description || !amount) {
    alert("Please fill all fields!");
    return;
  }

  const newEntry = { id: Date.now(), description, amount, type };

  if (editId) {
    const index = entries.findIndex(item => item.id === editId);
    entries[index] = newEntry;
    editId = null;
  } else {
    entries.push(newEntry);
  }

  saveToLocal();
  renderEntries();
  resetInputs();
}

function resetInputs() {
  descInput.value = "";
  amountInput.value = "";
  typeInput.value = "income";
}

function editEntry(id) {
  const entry = entries.find(item => item.id === id);
  descInput.value = entry.description;
  amountInput.value = entry.amount;
  typeInput.value = entry.type;
  editId = id;
}

function deleteEntry(id) {
  entries = entries.filter(item => item.id !== id);
  saveToLocal();
  renderEntries();
}

function saveToLocal() {
  localStorage.setItem("entries", JSON.stringify(entries));
}

function calculateTotals() {
  let income = 0, expense = 0;

  entries.forEach(item => {
    item.type === "income" ? income += item.amount : expense += item.amount;
  });

  document.getElementById("total-income").textContent = "₹" + income;
  document.getElementById("total-expense").textContent = "₹" + expense;
  document.getElementById("net-balance").textContent = "₹" + (income - expense);
}

function renderEntries() {
  entryList.innerHTML = "";
  const filter = document.querySelector("input[name='filter']:checked").value;

  const filteredEntries = entries.filter(item =>
    filter === "all" ? true : item.type === filter
  );

  filteredEntries.forEach(item => {
    const li = document.createElement("li");
    li.classList.add("entry");

    li.innerHTML = `
      <span>${item.description}</span>
      <span class="amount ${item.type}">₹${item.amount}</span>
      <div class="actions">
        <button class="edit" onclick="editEntry(${item.id})">Edit</button>
        <button class="delete" onclick="deleteEntry(${item.id})">Delete</button>
      </div>
    `;

    entryList.appendChild(li);
  });

  calculateTotals();
}

renderEntries();