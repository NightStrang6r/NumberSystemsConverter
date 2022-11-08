const inputDecimal = document.querySelector('#inputDecimal');
const inputBinary = document.querySelector('#inputBinary');
const inputOctal = document.querySelector('#inputOctal');
const inputHexadecimal = document.querySelector('#inputHexadecimal');

const inputNum1 = document.querySelector('#inputNum1');
const inputBase1 = document.querySelector('#inputBase1');
const inputNum2 = document.querySelector('#inputNum2');
const inputBase2 = document.querySelector('#inputBase2');

inputDecimal.addEventListener('input', (ev) => calculate(ev.target));
inputBinary.addEventListener('input', (ev) => calculate(ev.target));
inputOctal.addEventListener('input', (ev) => calculate(ev.target));
inputHexadecimal.addEventListener('input', (ev) => calculate(ev.target));

inputBase1.addEventListener('input', (ev) => changeBase(ev.target));
inputBase2.addEventListener('input', (ev) => changeBase(ev.target));

inputNum1.addEventListener('input', (ev) => calculate(ev.target));
inputNum2.addEventListener('input', (ev) => calculate(ev.target));

changeBase(inputBase1);
changeBase(inputBase2);

let time = 0;

function calculate(el) {
    let num = el.value;
    num = num.replace(/ /g, '');
    let base = Number(el.dataset.base);

    if(!validate(el.value, base)) return;

    time = 0;

    if(base != 10)
        inputDecimal.value = convert(num, base, 10);
    if(base != 2)
        inputBinary.value = beautifyBinaryCode(convert(num, base, 2));
    if(base != 8)
        inputOctal.value = convert(num, base, 8);
    if(base != 16)
        inputHexadecimal.value = convert(num, base, 16).toUpperCase();

    inputNum1.value = convert(num, base, inputNum1.dataset.base).toUpperCase();
    inputNum2.value = convert(num, base, inputNum2.dataset.base).toUpperCase();

    //console.log(time);
}

function validate(num, base) {
    if(base == 2 && !(/^([01 ]*)$/.test(num))) {
        console.log('Err: 0 and 1 allowed only');
        inputBinary.classList.add('error-input');
        return false;
    }

    if((base == 10 || base == 8) && !(/^([0-9]*)$/.test(num))) {
        console.log('Err: NaN');
        if(base == 10)
            inputDecimal.classList.add('error-input');
        if(base == 8)
            inputOctal.classList.add('error-input');
        return false;
    }

    if(base == 16 && !(/^([0-9a-fA-F]*)$/.test(num))) {
        console.log('Err: Only 0-9 and A-F');
        inputHexadecimal.classList.add('error-input');
        return false;
    }

    clearErrors();

    if(!(/^([0-9a-zA-Z]*)$/.test(inputNum1.value))) {
        console.log('Err: Only 0-9 and A-Z');
        inputNum1.classList.add('error-input');
    }

    if(!(/^([0-9a-zA-Z]*)$/.test(inputNum2.value))) {
        console.log('Err: Only 0-9 and A-Z');
        inputNum2.classList.add('error-input');
    }

    return true;
}

function changeBase(el) {
    let base = Number(el.value);

    if(isNaN(base)) {
        console.log('Err: Base a number');
        el.classList.add('error-input');
        return false;
    }
    
    if(base > 36 || base < 2) {
        console.log('Err: Base must be > 36 and < 2');
        el.classList.add('error-input');
        return false;
    }

    if(el.id == 'inputBase1') {
        inputNum1.dataset.base = base;
    }

    if(el.id == 'inputBase2') {
        inputNum2.dataset.base = base;
    }

    el.classList.remove('error-input');
}

function beautifyBinaryCode(num) {
    let res = '';
    num = num.split('');

    for(let i = num.length - 1, counter = 1; i >= 0; i--, counter++) {
        res += num[i];
        if((counter % 4) == 0 && i != 0) {
            res += ' ';
        }
    }

    res = res.split('').reverse();
    return res.join('');
}

function reset() {
    inputDecimal.value = "";
    inputBinary.value = "";
    inputOctal.value = "";
    inputHexadecimal.value = "";
}

function clearErrors() {
    inputDecimal.classList.remove('error-input');
    inputBinary.classList.remove('error-input');
    inputOctal.classList.remove('error-input');
    inputHexadecimal.classList.remove('error-input');

    inputNum1.classList.remove('error-input');
    inputNum2.classList.remove('error-input');
}

// 

function convert(number, fromBase, toBase) {
    const start = new Date().getTime();
    const res = fromDec(toDec(number, fromBase), toBase);
    const end = new Date().getTime();
    time += end - start;
    return res
}

function toDec(number, fromBase) {
    let result = 0;
    number = number.toString().toLowerCase().split('');

    for (let i = 0, length = number.length; i < length; i++) {
        let digit = prepareDigit(number[i]);
        result = result * fromBase + digit;
    }

    return result;
}

function fromDec(number, toBase) {
    let result = [],
        integerPart,
        digit;

    while(number >= 1) {
        integerPart = parseInt(number / toBase);
        digit = number - toBase * integerPart;
        if(digit >= 10) digit = String.fromCharCode(digit + 87);
        result.unshift(digit);
        number = integerPart;
    }

    return result.join('');
}

function prepareDigit(digit) {
    digit = digit.charCodeAt() - 48;
    if (digit > 48) digit -= 39;
    return digit;
}