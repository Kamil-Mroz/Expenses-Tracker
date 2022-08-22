"use strict";

const btnAdd = document.querySelector(".add");
const form = document.querySelector(".form");
const tbodyEl = document.querySelector(".tbody");

const inputDate = document.getElementById("date");
const inputDescription = document.getElementById("description");
const inputAmount = document.getElementById("amount");
const inputSort = document.getElementById("sort");

class expense {
  #expense = {};
  #id = 0;

  constructor() {
    this._getLocalStorage();

    form.addEventListener("submit", this.newExpense.bind(this));
    tbodyEl.addEventListener("click", this._deleteEl.bind(this));
    inputSort.addEventListener("change", this._sort.bind(this));
  }

  _clearInputs() {
    inputDate.value = inputDescription.value = inputAmount.value = "";
  }

  newExpense(e) {
    e.preventDefault();
    let data;

    const dateValue = inputDate.value;
    const description = inputDescription.value;
    const amount = +inputAmount.value;

    if (!dateValue || !description || amount < 0) return;

    this.#expense[this.#id] = {
      id: this.#id,
      date: dateValue,
      description: description,
      amount: amount,
    };
    console.log(this.#expense);

    this._clearInputs();
    this._renderExpenses(this.#expense[this.#id]);
    this.#id += 1;

    this._setLocalStorage();
  }

  _sort() {
    let sorted = Object.values(this.#expense);
    if (!sorted || sorted.length === 0) return;
    if (!inputSort.value) return;
    const method = inputSort.value;
    const sorting = {
      dateUp: function (a, b) {
        return new Date(b.date) - new Date(a.date);
      },
      dateDown: function (a, b) {
        return new Date(a.date) - new Date(b.date);
      },
      amountUp: function (a, b) {
        return b.amount - a.amount;
      },
      amountDown: function (a, b) {
        return a.amount - b.amount;
      },
      DescriptionUp: function (a, b) {
        return b.description.localeCompare(a.description, "en", {
          sensitivity: "base",
        });
      },
      DescriptionDown: function (a, b) {
        return a.description.localeCompare(b.description, "en", {
          sensitivity: "base",
        });
      },
    };

    sorted.sort(sorting[method]);

    tbodyEl.innerHTML = "";
    sorted.forEach((el) => {
      this._renderExpenses(el);
    });
    sorted = Object.values(this.#expense);
  }

  _renderExpenses(data) {
    let expense = `
        <tr data-id="${data.id}">
          <td>${data.date}</td>
          <td>${data.description}</td>
          <td>${data.amount} <span class="money">$</span></td>
          <td class="delete"><ion-icon name="trash-outline" class="icon "></ion-icon></td>
        </tr>
    `;

    tbodyEl.insertAdjacentHTML("afterbegin", expense);
  }

  _deleteEl(e) {
    e.preventDefault();

    const expenseEl = e.target.closest(".delete");
    if (!expenseEl) return;
    const expensesRow = expenseEl.closest("tr");
    const id = expensesRow.dataset["id"];
    console.log(id);
    expensesRow.remove();
    delete this.#expense[id];

    this._setLocalStorage();
  }

  _setLocalStorage() {
    localStorage.setItem("expense", JSON.stringify(this.#expense));
  }

  _getLocalStorage() {
    const data = JSON.parse(localStorage.getItem("expense"));

    if (!data || Object.keys(data).length === 0) return;
    this.#expense = data;

    this.#id = +Object.keys(this.#expense).at(-1) + 1;

    for (const el of Object.values(this.#expense)) {
      this._renderExpenses(el);
    }
  }
}

const exp = new expense();
