// Get DOM elements
const previousOperandElement = document.getElementById('previous-operand');
const currentOperandElement = document.getElementById('current-operand');
const numberButtons = document.querySelectorAll('.number');
const operatorButtons = document.querySelectorAll('.operator');
const equalsButton = document.getElementById('equals');
const clearButton = document.getElementById('clear');
const deleteButton = document.getElementById('delete');
const percentButton = document.getElementById('percent');

// Calculator state
let currentOperand = '0';
let previousOperand = '';
let operation = undefined;
let shouldResetCurrentOperand = false;

// Initialize the calculator
function initialize() {
    updateDisplay();
    
    // Add event listeners
    numberButtons.forEach(button => {
        button.addEventListener('click', () => appendNumber(button.textContent));
    });
    
    operatorButtons.forEach(button => {
        button.addEventListener('click', () => setOperation(button.textContent));
    });
    
    equalsButton.addEventListener('click', compute);
    clearButton.addEventListener('click', clear);
    deleteButton.addEventListener('click', deleteNumber);
    percentButton.addEventListener('click', percentage);
    
    // Add keyboard support
    document.addEventListener('keydown', handleKeyboardInput);
}

// Handle keyboard input
function handleKeyboardInput(e) {
    if (e.key >= '0' && e.key <= '9') appendNumber(e.key);
    if (e.key === '.') appendNumber(e.key);
    if (e.key === '=' || e.key === 'Enter') compute();
    if (e.key === 'Backspace') deleteNumber();
    if (e.key === 'Escape') clear();
    if (e.key === '+') setOperation('+');
    if (e.key === '-') setOperation('−');
    if (e.key === '*') setOperation('×');
    if (e.key === '/') setOperation('÷');
    if (e.key === '%') percentage();
}

// Append a number to the current operand
function appendNumber(number) {
    if (shouldResetCurrentOperand) {
        currentOperand = '';
        shouldResetCurrentOperand = false;
    }
    
    // Handle decimal point
    if (number === '.' && currentOperand.includes('.')) return;
    
    // Handle initial zero
    if (currentOperand === '0' && number !== '.') {
        currentOperand = number;
    } else {
        currentOperand += number;
    }
    
    updateDisplay();
}

// Set the operation
function setOperation(op) {
    if (currentOperand === '') return;
    
    if (previousOperand !== '') {
        compute();
    }
    
    operation = op;
    previousOperand = currentOperand;
    shouldResetCurrentOperand = true;
    updateDisplay();
}

// Compute the result
function compute() {
    if (operation === undefined || shouldResetCurrentOperand) return;
    
    const prev = parseFloat(previousOperand);
    const current = parseFloat(currentOperand);
    
    if (isNaN(prev) || isNaN(current)) return;
    
    let computation;
    switch (operation) {
        case '+':
            computation = prev + current;
            break;
        case '−':
            computation = prev - current;
            break;
        case '×':
            computation = prev * current;
            break;
        case '÷':
            if (current === 0) {
                alert("Cannot divide by zero");
                clear();
                return;
            }
            computation = prev / current;
            break;
        default:
            return;
    }
    
    currentOperand = computation.toString();
    operation = undefined;
    previousOperand = '';
    shouldResetCurrentOperand = true;
    updateDisplay();
}

// Clear the calculator
function clear() {
    currentOperand = '0';
    previousOperand = '';
    operation = undefined;
    shouldResetCurrentOperand = false;
    updateDisplay();
}

// Delete the last digit
function deleteNumber() {
    if (shouldResetCurrentOperand) return;
    
    if (currentOperand.length === 1) {
        currentOperand = '0';
    } else {
        currentOperand = currentOperand.slice(0, -1);
    }
    
    updateDisplay();
}

// Calculate percentage
function percentage() {
    if (currentOperand === '') return;
    
    currentOperand = (parseFloat(currentOperand) / 100).toString();
    updateDisplay();
}

// Format the display number
function getDisplayNumber(number) {
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

// Update the display
function updateDisplay() {
    currentOperandElement.textContent = getDisplayNumber(currentOperand);
    
    if (operation != null) {
        previousOperandElement.textContent = `${getDisplayNumber(previousOperand)} ${operation}`;
    } else {
        previousOperandElement.textContent = '';
    }
}

// Initialize the calculator when the page loads
document.addEventListener('DOMContentLoaded', initialize);
