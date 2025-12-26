var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
function getExpenses() {
    var data = localStorage.getItem("expenses");
    return data ? JSON.parse(data) : [];
}
function saveExpenses(expenses) {
    localStorage.setItem("expenses", JSON.stringify(expenses));
}
var expenses = getExpenses();
var categoryChart = null;
var form = document.getElementById("expenseForm");
var titleInput = document.getElementById("title");
var amountInput = document.getElementById("amount");
var categoryInput = document.getElementById("category");
var dateInput = document.getElementById("date");
var tableBody = document.querySelector("#expenseTable tbody");
var searchInput = document.getElementById("search");
var searchWrapper = document.querySelector(".search-wrapper");
var searchIcon = document.getElementById("searchToggle");
//Search
if (searchIcon && searchWrapper && searchInput) {
    searchIcon.addEventListener("click", function () {
        searchWrapper.classList.toggle("active");
        searchInput.focus();
    });
    searchInput.addEventListener("input", function () {
        var query = searchInput.value.toLowerCase();
        var filtered = expenses.filter(function (exp) {
            return exp.title.toLowerCase().includes(query) ||
                exp.category.toLowerCase().includes(query);
        });
        renderExpenses(filtered);
    });
}
//Render
function renderExpenses(list) {
    if (!tableBody)
        return;
    tableBody.innerHTML = "";
    list.forEach(function (exp) {
        var row = document.createElement("tr");
        row.innerHTML = "\n            <td>".concat(exp.title, "</td>\n            <td>").concat(exp.amount, "</td>\n            <td>").concat(exp.category, "</td>\n            <td>").concat(exp.date, "</td>\n            <td class=\"actions\">\n                <i class=\"fa-solid fa-pen-to-square\" onclick=\"editExpense(").concat(exp.id, ")\"></i>\n                <i class=\"fa-solid fa-trash\" onclick=\"deleteExpense(").concat(exp.id, ")\"></i>\n            </td>\n        ");
        tableBody.appendChild(row);
    });
}
if (tableBody) {
    renderExpenses(expenses);
    updateTotalExpense(expenses);
    renderCategoryChart(expenses);
}
//Calculate Total
function updateTotalExpense(expenses) {
    var totalEl = document.getElementById("totalExpense");
    if (!totalEl)
        return;
    var total = expenses.reduce(function (sum, exp) { return sum + exp.amount; }, 0);
    totalEl.textContent = "Total: \u20B9".concat(total);
}
//Delete
function deleteExpense(id) {
    if (!confirm("Are you sure you want to delete this expense?"))
        return;
    expenses = expenses.filter(function (exp) { return exp.id !== id; });
    saveExpenses(expenses);
    renderExpenses(expenses);
    updateTotalExpense(expenses);
    renderCategoryChart(expenses);
}
window.deleteExpense = deleteExpense;
function editExpense(id) {
    localStorage.setItem("editExpenseId", id.toString());
    window.location.href = "Edit.html";
}
window.editExpense = editExpense;
//Add or Edit
if (form && titleInput && amountInput && categoryInput && dateInput) {
    var editId_1 = localStorage.getItem("editExpenseId");
    if (editId_1) {
        var exp = expenses.find(function (e) { return e.id === Number(editId_1); });
        if (exp) {
            titleInput.value = exp.title;
            amountInput.value = exp.amount.toString();
            categoryInput.value = exp.category;
            dateInput.value = exp.date;
        }
    }
    form.addEventListener("submit", function (e) {
        e.preventDefault();
        if (editId_1) {
            expenses = expenses.map(function (exp) {
                return exp.id === Number(editId_1)
                    ? __assign(__assign({}, exp), { title: titleInput.value, amount: Number(amountInput.value), category: categoryInput.value, date: dateInput.value }) : exp;
            });
            localStorage.removeItem("editExpenseId");
        }
        else {
            var newExpense = {
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
function getCategoryData(expenses) {
    var categoryTotals = {};
    expenses.forEach(function (exp) {
        categoryTotals[exp.category] =
            (categoryTotals[exp.category] || 0) + exp.amount;
    });
    var labels = Object.keys(categoryTotals);
    var data = labels.map(function (label) { return categoryTotals[label]; });
    return {
        labels: labels,
        data: data
    };
}
function renderCategoryChart(expenses) {
    var canvas = document.getElementById("categoryChart");
    if (!canvas)
        return;
    var _a = getCategoryData(expenses), labels = _a.labels, data = _a.data;
    if (categoryChart) {
        categoryChart.destroy();
    }
    categoryChart = new Chart(canvas, {
        type: "pie",
        data: {
            labels: labels,
            datasets: [
                {
                    data: data,
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
window.redirectToAddPage = redirectToAddPage;
