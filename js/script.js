const url = 'https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo';

const filter = document.querySelector('#filter');

const peopleList = document.querySelector('#peopleList');
const peopleListHeader = document.createElement('li');
peopleListHeader.className = 'collection-header';
const peopleListTitle = document.createElement('h4');

const maleNumberText = document.querySelector('#maleNumber');
const femaleNumberText = document.querySelector('#femaleNumber');
const ageSumText = document.querySelector('#ageSum');
const ageAverageText = document.querySelector('#ageAverage');

window.addEventListener('load', async function () {
	const schearchButton = document.querySelector('#search');

	schearchButton.addEventListener('click', find);
});

// Not needed because of the form submit default behavior, but made because was requested on the enunciated
filter.addEventListener('keyup', function (event) {
	if (event.keyCode === 13) {
		find(event);
	}
});

async function find(e) {
	e.preventDefault();

	try {
		await fetch(url, { mode: 'cors' })
			.then(response => response.json())
			.then(data => renderData(data));
	} catch (e) {
		alert(`Erro ao find usuários: ${e.message}`);
	}
}

function renderData(data) {
	const { results } = data;

	generateListHeader();

	const people = results.map(person => {
		return {
			name: `${person.name.first} ${person.name.last}`,
			picture: person.picture.thumbnail,
			age: person.dob.age,
			gender: person.gender,
		};
	});

	const peopleFiltered = doFilter(people);

	peopleListTitle.innerHTML =
		peopleFiltered.length > 0 ? `${peopleFiltered.length} usuário(s) encontrado(s)` : 'Nenhun usuário encontrado';

	let males = 0;
	let females = 0;

	peopleFiltered.forEach(person => {
		if (person.gender === 'male') {
			males++;
		} else if (person.gender === 'female') {
			females++;
		}

		peopleList.appendChild(generateListItem(person));
	});

	const ageSum = peopleFiltered.reduce((total, value) => (total += value.age), 0);
	const ageAverage = peopleFiltered.length > 0 ? ageSum / peopleFiltered.length : 0;

	maleNumberText.innerHTML = `Sexo masculino: ${males}`;
	femaleNumberText.innerHTML = `Sexo feminino: ${females}`;
	ageSumText.innerHTML = `Soma das idades: ${ageSum}`;
	ageAverageText.innerHTML = `Média das idades: ${ageAverage}`;
}

function doFilter(people) {
	let peopleFiltered = people.filter(value => value.name.toLowerCase().includes(filter.value.toLowerCase()));
	peopleFiltered.sort((a, b) => {
		if (a.name < b.name) return -1;
		else if (a.name > b.name) return 1;
		return 0;
	});

	return peopleFiltered;
}

function generateListHeader() {
	peopleList.innerHTML = '';
	peopleList.appendChild(peopleListHeader);
	peopleListHeader.appendChild(peopleListTitle);
}

function generateListItem(person) {
	let li = document.createElement('li');
	li.className = 'collection-item avatar valign-wrapper';

	let img = document.createElement('img');
	img.src = person.picture;
	img.alt = person.name;
	img.className = 'circle';
	li.appendChild(img);

	let span = document.createElement('span');
	span.className = 'title';
	span.appendChild(document.createTextNode(`${person.name}, ${person.age}`));
	li.appendChild(span);

	return li;
}
