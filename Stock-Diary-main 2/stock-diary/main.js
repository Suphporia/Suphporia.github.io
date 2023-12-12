"use strict";

//////////////////////////////////////////////////////////// Make Calendar //////////////////////////////////////////////////////////
// window.localStorage.clear();

let calendarDate = 0;
let calendarDates = 0;
// stock list를 객체의 형태로 배열에 저장하기 위함.
let saveStockList = [];
let diaryMemo = "";

let saveCalendarObj = {
  saveStockList,
  diaryMemo,
};

let saveStor = [];

window.onload = function () {
  buildCalendar();
}; // 웹 페이지가 로드되면 buildCalendar 실행

let nowMonth = new Date(); // 현재 달을 페이지를 로드한 날의 달로 초기화
let today = new Date(); // 페이지를 로드한 날짜를 저장
today.setHours(0, 0, 0, 0); // 비교 편의를 위해 today의 시간을 초기화

// 달력 생성 : 해당 달에 맞춰 테이블을 만들고, 날짜를 채워 넣는다.
function buildCalendar() {
  let firstDate = new Date(nowMonth.getFullYear(), nowMonth.getMonth(), 1); // 이번달 1일
  let lastDate = new Date(nowMonth.getFullYear(), nowMonth.getMonth() + 1, 0); // 이번달 마지막날

  let tbody_Calendar = document.querySelector(".calendar_table > tbody");
  document.getElementById("calYear").innerText = nowMonth.getFullYear(); // 연도 숫자 갱신
  document.getElementById("calMonth").innerText = leftPad(
    nowMonth.getMonth() + 1
  ); // 월 숫자 갱신

  while (tbody_Calendar.rows.length > 0) {
    // 이전 출력결과가 남아있는 경우 초기화
    tbody_Calendar.deleteRow(tbody_Calendar.rows.length - 1);
  }

  let nowRow = tbody_Calendar.insertRow(); // 첫번째 행 추가

  for (let j = 0; j < firstDate.getDay(); j++) {
    // 이번달 1일의 요일만큼
    let nowColumn = nowRow.insertCell(); // 열 추가
  }

  for (
    let nowDay = firstDate;
    nowDay <= lastDate;
    nowDay.setDate(nowDay.getDate() + 1)
  ) {
    // day는 날짜를 저장하는 변수, 이번달 마지막날까지 증가시키며 반복

    let nowColumn = nowRow.insertCell(); // 새 열을 추가하고
    let newDIV = document.createElement("p");

    calendarDates = `${nowMonth.getFullYear()}${nowMonth.getMonth()}${nowDay.getDate()}`;

    newDIV.setAttribute("class", "day");
    newDIV.setAttribute(
      "data-id",
      `${nowMonth.getFullYear()}${nowMonth.getMonth()}${nowDay.getDate()}`
    );
    newDIV.classList.add(`${calendarDates}`);

    newDIV.addEventListener("click", () => {
      // 해당 날짜로 이동
      // 해당 날짜 id의 내용을 localStorage에서 받아옴.
      choiceDate(newDIV);
      calendarDate = newDIV.dataset.id;

      const ulItem = document.querySelector("ul");
      ulItem.innerText = "";
      diaryInput.value = "";

      saveStor = loadToDiarySection(calendarDate);
      const parsed = createdLoadData(saveStor);
      updateLocalStorage(calendarDate, parsed);
    });

    const isHave = localStorage.getItem(calendarDates);
    if (isHave === null) {
      saveCalendarObj.saveStockList = [];
      saveCalendarObj.diaryMemo = "";
      updateLocalStorage(calendarDates, saveCalendarObj);
    } else if (JSON.parse(isHave).diaryMemo !== "") {
      newDIV.classList.add("saveDay");
    }

    saveBtn.addEventListener("click", () => {
      const choice = document.querySelector(".choiceDay");
      choice.classList.add("saveDay");
      saveCalendarObj.diaryMemo = diaryInput.value;
      updateLocalStorage(calendarDate, saveCalendarObj);
    });

    newDIV.innerHTML = leftPad(nowDay.getDate()); // 추가한 열에 날짜 입력
    nowColumn.appendChild(newDIV);

    // 마지막 날이 토요일일 경우에 행 추가 X
    const nextDay = new Date(nowDay);
    nextDay.setDate(nowDay.getDate() + 1);

    if (nowDay.getDay() == 6 && nextDay.getDate() != 1) {
      // 토요일인 경우
      nowRow = tbody_Calendar.insertRow(); // 새로운 행 추가
    }

    if (
      nowDay.getFullYear() == today.getFullYear() &&
      nowDay.getMonth() == today.getMonth() &&
      nowDay.getDate() == today.getDate()
    ) {
      // 오늘인 경우
      newDIV.setAttribute("class", "today");
      newDIV.classList.add("choiceDay");
    }
  }
}

function updateLocalStorage(calendarDate, array) {
  localStorage.setItem(calendarDate, JSON.stringify(array));
}

function loadToDiarySection(calendarDate) {
  const loaded = localStorage.getItem(calendarDate);
  if (loaded !== null) {
    const parsed = JSON.parse(loaded);
    return parsed;
  }
}

