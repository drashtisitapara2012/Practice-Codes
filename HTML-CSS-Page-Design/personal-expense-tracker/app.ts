interface Expense {
    id: number;
    title: string;
    amount: number;
    category: string;
    date: string;
}

function getExpenses(): Expense[] {
    const data = localStorage.getItem("expenses");
    return data ? JSON.parse(data) : [];
}

function saveExpenses(expenses: Expense[]): void {
    localStorage.setItem("expenses", JSON.stringify(expenses));
}

let expenses: Expense[] = getExpenses();
let categoryChart: Chart | null = null;

const form = document.getElementById("expenseForm") as HTMLFormElement | null;

const titleInput = document.getElementById("title") as HTMLInputElement | null;
const amountInput = document.getElementById("amount") as HTMLInputElement | null;
const categoryInput = document.getElementById("category") as HTMLSelectElement | null;
const customCategoryInput = document.getElementById("customCategory") as HTMLInputElement | null;
const dateInput = document.getElementById("date") as HTMLInputElement | null;

if (dateInput) {
    const today = new Date().toISOString().split("T")[0];
    dateInput.max = today;
}

const tableBody = document.querySelector("#expenseTable tbody") as HTMLTableSectionElement | null;

const searchInput = document.getElementById("search") as HTMLInputElement | null;
const searchWrapper = document.querySelector(".search-wrapper") as HTMLDivElement | null;
const searchIcon = document.getElementById("searchToggle") as HTMLElement | null;
const searchCancel = document.getElementById("searchCancel") as HTMLElement | null;

const editId = localStorage.getItem("editExpenseId");
const formTitle = document.getElementById("formTitle");
const closeIcon = document.querySelector(".close-icon") as HTMLElement | null;

//close icon
if (closeIcon) {
    closeIcon.addEventListener("click", () => {
        localStorage.removeItem("editExpenseId");
        window.location.href = "index.html";
    });
}

if (editId && formTitle) {
    formTitle.textContent = "Edit Expense";
}

//Custom Category Toggle
if (categoryInput && customCategoryInput) {
    categoryInput.addEventListener("change", () => {
        if (categoryInput.value === "custom") {
            customCategoryInput.style.display = "block";
            customCategoryInput.focus();
        } else {
            customCategoryInput.style.display = "none";
            customCategoryInput.value = "";
        }
    });
}

//Search 
if (searchIcon && searchWrapper && searchInput) {
    searchIcon.addEventListener("click", () => {
        searchWrapper.classList.toggle("active");
        searchInput.focus();
    });

    searchInput.addEventListener("input", () => {
        const query = searchInput.value.toLowerCase();

        if (searchCancel) {
            searchCancel.style.display = query ? "block" : "none";
        }

        const filtered = expenses.filter(exp =>
            exp.title.toLowerCase().includes(query) ||
            exp.category.toLowerCase().includes(query)
        );

        renderExpenses(filtered);
        updateTotalExpense(filtered);
        renderCategoryChart(filtered);
    });
}

if (searchCancel && searchInput && searchWrapper) {
    searchCancel.addEventListener("click", () => {
        searchInput.value = "";
        searchCancel.style.display = "none";
        searchWrapper.classList.remove("active");

        renderExpenses(expenses);
        updateTotalExpense(expenses);
        renderCategoryChart(expenses);
    });
}

