import {
  inputField,
  isOperationPresent,
  simpleCalculation,
  calculationOfSimpleCal,
  removeCharFromCal,
  setCharAtInputField,
  addTheValueToMemory,
  removeTheValueFromMemory,
  recallTheValueFromMemory,
  buttonVisibilityHandler,
  dynamicStyleDrawer,
  dynamicStyleDrawerWithDebounce,
  drawerShow,
  drawerClose,
  showStoredNumbers,
  removeNumbers,
  setValueInLocal,
  getValueFromLocal,
  showStoredHistory,
  clearEnd,
} from "./functions.js";

//to store the nums
let storedNumbers = [];

let box = document.getElementById("calculator-div");
let rect = box.getBoundingClientRect();
let drawerContent = document.querySelector(".calDiv_drawer");

//to adjust the drawer position, if resize window
addEventListener("resize", () => {
  rect = box.getBoundingClientRect();
  dynamicStyleDrawerWithDebounce(drawerContent, rect);
});

let mRecallBtn = document.getElementById("m-recall");
let mClearBtn = document.getElementById("m-clear");
//enable or disable the btn
buttonVisibilityHandler(mRecallBtn, mClearBtn);

//set initial value in the input field empty or existing
getValueFromLocal("calString") === undefined
  ? inputField.value
  : (inputField.value = getValueFromLocal("calString"));

const mainElementForEvents = document.querySelector("#calculator-div");

//only one main event listener for all the btn (event delegation) !20-30 ==> 1  
mainElementForEvents.addEventListener("click", btnClickHandler);

function btnClickHandler(e) {
  //currentTarget --> element that the listener was bound to.
  //target --> on we do actually click
  if (e.target === e.currentTarget) return;

  //if not clicked On currentTarget
  let stringFromLocalStorage = getValueFromLocal("calString");
  let storedNumberOutput = getValueFromLocal("storedNum");
  storedNumberOutput === undefined ? setValueInLocal("storedNum", 0) : 0;
  var clickedItem = e.target.id;
  switch (clickedItem) {
    case isOperationPresent(clickedItem):
      simpleCalculation(clickedItem);
      break;
    case "m-plus":
      addTheValueToMemory();
      buttonVisibilityHandler(mRecallBtn, mClearBtn);
      break;
    case "m-minus":
      removeTheValueFromMemory();
      buttonVisibilityHandler(mRecallBtn, mClearBtn);
      break;
    case "m-clear":
      setValueInLocal("storedNum", 0);
      setValueInLocal("storedNums", "");
      storedNumbers = [];
      buttonVisibilityHandler(mRecallBtn, mClearBtn);
      break;
    case "m-recall":
      recallTheValueFromMemory(drawerContent, rect);
      break;
    case "m-store":
      storedNumbers.push(getValueFromLocal("calString"));
      setValueInLocal("storedNums", storedNumbers);
      buttonVisibilityHandler(mRecallBtn, mClearBtn);
      break;
    case "m-show":
      dynamicStyleDrawer(drawerContent, rect);
      drawerShow(drawerContent);
      showStoredHistory()
      break;
    case "CE":
      clearEnd();
      break;
    case "drawer-close":
      drawerClose(drawerContent);
      break;
    case "remove-nums":
      removeNumbers();
      storedNumbers = [];
      buttonVisibilityHandler(mRecallBtn, mClearBtn);
      break;
    case "=":
      calculationOfSimpleCal(stringFromLocalStorage);
      break;
    case "remove-char":
      removeCharFromCal(stringFromLocalStorage);
      break;
    case "reset-char":
      stringFromLocalStorage = "";
      setCharAtInputField(stringFromLocalStorage);
      break;
    case "history":
            showStoredHistory()
      break;
    case "memory":
      showStoredNumbers();
      break;
    default:
      break;
  }
}
