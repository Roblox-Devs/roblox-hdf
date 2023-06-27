const axios = require('axios');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function removeSpecialCharacters(str) {
    const specialCharsRegex = /[^\w\s]/g;
    return str.replace(specialCharsRegex, '');
}

function getUsers(id, nextPageCursor, type) {
    let url = `https://games.roblox.com/v2`;
    if (type === 1) {
        url += `/groups/${id}/games?accessFilter=1&limit=100&sortOrder=Asc`;
    } else if (type === 2) {
        url += `/users/${id}/games?accessFilter=2&limit=50&sortOrder=Asc`;
    }

    if (nextPageCursor) {
        url += `&cursor=${nextPageCursor}`;
    }

    axios.get(url)
        .then(res => {
            const response = res.data.data;
            response.forEach(game => {
                console.log(`[${game.name}]: https://roblox.com/games/${game.rootPlace.id}`);
            });

            if (res.data.nextPageCursor) {
                getUsers(id, res.data.nextPageCursor, type);
            }
        });
}

rl.question('Specify type (group or user): ', type => {
    type = type.toLowerCase();

    if (type === 'group') {
        rl.question('Specify group id: ', id => {
            getUsers(id, null, 1);
            rl.close();
        });
    } else if (type === 'user') {
        rl.question('Specify user id: ', id => {
            getUsers(id, null, 2);
            rl.close();
        });
    }
});
