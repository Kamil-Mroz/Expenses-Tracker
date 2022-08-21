"use strict";

const btnAdd = document.querySelector(".add");
const form = document.querySelector(".form");
const tbodyEl = document.querySelector(".tbody");
const inputDate = document.getElementById("date");
const inputDescription = document.getElementById("description");
const inputAmount = document.getElementById("amount");
const inputSort = document.getElementById("sort");

class expense {
  #expense = [];
  #id = 0;

  constructor() {
    this._getLocalStorage();

    form.addEventListener("submit", this.newExpense.bind(this));
    tbodyEl.addEventListener("click", this.deleteEl.bind(this));
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

    // if (!dateValue || !description || amount < 0) return;

    data = {
      id: this.#id,
      date: dateValue,
      description: description,
      amount: amount,
    };

    this.#expense.push(data);
    this._clearInputs();
    this.#id += 1;
    this._renderExpenses(data);

    this._setLocalStorage();
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

  deleteEl(e) {
    e.preventDefault();

    const expenseEl = e.target.closest(".delete");
    if (!expenseEl) return;
    const expensesRow = expenseEl.closest("tr");
    const id = +expensesRow.dataset["id"];
    expensesRow.remove();

    this.#expense.splice(id, 1);

    this._setLocalStorage();
  }

  _setLocalStorage() {
    localStorage.setItem("expense", JSON.stringify(this.#expense));
  }

  _getLocalStorage() {
    const data = JSON.parse(localStorage.getItem("expense"));

    if (!data || data.length === 0) return;
    this.#expense = data;
    this.#id = this.#expense.at(-1).id + 1;

    this.#expense.forEach((expense) => {
      this._renderExpenses(expense);
    });
  }

  _displayTotal() {
    const sum = this.#expense.reduce((sum, curr) => {
      sum += curr.amount;
      return sum;
    }, 0);
    console.log(sum);
  }
}

const exp = new expense();
