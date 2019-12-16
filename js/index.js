/* TODO
- sorting contacts by name 
- error message when fetch goes wrong
- add event delegation to adding style before display items??
- all doesnt work, singe is ok? - event delegation
*/

//----------------- basic elements -------------------------------
const elements = {
    hamburger1: document.querySelector('.hamburger-1'),
    hamburger2: document.querySelector('.hamburger-2'),
    contactsListItemAll: document.querySelectorAll('.contact__item--list'),
    contactsList: document.querySelector('.contacts__list'),
    contactsItemAll: document.querySelectorAll('.contact__item'),
    searchInput: document.querySelector('.search__field'),
};

//------------------- change list density ------------------------
elements.hamburger1.addEventListener('click', () => {
    if (elements.hamburger1.classList.contains('active')) {

    } else {
        changeDensity();
        elements.contactsList.style.fontSize = '2rem';
        for (const e of elements.contactsList.children) { // DOM traversing
            e.style.margin = '.8rem 0rem'
        }
    }

});

elements.hamburger2.addEventListener('click', () => {
    if (elements.hamburger2.classList.contains('active')) {

    } else {
        changeDensity();
        elements.contactsList.style.fontSize = '1.5rem';
        for (const e of elements.contactsList.children) { // DOM traversing
            //console.log(e);
            e.style.margin = '.5rem 0rem'
        }
    }
});

const changeDensity = () => {
    elements.hamburger1.classList.toggle('active');
    elements.hamburger2.classList.toggle('active');
};


//---------------------------- get data contacts ------------------------
async function getData() {
    try {
        const result = await fetch('/data/contacts.json');
        const resultJson = await result.json();
        console.log(resultJson);
        return (resultJson);


    } catch (error) {
        console.log(error);
        alert('Błąd wczytywania danych')
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
                    <li class='title'>${person.title}</li>
                    <li class='phone'>${person.phone}</li>
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
        return person.name.match(regex) || person.departament.match(regex) || person.phone.match(regex)
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
        return `
        <div class="contact__item">
            <ul class="contact__item--list">
                <li class='name'>${personName}</li>
                <li class='departament'>${personDepartament}</li>
                <li class='title'>${person.title}</li>
                <li class='phone'>${personPhone}</li>
            </ul>
        </div>  
        `;
    }).join('');
    elements.contactsList.innerHTML = markup;
}

elements.searchInput.addEventListener('change', displayMatches);
elements.searchInput.addEventListener('keyup', displayMatches);

