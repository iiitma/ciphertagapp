const io = require('./index.js').io
const {
    verbs: verbs
} = require('./verbs.js');
const {
    v0_1: nouns
} = require('./nouns.js');





setInterval(() => {
    history.activerooms = getactiverooms();
    history.getactiveplayers = getactiveplayers();
    console.log(` \n ////////////////////////////////////// \n Server Status: \n Active Rooms - ${history.activerooms} \n Active Player - ${history.getactiveplayers} \n Total Number of Rooms (since last restart) - ${history.rooms.length} \n Total Number of Games (since last restart) - ${history.games} \n Total Number of Players (since last restart) - ${history.players.length} \n Logged at: ${new Date().toUTCString()} \n ////////////////////////////////////// \n`)

}, 20000);


setInterval(() => {
    deleteInactiveRooms();
}, 480000);





 history = {
    activerooms: 0,
    activeplayers: 0,
    games: 0,
    rooms: [],
    players: []
}
let rooms = []
let roomsdetails = [];


module.exports = function(socket){

    // sending to the client
    socket.emit("hello", "This server dey work o!");


    // create a new room
    socket.on("create", data => {
        let room = createroom(data);
        history.players = history.players.concat(data).filter(onlyUnique);
        console.log(room);
        history.rooms.push(room.roomid);
        rooms.push(room.roomid);
        roomsdetails.push(room);
        socket.emit("create", {
            code: 200,
            data: room,
        });
        console.log(`New Room created: ${room.roomid} by ${room.creatorid}`);
        console.log(`All rooms: ${rooms.join(',')} (${rooms.length})`);
    });


    // Close a room
    socket.on("close", data => {
        let roomid = data;
        if (rooms.includes(roomid)) {
            let index = rooms.indexOf(roomid);
            let room = roomsdetails[index];
            room.lastactive = new Date().getTime();;
            console.log(room);
            io.in(roomid).emit("lobby", {
                code: 400,
                data: "Room doesn't exist"
            });
            io.in(roomid).emit("game", {
                code: 400,
                data: "Room doesn't exist"
            });
            rooms.splice(index, 1);
            roomsdetails.splice(index, 1);
            console.log(`Room closed: ${room.roomid} closed by ${room.creatorid}`);
            console.log(`All rooms: ${rooms.join(',')} (${rooms.length})`);
        } else {
            let res = {
                code: 400,
                data: "Room doesn't exist"
            }
            socket.emit("lobby", res);
            console.log(`${roomid} : ${res.data}`);
        }



    });

    // join an existng room
    socket.on("join", data => {
        let roomid = data.roomid;
        let gamerid = data.gamerid;

        if (rooms.includes(roomid)) {
            let room = roomsdetails[rooms.indexOf(roomid)];

            if (room.status == 0) {
                room.lastactive = new Date().getTime();;
                if (room.people.includes(gamerid)) {
                    let res = {
                        code: 200,
                    }
                    socket.emit("join", res);
                    console.log(`${room.roomid} : ${gamerid} reconnected to lobby... (${room.people.length})`);
                } else if (room.people.length < 6) {
                    room.people.push(gamerid);
                    history.players = history.players.concat(gamerid).filter(onlyUnique);
                    let res = {
                        code: 200,
                    }
                    socket.emit("join", res);
                    console.log(`${room.roomid} : New player joined - ${gamerid}. (${room.people.length})`);
                } else {
                    let res = {
                        code: 401,
                        data: "Room is full. Join as a spectator"
                    }
                    socket.emit("join", res);
                    console.log(`${room.roomid} : Room is full. (${room.people.length})`);
                }

            } else if (room.status == 1) {
                room.lastactive = new Date().getTime();;
                if (room.people.includes(gamerid)) {
                    let res = {
                        code: 202,
                        data: room
                    }
                    socket.emit("join", res);
                    console.log(`${room.roomid} : ${gamerid} reconnected to game... (${room.people.length})`);
                } else {
                    let res = {
                        code: 401,
                        data: "Game as started. Join as a spectator"
                    }
                    socket.emit("join", res);
                    console.log(`${room.roomid} : Room is full. (${room.people.length})`);
                }
            }
        } else {
            let res = {
                code: 400,
                data: "Room doesn't exist"
            }
            socket.emit("join", res);
            console.log(`${roomid} : ${res.data}`);
        }

    });

    // join as a spectator
    socket.on("spectate", data => {
        let roomid = data.roomid;
        let gamerid = data.gamerid;
        let room = roomsdetails[rooms.indexOf(roomid)];

        if (rooms.includes(roomid)) {
            room.lastactive = new Date().getTime();;
            if (room.status == 0) {
                room.people.push(gamerid);
                room.teams.spectators.push(gamerid);
                let res = {
                    code: 200,
                    data: room,
                }
                socket.emit("spectate", res);
                console.log(`${room.roomid} : New Spectator joined - ${gamerid}. (${room.people.length})`);
            } else if (room.status == 1) {
                room.people.push(gamerid);
                history.players = history.players.concat(gamerid).filter(onlyUnique);
                room.teams.spectators.push(gamerid);
                let res = {
                    code: 201,
                    data: room,
                }
                socket.emit("spectate", res);
                console.log(`${room.roomid} : New Spectator joined - ${gamerid}. (${room.people.length})`);
            }
        } else {
            let res = {
                code: 400,
                data: "Room doesn't exist"
            }
            socket.emit("join", res);
            socket.emit("lobby", res);
            console.log(`${roomid} : ${res.data}`);
        }
    });

    // join a room lobby and get lobby updates
    socket.on("lobby", data => {
        let roomid = data;
        let room = roomsdetails[rooms.indexOf(roomid)];

        if (rooms.includes(roomid)) {
            room.lastactive = new Date().getTime();;
            if (room.status == 0) {
                socket.join(roomid);
                let res = {
                    code: 200,
                    data: room
                }
                io.in(roomid).emit("lobby", res);
                console.log(`${room.roomid} : ${room.people.length} player(s) in the lobby`);

            } else if (room.status == 1) {
                let res = {
                    code: 201,
                    data: room.roomid
                }
                socket.emit("lobby", res);
                console.log(`${room.roomid} : Game has started already!`);
            }
        } else {
            let res = {
                code: 400,
                data: "Room doesn't exist"
            }
            socket.emit("lobby", res);
            console.log(`${roomid} : ${res.data}`);
        }


    });

    // choose and switch between teams
    socket.on("joinTeam", data => {
        let roomid = data.user.roomid;
        let gamerid = data.user.gamerid;
        let team = data.team;
        let role = data.role;
        let room = roomsdetails[rooms.indexOf(roomid)];
        let update = data.user;

        if (!rooms.includes(roomid)) {
            let res = {
                code: 400,
                data: "Room doesn't exist"
            }
            socket.emit("lobby", res);
            console.log(`${roomid} : ${res.data}`);
            
        } else{
        room.lastactive = new Date().getTime();;
        if (room.status == 0) {
            if (role == "spymaster") {
                if (room.teams[team].spymaster.length < 1) {
                    if (room.teams[team].operatives.includes(gamerid)) {
                        room.teams[team].operatives.splice(room.teams[team].operatives.indexOf(gamerid), 1);
                    }
                    if (room.teams[altTeam(team)].operatives.includes(gamerid)) {
                        room.teams[altTeam(team)].operatives.splice(room.teams[altTeam(team)].operatives.indexOf(gamerid), 1);
                    }
                    if (room.teams[altTeam(team)].spymaster == gamerid) {
                        room.teams[altTeam(team)].spymaster = ""
                    }
                    if (room.teams.spectators.includes(gamerid)) {
                        room.teams.spectators.splice(room.teams.spectators.indexOf(gamerid), 1);
                    }
                    room.teams[team].spymaster = gamerid;
                    update.role = "spymaster";
                    update.team = team;
                    console.log(`${room.roomid} : ${gamerid} joined ${team} as ${role}`);
                }
            } else if (role == "operative") {

                if (room.teams[team].operatives.length < 2) {
                    if (room.teams[team].spymaster == gamerid) {
                        room.teams[team].spymaster = ""
                    }
                    if (room.teams[altTeam(team)].spymaster == gamerid) {
                        room.teams[altTeam(team)].spymaster = ""
                    }
                    if (room.teams[altTeam(team)].operatives.includes(gamerid)) {
                        room.teams[altTeam(team)].operatives.splice(room.teams[altTeam(team)].operatives.indexOf(gamerid), 1);
                    }
                    room.teams[team].operatives.push(gamerid);
                    if (room.teams.spectators.includes(gamerid)) {
                        room.teams.spectators.splice(room.teams.spectators.indexOf(gamerid), 1);
                    }
                    update.role = "operative";
                    update.team = team;
                    console.log(`${room.roomid} : ${gamerid} joined ${team} as ${role}`);
                }
            } else if (role == "spectator") {
                if (room.teams.blue.operatives.includes(gamerid)) {
                    room.teams.blue.operatives.splice(room.teams.blue.operatives.indexOf(gamerid), 1);
                }
                if (room.teams.red.operatives.includes(gamerid)) {
                    room.teams.red.operatives.splice(room.teams.red.operatives.indexOf(gamerid), 1);
                }
                if (room.teams.red.spymaster == gamerid) {
                    room.teams.red.spymaster = ""
                }
                if (room.teams.blue.spymaster == gamerid) {
                    room.teams.blue.spymaster = ""
                }
                room.teams.spectators.push(gamerid);
                update.role = "spectator";
                update.team = "spectator";
                console.log(`${room.roomid} : ${gamerid} joined as ${role}`);
            }
            let res = {
                code: 200,
                data: room,
            }
            io.in(roomid).emit("lobby", res);
            res.user = update;
            socket.emit("changeTeam", res);


        } else if (room.status == 1) {
            let res = {
                code: 201,
                data: room.roomid
            }
            socket.emit("lobby", res);
            console.log(`${room.roomid} : Game has started already!`);
        }
        }
    });

    // reset teams
    socket.on("reset", data => {
        let roomid = data;
        if (rooms.includes(roomid)) {
            let room = roomsdetails[rooms.indexOf(roomid)];
            room.lastactive = new Date().getTime();;
            room.status = 0; // 0 - lobby, 1 - room
            room.turn = 0; // 0 - default, 1 - blue, 2 - red
            room.points = [0, 0]; // blue, red
            room.teams.blue = {
                spymaster: "",
                operatives: [],
            };
            room.teams.red = {
                spymaster: "",
                operatives: [],
            };
            room.teams.spectators = room.people;

            let res = {
                code: 200,
                data: room
            }
            io.in(roomid).emit("lobby", res);
            console.log(`${room.roomid} : Room Reset`);
            io.in(roomid).emit("lobby", {
                code: 102,
            });
        } else {
            let res = {
                code: 400,
                data: "Room doesn't exist"
            }
            socket.emit("lobby", res);
            console.log(`${roomid} : ${res.data}`);
        }
    });


    // start the game
    socket.on("start", data => {
        let roomid = data;

        if (rooms.includes(roomid)) {

            let room = roomsdetails[rooms.indexOf(roomid)];
            history.games++

            if (room.teams.blue.operatives.length > 0 && room.teams.red.operatives.length > 0 && room.teams.blue.spymaster.length > 0 && room.teams.red.spymaster.length > 0) {
                room.lastactive = new Date().getTime();;
                room.status = 1; // 0 - lobby, 1 - room
                room.turn = getRandomInt(1, 2); // 0 - default, 1 - blue, 2 - red
                room.points = setPoints(room.turn); // blue, red
                room.words = createwords();
                io.in(roomid).emit("lobby", {
                    code: 200,
                    data: room
                });
                io.in(roomid).emit("lobby", {
                    code: 110,
                    roomid: roomid,
                });
                console.log(`${roomid} : Game Started!`);
            } else {
                io.in(roomid).emit("lobby", {
                    code: 401,
                    msg: "Not enough players. You need a Spymaster and atleast 1 Operative on each team."
                });
                console.log(`${roomid} : Not enough players. `);
            }


        } else {
            let res = {
                code: 400,
                data: "Room doesn't exist"
            }
            io.emit("lobby", res);
            console.log(`${roomid} : ${res.data}`);
        }
    });

    // updates the game
    socket.on("game", data => {
        let roomid = data.roomid;
        let room = roomsdetails[rooms.indexOf(roomid)];

        if (rooms.includes(roomid)) {
            room.lastactive = new Date().getTime();;
            if (room.status == 1) {
                socket.join(roomid);
                let res = {
                    code: 200,
                    data: room
                }
                io.in(roomid).emit("game", res);
                console.log(`${roomid} : Game points - blue ${room.points} red`);

            } else if (room.status == 0) {
                let res = {
                    code: 201,
                    data: room.roomid
                }
                socket.emit("game", res);
                console.log(`${roomid}: Game has not started yet`);
            }
        } else {
            let res = {
                code: 400,
                data: "Room doesn't exist"
            }
            socket.emit("game", res);
            console.log(`${roomid} : ${res.data}`);
        }

    });


    //flip a card
    socket.on("flip", data => {
        let word = data.word;
        let roomid = data.roomid;
        if (rooms.includes(roomid)) {
            let room = roomsdetails[rooms.indexOf(roomid)];
            room.lastactive = new Date().getTime();;
            let words = room.words;
            let id;
            for (const i in words) {
                if (words[i][0] == word[0]) {
                    id = +i;
                }
            }
            if (word[1] == "blue" && room.turn == 1) {
                let points = [room.points[0] - 1, room.points[1]];
                room.points = points
                room.words[id] = [word[0], word[1], "revealed"]
            } else if (word[1] == "red" && room.turn == 2) {
                let points = [room.points[0], room.points[1] - 1];
                room.points = points
                room.words[id] = [word[0], word[1], "revealed"]
            } else if (word[1] == "blue" && room.turn == 2) {
                room.turn = 1;
                let points = [room.points[0] - 1, room.points[1]];
                room.points = points
                room.words[id] = [word[0], word[1], "revealed"]
            } else if (word[1] == "red" && room.turn == 1) {
                room.turn = 2;
                let points = [room.points[0], room.points[1] - 1];
                room.points = points
                room.words[id] = [word[0], word[1], "revealed"]
            } else if (word[1] == "neutral") {
                if (room.turn == 1) {
                    room.turn = 2;
                } else if (room.turn == 2) {
                    room.turn = 1;
                }
                room.words[id] = [word[0], word[1], "revealed"];

            } else if (word[1] == "black") {
                if (room.turn == 1) {
                    let points = [room.points[0], 0];
                    room.points = points
                    room.words[id] = [word[0], word[1], "revealed"];
                } else if (room.turn == 2) {
                    let points = [0, room.points[1]];
                    room.points = points
                    room.words[id] = [word[0], word[1], "revealed"];
                }
            }

            let res = {
                code: 200,
                data: room
            }
            io.in(roomid).emit("game", res);
            console.log(`${roomid} : Game points - blue ${room.points} red`);

            if (room.points[0] == 0) {
                /*
                for (const i in room.words) {
                    room[2] = "revealed";
                } */

                let res = {
                    code: 200,
                    data: room,
                    winner: "blue"
                }

                io.in(roomid).emit("game", res);
                console.log(`${roomid} : Game Over - Blue Team Won`);

            }
            if (room.points[1] == 0) {
                /*
                for (const i in room.words) {
                    room[2] = "revealed";
                } */

                let res = {
                    code: 200,
                    data: room,
                    winner: "red"
                }

                io.in(roomid).emit("game", res);
                console.log(`${roomid} : Game Over - Red Team Won`);

            }




        } else {
            let res = {
                code: 400,
                data: "Room doesn't exist"
            }
            io.in(roomid).emit("game", res);
            console.log(`${roomid} : ${res.data}`);
        }
    });


    // End a teams turn
    socket.on("endturn", data => {
        let turn = data.turn;
        let roomid = data.roomid;

        if (rooms.includes(roomid)) {
            let room = roomsdetails[rooms.indexOf(roomid)];
            room.lastactive = new Date().getTime();;

            if (turn == 1) {
                room.turn = 2;
            } else if (turn == 2) {
                room.turn = 1;
            }
            let res = {
                code: 200,
                data: room
            }
            io.in(roomid).emit("game", res);
            console.log(`${roomid} : Turn changed to ${room.turn}`);
        } else {
            let res = {
                code: 400,
                data: "Room doesn't exist"
            }
            io.in(roomid).emit("game", res);
            console.log(`${roomid} : ${res.data}`);
        }
    });


    // Set up a new game 
    socket.on("nextround", data => {
        let roomid = data.roomid;
        if (rooms.includes(roomid)) {
            let room = roomsdetails[rooms.indexOf(roomid)];
            history.games++
            room.lastactive = new Date().getTime();;
            room.status = 0; // 0 - lobby, 1 - room
            room.turn = 0; // 0 - default, 1 - blue, 2 - red
            room.points = [0, 0]; // blue, red
            let res = {
                code: 201,
                data: room
            }
            io.in(roomid).emit("game", res);
            console.log(`${roomid} : New Game`);
        } else {
            let res = {
                code: 400,
                data: "Room doesn't exist"
            }
            io.in(roomid).emit("game", res);
            console.log(`${roomid} : ${res.data}`);
        }
    });


    // Leave a room
    socket.on("leave", data => {
        let roomid = data.roomid;
        let gamerid = data.gamerid;



        if (rooms.includes(roomid)) {
            let room = roomsdetails[rooms.indexOf(roomid)];
            room.lastactive = new Date().getTime();;
            if (room.people.includes(gamerid)) {

                room.people.splice(room.people.indexOf(gamerid), 1);
                if (room.teams.blue.operatives.includes(gamerid)) {
                    room.teams.blue.operatives.splice(room.teams.blue.operatives.indexOf(gamerid), 1);
                }
                if (room.teams.blue.spymaster == gamerid) {
                    room.teams.blue.spymaster = ""
                }
                if (room.teams.red.operatives.includes(gamerid)) {
                    room.teams.red.operatives.splice(room.teams.blue.operatives.indexOf(gamerid), 1);
                }
                if (room.teams.red.spymaster == gamerid) {
                    room.teams.red.spymaster = ""
                }
                if (room.teams.spectators.includes(gamerid)) {
                    room.teams.spectators.splice(room.teams.spectators.indexOf(gamerid), 1);
                }

                let res = {
                    code: 200,
                    data: room
                }
                io.in(roomid).emit("game", res);
                io.in(roomid).emit("lobby", res);
                let data = {
                    gamerid: gamerid,
                    role: "",
                    team: "",
                }

                socket.emit("game", {
                    code: 382,
                    data: data
                });
                socket.emit("lobby", {
                    code: 382,
                    data: data
                });
                console.log(`${room.roomid} : ${gamerid} left.(${room.people.length})`);
            }

        } else {
            let res = {
                code: 400,
                data: "Room doesn't exist"
            }
            socket.emit("lobby", res);
            socket.emit("game", res);
            console.log(`${roomid} : ${res.data}`);
        }

    });



    // Disconnect a socket
    socket.on('disconnect', () => {
       
    });

};









