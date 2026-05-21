const calculator = (() => {
  // ---- State (private) ----
  let currentInput = "";
  let previousValue = null;
  let operator = null;
  let shouldResetDisplay = false;

  // ---- DOM refs ----
  const displayValue1 = document.querySelector(".display_value1");
  const displayValue2 = document.querySelector(".display_value2");
  const displayOperation = document.querySelector(".display_operation");

  // ---- Centralized UI update (called only when state changes) ----
  function refreshDisplay() {
    displayValue1.textContent = currentInput || "0";
    displayValue2.textContent = previousValue !== null ? previousValue : "";
    displayOperation.textContent = operator || "";
  }

  // ---- Safe state mutation helper ----
  function setState(updates) {
    // Apply all changes, then refresh once
    Object.assign(calculator.state, updates);
    refreshDisplay();
  }

  // Expose state for the setter (or we could keep it internal and use explicit methods)
  const state = { currentInput, previousValue, operator, shouldResetDisplay };

  // ---- Public methods ----
  function appendCharacter(char) {
    if (char === "." && state.currentInput.includes(".")) return;

    if (state.shouldResetDisplay) {
      state.currentInput = "";
      state.shouldResetDisplay = false;
    }

    state.currentInput += char;
    refreshDisplay(); // only one call
  }

  function setOperator(op) {
    const currentNumber = parseFloat(state.currentInput);
    if (isNaN(currentNumber)) return;

    if (
      state.previousValue !== null &&
      state.operator &&
      !state.shouldResetDisplay
    ) {
      calculate(); // may call refreshDisplay internally, but we'll handle it
      // After calculate(), state is already refreshed, so we just continue
    }

    state.previousValue = parseFloat(state.currentInput);
    state.operator = op;
    state.shouldResetDisplay = true;
    refreshDisplay();
  }

  function calculate() {
    const num1 = state.previousValue;
    const op = state.operator;
    const num2 = parseFloat(state.currentInput);

    if (num1 === null || op === null || isNaN(num2)) return;

    let result;
    switch (op) {
      case "+":
        result = num1 + num2;
        break;
      case "-":
        result = num1 - num2;
        break;
      case "*":
        result = num1 * num2;
        break;
      case "/":
        result = num2 === 0 ? "Error" : num1 / num2;
        break;
      case "%":
        result = num2 === 0 ? "Error" : num1 % num2;
        break;
      default:
        result = "Error";
    }

    state.currentInput = result.toString();
    state.previousValue = null;
    state.operator = null;
    state.shouldResetDisplay = true;
    refreshDisplay();

    if (result === "Error") {
      clearAll();
      alert("Invalid operation");
    }
  }

  function clearAll() {
    state.currentInput = "";
    state.previousValue = null;
    state.operator = null;
    state.shouldResetDisplay = false;
    refreshDisplay();
  }

  // ---- Reveal public API ----
  return { appendCharacter, setOperator, calculate, clearAll, state };
})();

// ---- Event listeners (no repetition) ----
document
  .querySelectorAll(".btn")
  .forEach((btn) =>
    btn.addEventListener("click", (e) =>
      calculator.appendCharacter(e.target.value),
    ),
  );

document
  .querySelectorAll(".calc_btn")
  .forEach((btn) =>
    btn.addEventListener("click", (e) =>
      calculator.setOperator(e.target.value),
    ),
  );

document
  .querySelector(".equal_btn")
  .addEventListener("click", () => calculator.calculate());

const clearBtn = document.querySelector(".clear_btn");
if (clearBtn) clearBtn.addEventListener("click", () => calculator.clearAll());
