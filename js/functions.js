//array to check the operations.
const arrayOfOperations = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "0",
  ".",
  "+",
  "-",
  "/",
  "*",
];
 

export const inputField = document.querySelector("textarea");

//basic operation is present or not
export function isOperationPresent(clickedItem) {
  return arrayOfOperations.includes(clickedItem) ? clickedItem : "#";
}

//fn that is going to just add the operation in the string
export function simpleCalculation(value) {
  let string = getValueFromLocal("calString");
  if (string == undefined) string = "";
  string += value;
  setCharAtInputField(string);
}

//going to fire on = click
export function calculationOfSimpleCal(stringFromLocalStorage) {
  stringCalHandler(stringFromLocalStorage);
}

//main fn to handle the all cal logics
function stringCalHandler(str) {
  try {
    const calHistory = JSON.parse(getValueFromLocal("history","[]"))|| []
    const obj = {};
    obj.expression = str;
    str = eval(str);
    obj.answer = str
    calHistory.push(obj);
    setValueInLocal("history",JSON.stringify(calHistory))
    setCharAtInputField(str);
  } catch (err) {
    showErrForSomeTime("Invalid Input!");
  }
}
 
//backspace btn logic to remove last char
export function removeCharFromCal(string) {
  string = string?.substring(0, string.length - 1);
  setCharAtInputField(string);
}

//error handling function
function showErrForSomeTime(string = "Invalid Input !") {
  const errorDiv = document.getElementById("error-div");
  errorDiv.innerHTML = string;
  setTimeout(() => {
    errorDiv.innerHTML = "";
  }, 5000);
}

//fn to set the string in the input field
export function setCharAtInputField(string) {
  if (string === undefined) {
    inputField.value = "";
    return;
  }
  setValueInLocal("calString", string);
  inputField.value = string;
}

//=== stored memory cal fn ===
export function addTheValueToMemory() {
  let string = getValueFromLocal("calString");
  if (string === undefined) string = "";
  let storedNum = getValueFromLocal("storedNum");
  if (storedNum == undefined) string = "";
  const value = Number(string) + Number(storedNum);
  if (isNaN(value)) {
    showErrForSomeTime("Invalid Input!");
    return;
  }
  setValueInLocal("storedNum", value);
}

//minus the value from the stored
export function removeTheValueFromMemory() {
  let string = getValueFromLocal("calString");
  if (string === undefined) string = "";
  let storedNum = getValueFromLocal("storedNum");
  if (storedNum === undefined) string = "";
  const value = Number(storedNum) - Number(string);
  if (isNaN(value)) {
    showErrForSomeTime("Invalid Input!");
    return;
  }
  setValueInLocal("storedNum", value);
}

//show the output of cal (stored num)
export function recallTheValueFromMemory() {
  let string = getValueFromLocal("storedNum");
  setCharAtInputField(string);
}

//visibility of btn based on the memory
export function buttonVisibilityHandler(mRecallBtn, mClearBtn) {
  if (
    getValueFromLocal("storedNum") === "0" &&
    getValueFromLocal("storedNums") === undefined
  ) {
    mRecallBtn.disabled = true;
    mClearBtn.disabled = true;
  } else {
    mRecallBtn.disabled = false;
    mClearBtn.disabled = false;
  }
}

// === drawer and related to that fns ===
export function dynamicStyleDrawer(drawerContent, rect) {
  drawerContent.style.bottom = `calc(100% - ${rect.bottom}px)`;
  drawerContent.style.height = `${rect.height * 0.65}px`;
  drawerContent.style.width = `${rect.width}px`;
}

//debounce polyfill
function myDebounce(cb, d) {
  let timer;
  return function (...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      cb(...args);
    }, d);
  };
}
export const dynamicStyleDrawerWithDebounce = myDebounce(
  (drawerContent, rect) => {
    dynamicStyleDrawer(drawerContent, rect);
  },
  1000
);

export function drawerShow(drawerContent) {
  drawerContent.style.display = "inline";
}

export function drawerClose(drawerContent) {
  drawerContent.style.display = "none";
}

//show the stored nums with child append ( from memory)
export function showStoredNumbers() {
  const arrayOfNumbers = getValueFromLocal("storedNums")?.split(",");
  const errMsg = document.getElementById("empty-msg");
  const storedDiv = document.querySelector(".calDiv__numsDiv");
  if (arrayOfNumbers === undefined) {
    errMsg.innerText = "There's is nothing saved in your memory";
  if (storedDiv?.firstChild) {
    storedDiv.textContent = "";
  }
    return;
  } else {
    errMsg.innerText = "";
  }
   if (storedDiv?.firstChild) {
    storedDiv.textContent = "";
  }
  let child = arrayOfNumbers?.map(number => {
    return `<p class="me-3 h5" > ${number} </p>`;
  });
  if (child !== undefined) {
    for (const i of child) {
      storedDiv.insertAdjacentHTML("beforeend", i);
    }
  }
}

export function showStoredHistory(){
  const calHistory = JSON.parse(getValueFromLocal("history","[]"))|| [];
  const errMsg = document.getElementById("empty-msg");
  const storedDiv = document.querySelector(".calDiv__numsDiv");
  if (calHistory.length <= 0) {
    errMsg.innerText = "There's is nothing saved in your history";
  if (storedDiv?.firstChild) {
    storedDiv.textContent = "";
  }
    return;
  } else {
    errMsg.innerText = "";
  }
  if (storedDiv?.firstChild) {
    storedDiv.textContent = "";
  }
  let child = calHistory?.map(obj => {
    return `<p class="me-3 h6 fw-light"> ${obj.expression} = </p> <p class="me-3 h4">${obj.answer}</p>`;
  });
  if (child !== undefined) {
    for (const i of child) {
      storedDiv.insertAdjacentHTML("beforeend", i);
    }
  }
}

//remove number from the ui and memory
export function removeNumbers() {
  let storedDiv = document.querySelector(".calDiv__numsDiv");
  if (storedDiv?.firstChild) {
    storedDiv.textContent = "";
  }
  document.getElementById("empty-msg").innerText =
    "There's is nothing saved in your memory";
  setValueInLocal("storedNums", "");
  setValueInLocal("history","[]")
}

//==== local storage related fn ==== //

//set and get the data from the local storage
export function setValueInLocal(key, value) {
  localStorage.setItem(key, value);
}

//get the values from the local storage
export function getValueFromLocal(key,valueToBeSet = "") {
  let result = localStorage.getItem(key);
  if (!result) {
    setValueInLocal(key, valueToBeSet);
  } else {
    return result;
  }
}

//CE functionality
export function clearEnd(){
  let string = getValueFromLocal("calString");
  if (string === undefined) string = "";

  const lastOperatorIndex = string.search(/[+\-/]([^+\-/]*)$/);
  if (lastOperatorIndex !== -1) {
    const newInput = string.substring(0, lastOperatorIndex + 1);
    string = newInput;
  }
  setCharAtInputField(string);
}
