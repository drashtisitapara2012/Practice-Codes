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
var customCategoryInput = document.getElementById("customCategory");
var dateInput = document.getElementById("date");
if (dateInput) {
    var today = new Date().toISOString().split("T")[0];
    dateInput.max = today;
}
var tableBody = document.querySelector("#expenseTable tbody");
var searchInput = document.getElementById("search");
var searchWrapper = document.querySelector(".search-wrapper");
var searchIcon = document.getElementById("searchToggle");
var searchCancel = document.getElementById("searchCancel");
var editId = localStorage.getItem("editExpenseId");
var formTitle = document.getElementById("formTitle");
var closeIcon = document.querySelector(".close-icon");
//close icon
if (closeIcon) {
    closeIcon.addEventListener("click", function () {
        localStorage.removeItem("editExpenseId");
        window.location.href = "index.html";
    });
}
if (editId && formTitle) {
    formTitle.textContent = "Edit Expense";
}
//Custom Category Toggle
if (categoryInput && customCategoryInput) {
    categoryInput.addEventListener("change", function () {
        if (categoryInput.value === "custom") {
            customCategoryInput.style.display = "block";
            customCategoryInput.focus();
        }
        else {
            customCategoryInput.style.display = "none";
            customCategoryInput.value = "";
        }
    });
}
//Search 
if (searchIcon && searchWrapper && searchInput) {
    searchIcon.addEventListener("click", function () {
        searchWrapper.classList.toggle("active");
        searchInput.focus();
    });
    searchInput.addEventListener("input", function () {
        var query = searchInput.value.toLowerCase();
        if (searchCancel) {
            searchCancel.style.display = query ? "block" : "none";
        }
        var filtered = expenses.filter(function (exp) {
            return exp.title.toLowerCase().includes(query) ||
                exp.category.toLowerCase().includes(query);
        });
        renderExpenses(filtered);
        updateTotalExpense(filtered);
        renderCategoryChart(filtered);
    });
}
if (searchCancel && searchInput && searchWrapper) {
    searchCancel.addEventListener("click", function () {
        searchInput.value = "";
        searchCancel.style.display = "none";
        searchWrapper.classList.remove("active");
        renderExpenses(expenses);
        updateTotalExpense(expenses);
        renderCategoryChart(expenses);
    });
}
//Render Expenses
function renderExpenses(list) {
    if (!tableBody)
        return;
    tableBody.innerHTML = "";
    if (list.length === 0) {
        var row = document.createElement("tr");
        row.innerHTML = "\n            <td colspan=\"5\" style=\"text-align:center; padding:16px; color:#666;\">\n                No expenses found\n            </td>\n        ";
        tableBody.appendChild(row);
        return;
    }
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
//Total Expense
function updateTotalExpense(list) {
    var totalEl = document.getElementById("totalExpense");
    if (!totalEl)
        return;
    var total = list.reduce(function (sum, exp) { return sum + exp.amount; }, 0);
    totalEl.textContent = "Total: \u20B9".concat(total);
}
//Delete Expense
function deleteExpense(id) {
    if (!confirm("Are you sure you want to delete this expense?"))
        return;
    var index = expenses.findIndex(function (exp) { return exp.id === id; });
    if (index === -1)
        return;
    expenses.splice(index, 1);
    saveExpenses(expenses);
    renderExpenses(expenses);
    updateTotalExpense(expenses);
    renderCategoryChart(expenses);
}
window.deleteExpense = deleteExpense;
function editExpense(id) {
    localStorage.setItem("editExpenseId", id.toString());
    window.location.href = "Add.html";
}
window.editExpense = editExpense;
//Add & Edit Form Submission
if (form && titleInput && amountInput && categoryInput && dateInput) {
    if (editId) {
        var exp = expenses.find(function (e) { return e.id === Number(editId); });
        if (exp) {
            titleInput.value = exp.title;
            amountInput.value = exp.amount.toString();
            dateInput.value = exp.date;
            var predefined = ["bill", "food", "shopping", "travel"];
            if (predefined.indexOf(exp.category) !== -1) {
                categoryInput.value = exp.category;
            }
            else {
                categoryInput.value = "custom";
                customCategoryInput.style.display = "block";
                customCategoryInput.value = exp.category;
            }
        }
    }
    form.addEventListener("submit", function (e) {
        e.preventDefault();
        var title = titleInput.value.trim();
        var amount = Number(amountInput.value);
        var category = categoryInput.value;
        var date = dateInput.value;
        var today = new Date().toISOString().split("T")[0];
        if (category === "custom") {
            category = (customCategoryInput === null || customCategoryInput === void 0 ? void 0 : customCategoryInput.value.trim()) || "";
        }
        if (!title || !category || !date || amount <= 0) {
            alert("Please enter valid values.");
            return;
        }
        if (date > today) {
            alert("Future dates are not allowed.");
            return;
        }
        var isDuplicate = expenses.some(function (exp) {
            return exp.title.toLowerCase() === title.toLowerCase() &&
                exp.category === category &&
                exp.date === date &&
                exp.id !== Number(editId);
        });
        if (isDuplicate) {
            alert("This expense already exists.");
            return;
        }
        if (editId) {
            expenses = expenses.map(function (exp) {
                return exp.id === Number(editId)
                    ? __assign(__assign({}, exp), { title: title, amount: amount, category: category, date: date }) : exp;
            });
            localStorage.removeItem("editExpenseId");
        }
        else {
            expenses.push({
                id: Date.now(),
                title: title,
                amount: amount,
                category: category,
                date: date
            });
        }
        saveExpenses(expenses);
        window.location.href = "index.html";
    });
}
//Chart
function getCategoryData(list) {
    var totals = {};
    list.forEach(function (exp) {
        totals[exp.category] = (totals[exp.category] || 0) + exp.amount;
    });
    return {
        labels: Object.keys(totals),
        data: Object.values(totals)
    };
}
function renderCategoryChart(list) {
    var canvas = document.getElementById("categoryChart");
    if (!canvas)
        return;
    var _a = getCategoryData(list), labels = _a.labels, data = _a.data;
    if (categoryChart)
        categoryChart.destroy();
    categoryChart = new Chart(canvas, {
        type: "pie",
        data: {
            labels: labels,
            datasets: [{
                    data: data,
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
window.redirectToAddPage = redirectToAddPage;