//Render Expenses
function renderExpenses(list: Expense[]) {
    if (!tableBody) return;

    tableBody.innerHTML = "";

    if (list.length === 0) {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td colspan="5" style="text-align:center; padding:16px; color:#666;">
                No expenses found
            </td>
        `;
        tableBody.appendChild(row);
        return;
    }

    list.forEach(exp => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${exp.title}</td>
            <td>${exp.amount}</td>
            <td>${exp.category}</td>
            <td>${exp.date}</td>
            <td class="actions">
                <i class="fa-solid fa-pen-to-square" onclick="editExpense(${exp.id})"></i>
                <i class="fa-solid fa-trash" onclick="deleteExpense(${exp.id})"></i>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

if (tableBody) {
    renderExpenses(expenses);
    updateTotalExpense(expenses);
    renderCategoryChart(expenses);
}

//Total Expense
function updateTotalExpense(list: Expense[]) {
    const totalEl = document.getElementById("totalExpense");
    if (!totalEl) return;

    const total = list.reduce((sum, exp) => sum + exp.amount, 0);
    totalEl.textContent = `Total: ₹${total}`;
}

//Delete Expense
function deleteExpense(id: number) {
    if (!confirm("Are you sure you want to delete this expense?")) return;

    const index = expenses.findIndex(exp => exp.id === id);
    if (index === -1) return;

    expenses.splice(index, 1);
    saveExpenses(expenses);

    renderExpenses(expenses);
    updateTotalExpense(expenses);
    renderCategoryChart(expenses);
}
(window as any).deleteExpense = deleteExpense;


function editExpense(id: number) {
    localStorage.setItem("editExpenseId", id.toString());
    window.location.href = "Add.html";
}
(window as any).editExpense = editExpense;

//Add & Edit Form Submission
if (form && titleInput && amountInput && categoryInput && dateInput) {

    if (editId) {
        const exp = expenses.find(e => e.id === Number(editId));
        if (exp) {
            titleInput.value = exp.title;
            amountInput.value = exp.amount.toString();
            dateInput.value = exp.date;

            const predefined = ["bill", "food", "shopping", "travel"];

            if (predefined.indexOf(exp.category) !== -1) {
                categoryInput.value = exp.category;
            } else {
                categoryInput.value = "custom";
                customCategoryInput!.style.display = "block";
                customCategoryInput!.value = exp.category;
            }
        }
    }

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const title = titleInput.value.trim();
        const amount = Number(amountInput.value);
        let category = categoryInput.value;
        const date = dateInput.value;
        const today = new Date().toISOString().split("T")[0];

        if (category === "custom") {
            category = customCategoryInput?.value.trim() || "";
        }

        if (!title || !category || !date || amount <= 0) {
            alert("Please enter valid values.");
            return;
        }

        if (date > today) {
            alert("Future dates are not allowed.");
            return;
        }

        const isDuplicate = expenses.some(exp =>
            exp.title.toLowerCase() === title.toLowerCase() &&
            exp.category === category &&
            exp.date === date &&
            exp.id !== Number(editId)
        );

        if (isDuplicate) {
            alert("This expense already exists.");
            return;
        }

        if (editId) {
            expenses = expenses.map(exp =>
                exp.id === Number(editId)
                    ? { ...exp, title, amount, category, date }
                    : exp
            );
            localStorage.removeItem("editExpenseId");
        } else {
            expenses.push({
                id: Date.now(),
                title,
                amount,
                category,
                date
            });
        }

        saveExpenses(expenses);
        window.location.href = "index.html";
    });
}

//Chart
function getCategoryData(list: Expense[]) {
    const totals: Record<string, number> = {};
    list.forEach(exp => {
        totals[exp.category] = (totals[exp.category] || 0) + exp.amount;
    });

    return {
        labels: Object.keys(totals),
        data: Object.values(totals)
    };
}

function renderCategoryChart(list: Expense[]) {
    const canvas = document.getElementById("categoryChart") as HTMLCanvasElement | null;
    if (!canvas) return;

    const { labels, data } = getCategoryData(list);

    if (categoryChart) categoryChart.destroy();

    categoryChart = new Chart(canvas, {
        type: "pie",
        data: {
            labels,
            datasets: [{
                data,
                backgroundColor: [
                    "#4f46e5",
                    "#22c55e",
                    "#f97316",
                    "#ef4444",
                    "#0ea5e9"
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { position: "bottom" } }
        }
    });
}

function redirectToAddPage() {
    localStorage.removeItem("editExpenseId");
    window.location.href = "Add.html";
}
(window as any).redirectToAddPage = redirectToAddPage;