/////////////////////////////////////HELPERS/////////////////////////////////////



function altTeam(team) {
    if (team == 'red') {
        return 'blue';
    } else if (team == 'blue') {
        return 'red';
    }
}

function createroom(e) {
    let room = {
        roomid: "",
        creatorid: [],
        lastactive: new Date().getTime(),
        status: 0, // 0 - lobby, 1 - room
        points: [0, 0], // blue, red
        turn: 0, // 0 - default, 1 - blue, 2 - red
        teams: {
            blue: {
                spymaster: "",
                operatives: [],
            },
            red: {
                spymaster: "",
                operatives: [],
            },
            spectators: []
        },
        people: [],
        words: []
    }
    room.roomid = createroomid();
    room.creatorid = e.split(':');
    room.people.push(e);

    return room;
}

function createroomid() {
    let result = [];
    for (i = 0; i < 3; i++) {
        let rand = getRandomInt(0, 633);
        result.push(verbs[rand]);
    }

    return result.join("-");
}

function getwords(limit) {
    let result = [];
    for (i = 0; i < limit; i++) {
        let rand = getRandomInt(0, nouns.length - 1);
        while (result.includes(nouns[rand])) {
            rand = getRandomInt(0, nouns.length - 1);
        };
        result.push(nouns[rand]);
    }

    return result
}

