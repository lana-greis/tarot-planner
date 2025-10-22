import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js"
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js"

const firebaseConfig = {
  apiKey: "AIzaSyDQsLjfpCogYejfXUCrEAO0TsJW1g8ipMw",
  authDomain: "lana-greis.firebaseapp.com",
  projectId: "lana-greis",
  storageBucket: "lana-greis.firebasestorage.app",
  messagingSenderId: "87140146821",
  appId: "1:87140146821:web:6ef7a4d9810352d9b253ec"
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

const params = new URLSearchParams(window.location.search)
const layoutId = params.get("id")

if (!layoutId) alert("ID расклада отсутствует")

let fullInfoObject = null

async function loadLayout() {
	const docRef = doc(db, "layouts", layoutId);
	const docSnap = await getDoc(docRef);

	if (docSnap.exists()) {
		fullInfoObject = docSnap.data()
		superStarTer()
	} else {
		alert("Расклад не найден")
	}
}

const calendarDates = document.querySelector('.calendar__dates')

const applyTheme = () => {
	document.body.classList.add(`theme__${fullInfoObject.theme}`)

	const basePath = '/tarot-viewer/img/themes'
	const lowRes = `${basePath}/${fullInfoObject.theme}_mini.jpg`
	const highRes = `${basePath}/${fullInfoObject.theme}.jpg`

	document.body.style.setProperty('--bg-image', `url('${lowRes}')`)

	requestAnimationFrame(() => {
		const img = new Image()
		img.src = highRes

		img.onload = () => {
			document.body.style.setProperty('--bg-image', `url('${highRes}')`)
		}
	})
}

const getNumberOfFirstDay = (y, m) => {
	const chosenDate = new Date(y, m - 1)
	const firstDay = chosenDate.getDay()
	return firstDay === 0 ? 7 : firstDay
}

const getLastDay = (y, m) => {
	let lastDay = new Date(y, m, 0)
	return lastDay.getDate()
}

const getNumberOfLastDay = (y, m) => {
	const chosenDate = new Date(y, m, 0)
	const lastDay = chosenDate.getDay()
	return lastDay === 0 ? 7 : lastDay
}

const createEmptyCellForDay = () => {
	const newCell = document.createElement('div')
	newCell.classList.add('calendar__dates_cell')
	newCell.classList.add('calendar__dates_cell_empty')
	calendarDates.append(newCell)
}

const cardDisplay = document.querySelector('.card-display__wrapper')
const cardDisplayCloser = document.querySelector('.card-display__closing-item')
const cardDisplayImg = cardDisplay.children[0].children[0].children[0]
const cardDisplayInfo = cardDisplay.children[0].children[1]
const cardDisplayInfoDate = cardDisplayInfo.children[0]
const cardDisplayInfoTitle = cardDisplayInfo.children[1]
const cardDisplayInfoColor = cardDisplayInfo.children[2]
const cardDisplayInfoText = cardDisplayInfo.children[3]
const cardDisplayBlock = cardDisplay.children[0]

const createCardImageUrl = (dateNum) => {
	const cardPath = (fullInfoObject.days[dateNum - 1].cardType === 'sa')
		? `./img/cards/${fullInfoObject.deck}/${fullInfoObject.days[dateNum - 1].cardName}.jpg`
		: `./img/cards/${fullInfoObject.deck}/${fullInfoObject.days[dateNum - 1].cardType}-${fullInfoObject.days[dateNum - 1].cardName}.jpg`

	return cardPath
}

const createCardMiniImageUrl = (dateNum) => {
	const cardPath = (fullInfoObject.days[dateNum - 1].cardType === 'sa')
		? `./img/cards/${fullInfoObject.deck}/mini/${fullInfoObject.days[dateNum - 1].cardName}.jpg`
		: `./img/cards/${fullInfoObject.deck}/mini/${fullInfoObject.days[dateNum - 1].cardType}-${fullInfoObject.days[dateNum - 1].cardName}.jpg`

	return cardPath
}

const createCardReadableDate = (dateNum) => {
	const readableMonthes = [
		'января',
		'февраля',
		'марта',
		'апреля',
		'мая',
		'июня',
		'июля',
		'августа',
		'сентября',
		'октября',
		'ноября',
		'декабря'
	]

	return `${dateNum} ${readableMonthes[fullInfoObject.month - 1]}`
}

const createCardReadableCardname = (cardType, cardName) => {

	const readableCardNums = {
		"01": "Туз",
		"02": "Двойка",
		"03": "Тройка",
		"04": "Четверка",
		"05": "Пятерка",
		"06": "Шестерка",
		"07": "Семерка",
		"08": "Восьмерка",
		"09": "Девятка",
		"10": "Десятка",
		"korol": "Король",
		"koroleva": "Королева",
		"pazh": "Паж",
		"rycar": "Рыцарь"
	}

	const readableSuits = {
		'sa': 'Старший Аркан',
		'kubkov': 'кубков',
		'mechei': 'мечей',
		'pentaklei': 'пентаклей',
		'zhezlov': 'жезлов'
	}

	const readableArcans = {
		"00-Shut": "Шут (Дурак)",
		"01-Mag": "Маг",
		"02-Zhrica": "Жрица",
		"03-Imperatrica": "Императрица",
		"04-Imperator": "Император",
		"05-Zhrec": "Жрец",
		"06-Vljublennye": "Влюбленные",
		"07-Kolesnica": "Колесница",
		"08-Spravedlivost": "Справедливость",
		"09-Otshelnik": "Отшельник",
		"10-Koleso-Fortuny": "Колесо фортуны",
		"11-Sila": "Сила",
		"12-Poveshennyj": "Повешенный",
		"13-Smert": "Смерть",
		"14-Umerennost": "Умеренность",
		"15-Diavol": "Дьявол",
		"16-Bashnja": "Башня",
		"17-Zvezda": "Звезда",
		"18-Luna": "Луна",
		"19-Solnce": "Солнце",
		"20-Sud": "Суд",
		"21-Mir": "Мир"
	}

	let resString = ''

	if (cardType === 'sa') {
		resString = `${readableSuits[cardType]} ${readableArcans[cardName]}`
	} else {
		resString = `${readableCardNums[cardName]} ${readableSuits[cardType]}`
	}

	return resString
}

const changeColor = (dateNum) => {
	const currColor = fullInfoObject.days[dateNum - 1].color
	const currDesc = fullInfoObject.days[dateNum - 1].description

	cardDisplayInfoColor.children[0].style.setProperty('--card-color', `#${currColor}`)
	cardDisplayInfoColor.children[2].innerText = `Цвет энергий дня. ${currDesc}`
}

const changeColorTwo = (dateNum) => {
	if (fullInfoObject.days[dateNum - 1].colorTwo) {
		const currColor = fullInfoObject.days[dateNum - 1].colorTwo
		const currDesc = fullInfoObject.days[dateNum - 1].description

		cardDisplayInfoColor.children[1].style.display = 'block'
		cardDisplayInfoColor.children[1].style.setProperty('--card-color', `#${currColor}`)
		cardDisplayInfoColor.children[2].innerText = `Цвета энергий дня. ${currDesc}`
	} else {
		cardDisplayInfoColor.children[1].style.display = 'none'
	}
}

const changeText = (dateNum) => {
	if (fullInfoObject.days[dateNum - 1].text === '') {
		cardDisplayInfoText.style.display = 'none'
	} else {
		cardDisplayInfoText.style.display = 'block'
	}
	cardDisplayInfoText.innerHTML = fullInfoObject.days[dateNum - 1].text
}

const changeForm = (dateNum) => {
	const cardPath = createCardImageUrl(dateNum)
	cardDisplayImg.src = cardPath
	cardDisplayInfoDate.innerText = createCardReadableDate(dateNum)
	cardDisplayInfoTitle.innerHTML = createCardReadableCardname(fullInfoObject.days[dateNum - 1].cardType, fullInfoObject.days[dateNum - 1].cardName)
	changeColor(dateNum)
	changeColorTwo(dateNum)
	changeText(dateNum)
}

const changeFormPosition = () => {
	const formHeight = cardDisplayBlock.offsetHeight
	const windowHeight = window.innerHeight
	const scrollY = window.scrollY
	const pageHeight = document.body.scrollHeight

	let top

	if (formHeight <= windowHeight) {
		top = scrollY
	}

	else if (scrollY + formHeight <= pageHeight) {
		top = scrollY
	}

	else {
		top = pageHeight - formHeight
	}

	cardDisplayBlock.style.top = `${top}px`
	cardDisplayCloser.style.top = `${top + 30}px`
}

const showForm = (dateNum) => {
	changeForm(dateNum)
	changeFormPosition()

	requestAnimationFrame(() => {
		cardDisplay.classList.add('show-on')
	})
}

const closeForm = () => {
	cardDisplay.classList.remove('show-on')
}

cardDisplayCloser.addEventListener('click', closeForm)

cardDisplay.addEventListener('click', (e) => {
	if (e.target === cardDisplay) closeForm()
})

const createCellForDay = (dateNum) => {
	const newCell = document.createElement('div')
	newCell.classList.add('calendar__dates_cell')
	if (dateNum < 10) newCell.classList.add('calendar__dates_cell__short_date')
	newCell.id = `day${dateNum}`
	calendarDates.append(newCell)

	const newCellInfo = document.createElement('div')
	newCellInfo.classList.add('calendar__dates_cell__info')
	newCell.append(newCellInfo)
	newCellInfo.innerText = dateNum
	if (fullInfoObject.days[dateNum - 1].colorTwo) {
		newCellInfo.style.boxShadow = `0 0 7px 5px #${fullInfoObject.days[dateNum - 1].colorTwo}`
	} else {
		newCellInfo.style.boxShadow = `0 0 7px 5px #ffffff`
	}

	const newCellCard = document.createElement('div')
	newCellCard.classList.add('calendar__dates_cell__card')
	newCell.append(newCellCard)

	const cardPath = createCardImageUrl(dateNum)
	const cardPathMini = createCardMiniImageUrl(dateNum)

	const dayCell = document.getElementById(`day${dateNum}`)
	dayCell.style.boxShadow = `0 0 12px 3px #${fullInfoObject.days[dateNum - 1].color}`
	if (fullInfoObject.days[dateNum - 1].colorTwo) dayCell.style.backgroundColor = `#${fullInfoObject.days[dateNum - 1].colorTwo}33`

	const cardBlock = dayCell.children[1]
	cardBlock.innerHTML = ''
	const img = document.createElement('img')
	img.src = cardPathMini
	img.alt = 'Карта'
	img.style.width = '100%'
	img.style.maxHeight = '100%'
	cardBlock.appendChild(img)

	const highResImg = new Image()
	highResImg.src = cardPath
	highResImg.onload = () => {
		img.src = cardPath
	}

	newCell.addEventListener('click', () => {
		showForm(dateNum)
	})
}

const createEmptyCellsBefore = (y, m) => {
	for (let i = 0; i < getNumberOfFirstDay(y, m) - 1; i++) {
		createEmptyCellForDay()
	}
}

const createCells = (y, m) => {
	for (let i = 0; i < getLastDay(y, m); i++) {
		createCellForDay(i + 1)
	}
}

const createEmptyCellsAfter = (y, m) => {
	for (let i = 0; i < 7 - getNumberOfLastDay(y, m); i++) {
		createEmptyCellForDay()
	}
}

const renderCalendar = (y, m) => {
	calendarDates.innerHTML = ''
	createEmptyCellsBefore(y, m)
	createCells(y, m)
	createEmptyCellsAfter(y, m)
}

const introWrapper = document.querySelector('.intro__wrapper')
const introTitle = introWrapper.children[0].children[0]
const introCardWrapper = introWrapper.children[1]
const introCardImage = introCardWrapper.children[1]
const introCardName = introCardWrapper.children[2]
const helloText = document.querySelector('.hello-text')

const changeTitle = () => {
	const monthRu = [
		'январь',
		'февраль',
		'март',
		'апрель',
		'май',
		'июнь',
		'июль',
		'август',
		'сентябрь',
		'октябрь',
		'ноябрь',
		'декабрь'
	]
	introTitle.innerText = `Планер на картах Таро на ${monthRu[fullInfoObject.month - 1]} ${fullInfoObject.year} г.`
}

const changeMonthCardImage = () => {
	const cardPath = (fullInfoObject.monthCard.cardType === 'sa')
		? `./img/cards/${fullInfoObject.deck}/${fullInfoObject.monthCard.cardName}.jpg`
		: `./img/cards/${fullInfoObject.deck}/${fullInfoObject.monthCard.cardType}-${fullInfoObject.monthCard.cardName}.jpg`

	const cardPathMini = (fullInfoObject.monthCard.cardType === 'sa')
		? `./img/cards/${fullInfoObject.deck}/mini/${fullInfoObject.monthCard.cardName}.jpg`
		: `./img/cards/${fullInfoObject.deck}/mini/${fullInfoObject.monthCard.cardType}-${fullInfoObject.monthCard.cardName}.jpg`

	introCardImage.src = cardPathMini
	introCardImage.style.boxShadow = `0 0 7px 5px #${fullInfoObject.monthCard.color}`

	const highResImg = new Image()
	highResImg.src = cardPath
	highResImg.onload = () => {
		introCardImage.src = cardPath
	}
}

const changeMonthCardName = () => {
	const newName = createCardReadableCardname(fullInfoObject.monthCard.cardType, fullInfoObject.monthCard.cardName)

	introCardName.innerText = newName
}

const changeHelloText = () => {
	helloText.innerText = fullInfoObject.introText
}

const superStarTer = () => {
	applyTheme()
	renderCalendar(fullInfoObject.year, fullInfoObject.month)
	changeTitle()
	changeMonthCardImage()
	changeMonthCardName()
	changeHelloText()
}

loadLayout()

const wdayWrapper = document.getElementById("what-day__wrapper")
const wdayToggle = wdayWrapper.querySelector(".what-day__toggle")
const wdayInput = document.getElementById("wday-input")
const wdayBtn = document.querySelector(".what-day__btn")

wdayToggle.addEventListener("click", () => {
	const isOpen = wdayWrapper.getAttribute("data-state") === "open"
	wdayWrapper.setAttribute("data-state", isOpen ? "closed" : "open")
})

wdayInput.addEventListener("input", () => {
	wdayInput.value = wdayInput.value.replace(/\D/g, "")
	if (wdayInput.value.length > 2) {
		wdayInput.value = wdayInput.value.slice(0, 2)
	}
})

wdayBtn.addEventListener('click', () => {
	const dayNum = wdayInput.value.trim()
	if (!dayNum) return

	const targetId = `day${dayNum}`
	const targetEl = document.getElementById(targetId)

	if (targetEl) {
		targetEl.scrollIntoView({ behavior: "smooth", block: "center" })
	} else {
		wdayInput.value = ""
	}
})

introCardImage.addEventListener('click', () => {
	const cardPath = (fullInfoObject.monthCard.cardType === 'sa')
		? `./img/cards/${fullInfoObject.deck}/${fullInfoObject.monthCard.cardName}.jpg`
		: `./img/cards/${fullInfoObject.deck}/${fullInfoObject.monthCard.cardType}-${fullInfoObject.monthCard.cardName}.jpg`
	cardDisplayImg.src = cardPath

	const monthRus = [
		'Январь',
		'Февраль',
		'Март',
		'Апрель',
		'Май',
		'Июнь',
		'Июль',
		'Август',
		'Сентябрь',
		'Октябрь',
		'Ноябрь',
		'Декабрь'
	]
	cardDisplayInfoDate.innerText = monthRus[fullInfoObject.month - 1]
	cardDisplayInfoTitle.innerHTML = createCardReadableCardname(fullInfoObject.monthCard.cardType, fullInfoObject.monthCard.cardName)
	
	const currColor = fullInfoObject.monthCard.color
	const currDesc = fullInfoObject.monthCard.description
	if (fullInfoObject.monthCard.colorTwo) {
		const currColorTwo = fullInfoObject.monthCard.colorTwo
		cardDisplayInfoColor.children[1].style.display = 'block'
		cardDisplayInfoColor.children[0].style.setProperty('--card-color', `#${currColor}`)
		cardDisplayInfoColor.children[1].style.setProperty('--card-color', `#${currColorTwo}`)
		cardDisplayInfoColor.children[2].innerText = `Цвета энергий месяца. ${currDesc}`
	} else {
		cardDisplayInfoColor.children[1].style.display = 'none'
		cardDisplayInfoColor.children[0].style.setProperty('--card-color', `#${currColor}`)
		cardDisplayInfoColor.children[2].innerText = `Цвет энергий месяца. ${currDesc}`
	}

	if (fullInfoObject.monthCard.text === '') {
		cardDisplayInfoText.style.display = 'none'
	} else {
		cardDisplayInfoText.style.display = 'block'
	}
	cardDisplayInfoText.innerHTML = fullInfoObject.monthCard.text

	changeFormPosition()
	requestAnimationFrame(() => {
		cardDisplay.classList.add('show-on')
	})
})
