//global variables
let retrivedJsonEntries = [];
let currentJsonEntries = [];
let newJsonEntries = [];
let favoriteJsonEntries = [];

let fakeEntry = {
    "title": "fakeTitle",
    "link": "google.com",
    "pubDate": "Tue, 05 Mar 2024 20:34:35 GMT"
}

function createCard(entry) {
    let card = document.createElement('div');
    card.className = 'card shadow cursor-pointer';

    let cardBody = document.createElement('div');
    cardBody.className = 'card-body';

    //title with link
    let a = document.createElement('a'); 
    a.title = "cick to visit link"; 
    a.href = entry.link;
    a.target = "_blank";

    let cardTitle = document.createElement('h5');
    cardTitle.innerText = entry.title;
    cardTitle.className = 'card-title';
    a.appendChild(cardTitle)

    //date
    let cardDate = document.createElement('p');
    cardDate.innerText = entry.pubDate;
    cardDate.className = 'card-date';

    //add/remove button with function call
    let cardButton = document.createElement('button');
    cardButton.innerText = "add/remove";
    cardButton.className = 'card-fav';
    cardButton.onclick = function() {
        let hasValue = false;
        favoriteJsonEntries.forEach(item => {
            if (item.title == entry.title) {
                hasValue = true;
            }
        })

        if (!hasValue) { 
            favoriteJsonEntries.push(entry);
        } else {
            let idx = favoriteJsonEntries.indexOf(entry);
            favoriteJsonEntries.splice(idx, 1)
        }
        renderFavorites();
    }
    
    cardBody.appendChild(a);
    cardBody.appendChild(cardDate);
    cardBody.appendChild(cardButton);
    card.appendChild(cardBody);
    return card;

}

function getDifference(array1, array2) {
    return array1.filter(object1 => {
      return !array2.some(object2 => {
        return object1.title === object2.title;
      });
    });
  }

function renderJsonEntries() {
    const all_items = document.getElementsByClassName('all_items')[0];
    const unread = document.getElementsByClassName('unread')[0];

    if (currentJsonEntries.length == 0) {
        retrivedJsonEntries.forEach(entry => {
            unread.appendChild(createCard(entry))
        });
    } else {
        //move all entries to read, and keep new entries in unread

        retrivedJsonEntries.push(fakeEntry); //this if is for testing unread purposes

        unread.innerHTML = "";
        let diff = getDifference(retrivedJsonEntries, currentJsonEntries);
        diff.forEach(entry => {
            unread.appendChild(createCard(entry))
        });

        all_items.innerHTML = "";
        currentJsonEntries.forEach(entry => {
            all_items.appendChild(createCard(entry))
        });
    }
    currentJsonEntries = retrivedJsonEntries;
    // console.log(currentJsonEntries)
}

function renderFavorites() {
    const favorites = document.getElementsByClassName('favorites')[0];    
    favorites.innerHTML = "";
    favoriteJsonEntries.forEach(entry => {
        favorites.appendChild(createCard(entry))
    })
}

function handleRefeshFeed() {
    console.log('refreshing');
    callPHPFunction();
}

function callPHPFunction() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "rss.php", true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            var response = xhr.responseText;
            var parsedResponse = JSON.parse(response);
            retrivedJsonEntries = parsedResponse;
            renderJsonEntries();
            
            const currentDateTime = document.getElementsByClassName('currentDateTime')[0];
            let date = new Date();
            currentDateTime.innerText = "last updated at " + date;
        }
    };
    xhr.send();
}

callPHPFunction();