function createwords() {
    let words = getwords(25);
    let result = [];
    let id = getRandomArray(0, 24, 19);
    let red = id.slice(0, 9);
    let blue = id.slice(9, 18);
    let black = id.slice(18);

    for (i = 0; i < words.length; i++) {
        let word = [words[i], "neutral", "hidden"]
        if (red.includes(i)) {
            word[1] = "red"
        } else if (blue.includes(i)) {
            word[1] = "blue"
        } else if (black.includes(i)) {
            word[1] = "black"
        }
        result.push(word);
    }

    return result;

}

function setPoints(turn) {
    if (turn == 1) {
        return [9, 8]
    } else if (turn == 2) {
        return [8, 9];
    }
}

    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }


    function getRandomArray(min, max, length) {
        let result = [];
        for (i = 0; i < length; i++) {
            let int = getRandomInt(min, max);
            while (result.includes(int)) {
                int = getRandomInt(min, max);
            };
            result.push(int);
        }
        return result;
    }


function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

function getactiverooms() {
    let result = 0;
    for (const i in roomsdetails) {
        let room = roomsdetails[i];
        if (room.lastactive > new Date(new Date().getTime() - 90000).getTime()) {
            result++;
        }
    }
    return result;
}

function getactiveplayers() {
    let result = 0;
    for (const i in roomsdetails) {
        let room = roomsdetails[i];

        result = result + room.people.length
    }
    return result;
}

function deleteInactiveRooms() {
    for (const i in roomsdetails) {
        let room = roomsdetails[i];
        let roomid = roomsdetails[i].roomid;
        if (room.lastactive < new Date(new Date().getTime() - 600000).getTime()) {
            roomsdetails.splice(i, 1);
            rooms.splice(i, 1);
            console.log(`\n ////////////////////////////////////// \n Inactive Room: ${roomid} deleted \n Time ${new Date().toUTCString()} \n ////////////////////////////////////// \n`)
        }
    }
}