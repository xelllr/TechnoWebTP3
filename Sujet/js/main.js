'use strict';

function loadGenres(genre) {

    const select_genre = document.querySelector(
        '#main > nav:nth-child(2) > form:nth-child(2) > select:nth-child(1)');

    loadArtist(genre[0]);

    genre.forEach(element => {
        const option = document.createElement('option');
        option.textContent = element.name;
        select_genre.add(option);
    });

    select_genre.addEventListener('change', () => {
        loadArtist(genre.find(element => element.name === select_genre.value));
    });
}

async function loadArtist(genre) {
    // change la description et le titre de la page
    const title = document.querySelector('#main > h2:nth-child(1)');
    title.textContent = `Top ${genre.name} artists`;
    const description = document.querySelector('#main > p:nth-child(3)');
    description.textContent = genre.description;

    // données sur les artistes du genre sélectionné
    const artists_data = await fetch(`http://127.0.0.1:3000/genres/${genre.id}/artists`);
    const artists = await artists_data.json();

    // on récupère l'élément html qui va contenir la liste de nos artistes
    const list_artist = document.querySelector('#main > ul:nth-child(4)');
    list_artist.innerHTML = '';

    // affichage des noms des artistes avec leur photo associée
    artists.forEach(artist => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = '#';
        a.id = artist.id;

        const h3 = document.createElement('h3');
        h3.textContent = artist.name;
        a.appendChild(h3);

        const img = document.createElement('img');
        img.src = artist.photo;
        a.appendChild(img);

        li.appendChild(a);
        list_artist.appendChild(li);

        a.addEventListener('click', (e) => {
            artistSelected(e);
        });
    });
}

async function artistSelected(evt){
    // récupération et remplissage des données
    const data = await fetch(`http://127.0.0.1:3000/artists/${evt.target.parentElement.id}/albums`);
    const albums = await data.json();
    const table = document.querySelector('#albums > table:nth-child(2) > tbody:nth-child(2)');
    table.innerHTML = '';
    albums.forEach(album => {
        const tr = document.createElement('tr');

        const cover = document.createElement('td');
        const img_cover = document.createElement('img');
        img_cover.src = album.cover;
        cover.appendChild(img_cover);
        tr.appendChild(cover);

        const title = document.createElement('td');
        title.textContent = album.title;
        tr.appendChild(title);

        const year = document.createElement('td');
        year.textContent = album.year;
        tr.appendChild(year);

        const label = document.createElement('td');
        label.textContent = album.label;
        tr.appendChild(label);

        table.appendChild(tr);
    });

    //affichage de la fenêtre
    const popup = await document.querySelector('#albums');
    popup.style.visibility = 'visible';
    popup.style.opacity = '1';
    popup.style.transition = '0.5s';

    // centrage de la fenêtre
    const body = document.querySelector('body');
    const body_width = body.clientWidth;
    const popup_width = popup.clientWidth;
    popup.style.left = `${(body_width - popup_width) / 2}px`;
    popup.style.top = '200px';

    // animation du bouton 'ok'
    const ok_button = document.querySelector('#albums > form:nth-child(3) > button:nth-child(1)');
    ok_button.addEventListener('click', () => {
        popup.style.visibility = 'hidden';
        popup.style.opacity = '0';
        popup.style.transition = '0.5s';
    });
}


fetch('http://localhost:3000/genres/')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        return response.json();
        //loadGenres(response.json());
    })
    .then(data => loadGenres(data))
    .catch(err => console.log('Erreur :', err));