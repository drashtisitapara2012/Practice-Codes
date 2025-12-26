
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
const dateInput = document.getElementById("date") as HTMLInputElement | null;

const tableBody = document.querySelector("#expenseTable tbody") as HTMLTableSectionElement | null;

const searchInput = document.getElementById("search") as HTMLInputElement | null;
const searchWrapper = document.querySelector(".search-wrapper") as HTMLDivElement | null;
const searchIcon = document.getElementById("searchToggle") as HTMLElement | null;


//Search
if (searchIcon && searchWrapper && searchInput) {
    searchIcon.addEventListener("click", () => {
        searchWrapper.classList.toggle("active");
        searchInput.focus();
    });

    searchInput.addEventListener("input", () => {
        const query = searchInput.value.toLowerCase();
        const filtered = expenses.filter(exp =>
            exp.title.toLowerCase().includes(query) ||
            exp.category.toLowerCase().includes(query)
        );
        renderExpenses(filtered);
    });
}

//Render

function renderExpenses(list: Expense[]) {
    if (!tableBody) return;

    tableBody.innerHTML = "";

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

//Calculate Total
function updateTotalExpense(expenses: Expense[]) {
    const totalEl = document.getElementById("totalExpense");
    if (!totalEl) return;

    const total = expenses.reduce(
        (sum, exp) => sum + exp.amount,
        0
    );

    totalEl.textContent = `Total: ₹${total}`;
}

//Delete

function deleteExpense(id: number) {
    if (!confirm("Are you sure you want to delete this expense?")) return;
    expenses = expenses.filter(exp => exp.id !== id);
    saveExpenses(expenses);
    renderExpenses(expenses);
    updateTotalExpense(expenses);
    renderCategoryChart(expenses);
}
(window as any).deleteExpense = deleteExpense;



function editExpense(id: number) {
    localStorage.setItem("editExpenseId", id.toString());
    window.location.href = "Edit.html";
}
(window as any).editExpense = editExpense;

//Add or Edit

if (form && titleInput && amountInput && categoryInput && dateInput) {

    const editId = localStorage.getItem("editExpenseId");


    if (editId) {
        const exp = expenses.find(e => e.id === Number(editId));
        if (exp) {
            titleInput.value = exp.title;
            amountInput.value = exp.amount.toString();
            categoryInput.value = exp.category;
            dateInput.value = exp.date;
        }
    }

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        if (editId) {

            expenses = expenses.map(exp =>
                exp.id === Number(editId)
                    ? {
                        ...exp,
                        title: titleInput.value,
                        amount: Number(amountInput.value),
                        category: categoryInput.value,
                        date: dateInput.value
                    }
                    : exp
            );

            localStorage.removeItem("editExpenseId");
        } else {

            const newExpense: Expense = {
                id: Date.now(),
                title: titleInput.value,
                amount: Number(amountInput.value),
                category: categoryInput.value,
                date: dateInput.value,
            };
            expenses.push(newExpense);
        }

        saveExpenses(expenses);
        window.location.href = "index.html";
    });
}

//Chart
function getCategoryData(expenses: Expense[]) {
    const categoryTotals: Record<string, number> = {};

    expenses.forEach(exp => {
        categoryTotals[exp.category] =
            (categoryTotals[exp.category] || 0) + exp.amount;
    });

    const labels = Object.keys(categoryTotals);
    const data = labels.map(label => categoryTotals[label]);

    return {
        labels,
        data
    };
}
function renderCategoryChart(expenses: Expense[]) {
    const canvas = document.getElementById("categoryChart") as HTMLCanvasElement | null;
    if (!canvas) return;

    const { labels, data } = getCategoryData(expenses);

    if (categoryChart) {
        categoryChart.destroy();
    }

    categoryChart = new Chart(canvas, {
        type: "pie",
        data: {
            labels,
            datasets: [
                {
                    data,
                    backgroundColor: [
                        "#4f46e5",
                        "#22c55e",
                        "#f97316",
                        "#ef4444",
                        "#0ea5e9"
                    ]
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: "bottom"
                }
            }
        }
    });
}



function redirectToAddPage() {
    localStorage.removeItem("editExpenseId");
    window.location.href = "Add.html";
}
(window as any).redirectToAddPage = redirectToAddPage;