function createdLoadData(parsed) {
  const parsedStock = parsed.saveStockList;
  parsedStock.forEach((stocks) => {
    const item = createStockList(stocks.name, stocks.percent);
    stocks.id = id - 1;
    items.appendChild(item);
    item.scrollIntoView({ block: "center" });
  });
  diaryInput.value = parsed.diaryMemo;

  return parsed;
}

function choiceDate(newDIV) {
  if (document.getElementsByClassName("choiceDay")[0]) {
    // 기존에 선택한 날짜가 있으면
    document
      .getElementsByClassName("choiceDay")[0]
      .classList.remove("choiceDay"); // 해당 날짜의 "choiceDay" class 제거
  }
  newDIV.classList.add("choiceDay"); // 선택된 날짜에 "choiceDay" class 추가
}

// 이전달 버튼 클릭
function prevCalendar() {
  nowMonth = new Date(
    nowMonth.getFullYear(),
    nowMonth.getMonth() - 1,
    nowMonth.getDate()
  ); // 현재 달을 1 감소
  buildCalendar(); // 달력 다시 생성
  const ulItem = document.querySelector("ul");
  ulItem.innerText = "";
  diaryInput.value = "";
}
// 다음달 버튼 클릭
function nextCalendar() {
  nowMonth = new Date(
    nowMonth.getFullYear(),
    nowMonth.getMonth() + 1,
    nowMonth.getDate()
  ); // 현재 달을 1 증가
  buildCalendar(); // 달력 다시 생성
  const ulItem = document.querySelector("ul");
  ulItem.innerText = "";
  diaryInput.value = "";
}

// input값이 한자리 숫자인 경우 앞에 '0' 붙혀주는 함수
function leftPad(value) {
  if (value < 10) {
    value = "0" + value;
    return value;
  }
  return value;
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////// Make Stock List & Diary Section //////////////////////////////////////////////////

let id = 0;

// 생성자 함수
function Stock(name, percent, id) {
  this.name = name;
  this.percent = percent;
  this.id = id;
}

const stockList = document.querySelector(".stock_list");
const items = document.querySelector(".items");
const stockName = document.querySelector(".stock_input");
const percentage = document.querySelector(".stock_percentage");
const writeDiaryBtn = document.querySelector(".item_write");

const diary = document.querySelector(".diary");
const diaryInput = document.querySelector(".diary_input");
const diaryTitle = document.querySelector(".diaryHeadline");
const saveBtn = document.querySelector(".save");
const backBtn = document.querySelector(".back");

function onAdd() {
  const stockText = stockName.value;
  const percentageText = percentage.value;
  if (stockText === "" || percentageText === "") {
    alert("주식 이름 & 수익률 전부 작성해주세요!");
    stockName.focus();
    return;
  }

  saveCalendarObj = loadToDiarySection(calendarDate);

  const item = createStockList(stockText, percentageText);
  saveCalendarObj.saveStockList.push(
    new Stock(stockText, percentageText, id - 1)
  );

  updateLocalStorage(calendarDate, saveCalendarObj);

  items.appendChild(item);
  item.scrollIntoView({ block: "center" });
  stockName.value = "";
  percentage.value = "";
  stockName.focus();
}

function createStockList(text1, text2) {
  const itemRow = document.createElement("li");
  itemRow.setAttribute("class", "item_row");

  const items = document.createElement("div");
  items.setAttribute("class", "item");
  items.setAttribute("date-id", id);

  const sname = document.createElement("span");
  sname.setAttribute("class", "item_name");
  sname.innerText = text1;

  const spercent = document.createElement("span");
  spercent.setAttribute("class", "item_percent");
  spercent.innerText = text2;

  const btns = document.createElement("span");
  btns.setAttribute("class", "btns");

  const deleteBtn = document.createElement("button");
  deleteBtn.setAttribute("class", "item_delete");
  deleteBtn.setAttribute("data-id", id);

  deleteBtn.addEventListener("click", (event) => {
    saveCalendarObj = loadToDiarySection(calendarDate);
    const id = event.target.dataset.id;
    const toBeDeleted = document.querySelector(`.item_delete[data-id="${id}"]`);
    if (id) {
      const cleanToStock = saveCalendarObj.saveStockList.filter((stocks) => {
        return stocks.id !== parseInt(toBeDeleted.dataset.id);
      });
      //새로운 배열을 다시 toBuy에 대입
      saveCalendarObj.saveStockList = cleanToStock;
      console.log(cleanToStock);
      updateLocalStorage(calendarDate, saveCalendarObj);
    }
    itemRow.remove();
  });

  const iItem = document.createElement("i");
  iItem.setAttribute("class", "fas fa-trash-alt");
  iItem.setAttribute("data-id", id);

  const itemDivider = document.createElement("div");
  itemDivider.setAttribute("class", "item_divider");

  items.appendChild(sname);
  items.appendChild(spercent);
  items.appendChild(btns);

  btns.appendChild(deleteBtn);

  deleteBtn.appendChild(iItem);

  itemRow.appendChild(items);
  itemRow.appendChild(itemDivider);

  id++;

  return itemRow;
}

writeDiaryBtn.addEventListener("click", () => {
  stockList.classList.add("stock_list--hide");
  diary.classList.remove("diary--hide");
});

stockName.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    onAdd();
  }
});

percentage.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    onAdd();
  }
});

backBtn.addEventListener("click", () => {
  stockList.classList.remove("stock_list--hide");
  diary.classList.add("diary--hide");
});
