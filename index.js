class Calculator {
  constructor(previousOperandTextElement, currentOperandTextElement) {
    // Store references to the HTML elements where the operands will be displayed
    this.previousOperandTextElement = previousOperandTextElement;
    this.currentOperandTextElement = currentOperandTextElement;
    // Initialize calculator by clearing all values
    this.clear();
  }

  // Clear the current and previous operands and reset the operation
  clear() {
    this.currentOperand = '';
    this.previousOperand = '';
    this.operation = undefined;
  }

  // Remove the last digit from the current operand
  delete() {
    this.currentOperand = this.currentOperand.toString().slice(0, -1);
  }

  // Append a number or decimal point to the current operand
  appendNumber(number) {
    // Prevent multiple decimals from being added
    if (number === '.' && this.currentOperand.includes('.')) return;
    this.currentOperand = this.currentOperand.toString() + number.toString();
  }

  // Select an operation (+, -, *, /) and prepare for the next operand
  chooseOperation(operation) {
    // Do nothing if current operand is empty
    if (this.currentOperand === '') return;
    // If there's a previous operand, compute the result before setting the operation
    if (this.previousOperand !== '') {
      this.compute();
    }
    this.operation = operation;
    this.previousOperand = this.currentOperand;
    this.currentOperand = '';
  }

  // Perform the computation based on the selected operation
  compute() {
    let computation;
    const prev = parseFloat(this.previousOperand);
    const current = parseFloat(this.currentOperand);
    // Exit if either operand is not a number
    if (isNaN(prev) || isNaN(current)) return;
    // Perform the calculation based on the operation
    switch (this.operation) {
      case '+':
        computation = prev + current;
        break;
      case '-':
        computation = prev - current;
        break;
      case '×':
        computation = prev * current;
        break;
      case '÷':
        computation = prev / current;
        break;
      default:
        return;
    }
    this.currentOperand = computation;
    this.operation = undefined;
    this.previousOperand = '';
  }

  // Format the number for display, adding commas for thousands
  getDisplayNumber(number) {
    const stringNumber = number.toString();
    const integerDigits = parseFloat(stringNumber.split('.')[0]);
    const decimalDigits = stringNumber.split('.')[1];
    let integerDisplay;
    if (isNaN(integerDigits)) {
      integerDisplay = '';
    } else {
      integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 });
    }
    if (decimalDigits != null) {
      return `${integerDisplay}.${decimalDigits}`;
    } else {
      return integerDisplay;
    }
  }

  // Update the display with the current and previous operands and operation
  updateDisplay() {
    this.currentOperandTextElement.innerText = 
      this.getDisplayNumber(this.currentOperand);
    if (this.operation != null) {
      this.previousOperandTextElement.innerText = 
        `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
    } else {
      this.previousOperandTextElement.innerText = '';
    }
  }
}

// Select all the buttons and text elements for the calculator
const numberButtons = document.querySelectorAll('[data-number]');
const operationButtons = document.querySelectorAll('[data-operation]');
const equalButton = document.querySelector('[data-equals]');
const deleteButton = document.querySelector('[data-delete]');
const allClearButton = document.querySelector('[data-all-clear]');
const previousOperandTextElement = document.querySelector('[data-previous-operand]');
const currentOperandTextElement = document.querySelector('[data-current-operand]');

// Create a new calculator instance
const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);

// Add event listeners to each number button to append the number to the current operand
numberButtons.forEach(button => {
  button.addEventListener('click', () => {
    calculator.appendNumber(button.innerText);
    calculator.updateDisplay();
  });
});

// Add event listeners to each operation button to choose the operation
operationButtons.forEach(button => {
  button.addEventListener('click', () => {
    calculator.chooseOperation(button.innerText);
    calculator.updateDisplay();
  });
});

// Add event listener to the equals button to compute the result
equalButton.addEventListener('click', button => {
  calculator.compute();
  calculator.updateDisplay();
});

// Add event listener to the all clear button to reset the calculator
allClearButton.addEventListener('click', button => {
  calculator.clear();
  calculator.updateDisplay();
});

// Add event listener to the delete button to remove the last digit
deleteButton.addEventListener('click', button => {
  calculator.delete();
  calculator.updateDisplay();
});
