/* TODO
- sorting contacts by name 
+ error message when fetch goes wrong
+ add event delegation to adding style before display items??
*/

//----------------- basic elements -------------------------------
const elements = {
    hamburger1: document.querySelector('.hamburger-1'),
    hamburger2: document.querySelector('.hamburger-2'),
    contactsList: document.querySelector('.contacts__list'),
    contactItem: document.querySelector('.contact__item'),
    searchInput: document.querySelector('.search__field'),
    errorWarning: document.querySelector('.error__warning'),
    subList: document.querySelector('.contact__item--details.sub-list'),
};

//------------------- change list density ------------------------
let state;
elements.hamburger1.addEventListener('click', () => {
    if (!elements.hamburger1.classList.contains('active')) {
        changeDensity();
        elements.contactsList.classList.remove('density');
        for (const e of elements.contactsList.children) { // DOM traversing
            e.classList.remove('density');
            e.children[1].classList.remove('density');
            e.children[0].children[0].classList.add('name')
            e.children[0].children[2].classList.add('location')
            // console.log(e)
        }
        state = 0;
        console.log(state)
    }
});

elements.hamburger2.addEventListener('click', () => {
    if (!elements.hamburger2.classList.contains('active')) {
        changeDensity();
        elements.contactsList.classList.add('density');
        for (const e of elements.contactsList.children) { // DOM traversing
            e.classList.add('density');
            e.children[1].classList.add('density');
            e.children[0].children[0].classList.remove('name')
            e.children[0].children[2].classList.remove('location')
            //console.log(e.children[0].children);
        }
        state = 1;
        console.log(state)
    }
});

const changeDensity = () => {
    elements.hamburger1.classList.toggle('active');
    elements.hamburger2.classList.toggle('active');
};

elements.contactsList.addEventListener('click', e => {
    console.log(e.target.closest('.contact__item'))
    e.target.closest('.contact__item').classList.toggle('density');
    e.target.closest('.contact__item').children[1].classList.toggle('density');
});
//---------------------------- infinity scroll ------------------------
function getDocumentHeight() {
	const body = document.body;
	const html = document.documentElement;
	
	return Math.max(
		body.scrollHeight, body.offsetHeight,
		html.clientHeight, html.scrollHeight, html.offsetHeight
	);
};

function getScrollTop() {
	return (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
}
let resNum=50;
window.onscroll = function() {
	if (getScrollTop() < getDocumentHeight() - window.innerHeight) return;
    console.log('page')
    resNum+=50;
    console.log(resNum)
    //change for pagination after 50 or 100 rows
};


//---------------------------- get data contacts ------------------------
async function getData() {
    try {
        const result = await fetch('/data/testContacts.json');
        const resultJson = await result.json();
        //console.log(resultJson);
        return (resultJson);


    } catch (error) {
        console.log(error);
        const errorMarkup = `
            <div class="error__warning">
                <p>Nie można załadować danych kontakowych. Odśwież stronę lub spróbuj później</p>
            </div>
        `;
        elements.contactsList.innerHTML = errorMarkup;
        //alert('Błąd wczytywania danych')
    }
}

let contacts;
getData().then(data => {
    contacts = data;
    let parialContacts = contacts.slice(0, resNum)
    console.log(data);
    const markup = parialContacts.map(persona => {
        return `
            <div class="contact__item">
                <ul class="contact__item--details">
                    <li class='name'>${persona.name}</li>
                    <li class='departament'>${persona.departament}</li>
                    <li class='location'>${persona.location}</li>
                    <li class='phone'>${persona.phone}</li>
                </ul>
                <ul class="contact__item--details sub-list">
                    <li class="title"></li>
                    <li class="group">${persona.group}</li>
                    <li></li>
                    <li class="secondPhone">${persona.secondPhone}</li>
                </ul>
            </div>  
        `;
    }).join('');
    elements.contactsList.innerHTML = markup;
});


//------------------------- search contacts ------------------------
const clearContactsList = () => {
    const items = document.querySelector('.contact__item');
    if (items) items.parentElement.removeChild(items);
}

const findMatches = (wordToMatch, contacts) => {
    console.log(contacts);
    return contacts.filter(person => {
        const regex = new RegExp(wordToMatch, 'gi');
        return person.name.match(regex) || person.location.match(regex) || person.phone.match(regex) || person.secondPhone.match(regex)
    });
}

function displayMatches() {
    // console.log(this.value);
    clearContactsList();
    const matchResult = findMatches(this.value, contacts);
    partialViewResult = matchResult.slice(0, 20);
    console.log(matchResult);
    console.log(partialViewResult);
    const markup = partialViewResult.map(person => {
        const regex = RegExp(this.value, 'gi');
        const personName = person.name.replace(regex, `<span class="hl">${this.value}</span>`);
        const personLocation = person.location.replace(regex, `<span class="hl uppercase">${this.value}</span>`);
        const personPhone = person.phone.replace(regex, `<span class="hl">${this.value}</span>`);
        const personSecondPhone = person.secondPhone.replace(regex, `<span class="hl">${this.value}</span>`);
        return `
        <div class="contact__item ${state == 1 ? 'density' : ''}">
            <ul class="contact__item--details">
                <li class='name'>${personName}</li>
                <li class='departament'>${person.departament}</li>
                <li class='location'>${personLocation}</li>
                <li class='phone'>${personPhone}</li>
            </ul>
            <ul class="contact__item--details sub-list ${state == 1 ? 'density' : ''}">
                <li class="title"></li>
                <li class="group">${person.group}</li>
                <li></li>
                <li class="secondPhone">${personSecondPhone}</li>
            </ul>
        </div>  
        `;
    }).join('');
    elements.contactsList.innerHTML = markup;
}

elements.searchInput.addEventListener('change', displayMatches);
elements.searchInput.addEventListener('keyup', displayMatches);

