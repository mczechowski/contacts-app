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
    subList: document.querySelector('.contact__item--list.sub-list'),
};

//------------------- change list density ------------------------
elements.hamburger1.addEventListener('click', () => {
    if (elements.hamburger1.classList.contains('active')) {

    } else {
        changeDensity();
        elements.contactsList.style.fontSize = '1.9rem';
        for (const e of elements.contactsList.children) { // DOM traversing
            e.style.margin = '.8rem 0rem';
            e.children[1].style.display = 'grid';
        }
    }

});

elements.hamburger2.addEventListener('click', () => {
    if (elements.hamburger2.classList.contains('active')) {

    } else {
        changeDensity();
        elements.contactsList.style.fontSize = '1.6rem';
        for (const e of elements.contactsList.children) { // DOM traversing
            console.log(e.children[1]);
            e.style.margin = '.5rem 0rem';
            e.children[1].style.display = 'none';
        }
    
    }
});

const changeDensity = () => {
    elements.hamburger1.classList.toggle('active');
    elements.hamburger2.classList.toggle('active');
};

elements.contactsList.addEventListener('click', e => {
    //dziala na dane z pliku html a nie pobranie z jsona
    //create high density class in css
    //toggle this class
    console.log(e.target.closest('.contact__item'))
    e.target.closest('.contact__item').style.fontSize = '1.6rem';
    
});

//---------------------------- get data contacts ------------------------
async function getData() {
    try {
        const result = await fetch('/data/contacts.json');
        const resultJson = await result.json();
        console.log(resultJson);
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
    contacts = data
    const markup = contacts.map(person => {
        //console.log(person);
        return `
            <div class="contact__item">
                <ul class="contact__item--list">
                    <li class='name'>${person.name}</li>
                    <li class='departament'>${person.departament}</li>
                    <li class='location'>${person.location}</li>
                    <li class='phone'>${person.phone}</li>
                </ul>
                <ul class="contact__item--list sub-list">
                       <li class="title">${person.title}</li>
                       <li class="group">${person.group}</li>
                       <li class="other">${person.other}</li>
                       <li class="secondPhone">${person.secondPhone}</li>
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
    return contacts.filter(person => {
        const regex = new RegExp(wordToMatch, 'gi');
        return person.name.match(regex) || person.departament.match(regex) || person.phone.match(regex) || person.secondPhone.match(regex)
    });
}

function displayMatches() {
    // console.log(this.value);
    clearContactsList();
    const matchResult = findMatches(this.value, contacts);
    console.log(matchResult);
    const markup = matchResult.map(person => {
        const regex = RegExp(this.value, 'gi');
        const personName = person.name.replace(regex, `<span class="hl">${this.value}</span>`);
        const personDepartament = person.departament.replace(regex, `<span class="hl uppercase">${this.value}</span>`);
        const personPhone = person.phone.replace(regex, `<span class="hl">${this.value}</span>`);
        const personSecondPhone = person.secondPhone.replace(regex, `<span class="hl">${this.value}</span>`);
        return `
        <div class="contact__item">
            <ul class="contact__item--list">
                <li class='name'>${personName}</li>
                <li class='departament'>${personDepartament}</li>
                <li class='title'>${person.location}</li>
                <li class='phone'>${personPhone}</li>
            </ul>
            <ul class="contact__item--list sub-list">
                <li class="title">${person.title}</li>
                <li class="group">${person.group}</li>
                <li class="other">${person.other}</li>
                <li class="secondPhone">${personSecondPhone}</li>
            </ul>
        </div>  
        `;
    }).join('');
    elements.contactsList.innerHTML = markup;
}

elements.searchInput.addEventListener('change', displayMatches);
elements.searchInput.addEventListener('keyup', displayMatches);

