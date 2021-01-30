<template>
<div>
    <section class="section-hero section-shaped my-0">

        <div class="shape bg-primary">
            <ul class="circles">
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
            </ul>
        </div>
        <div class="px-2 py-3 d-flex">

            <div>
                <router-link slot="brand" class="navbar-brand mr-lg-5" to="/">
                    <!--img src="img/brand/blue.png" alt="logo"-->
                    <base-button type="white" size="sm">
                        <span class="spartan-bold text-primary">CODENAMES</span>
                    </base-button>
                </router-link>

            </div>
            <div class="ml-auto ">
                <span v-if="user.team != ''" class="text-white mr-3 spartan-bold text-capitalize">{{user.team}} Team</span>
                <base-dropdown menu-classes="dropdown-menu-lg dropdown-menu-right">

                    <a slot="title" class="avatar avatar-sm rounded-circle spartan-bold bg-white shadow">{{user.gamerid.split(":")[0][0]}}</a>

                    <div class="dropdown-menu-inner p-4">
                        <p class="text-center spartan-medium">Hi, {{user.gamerid.split(":")[0]}}</p>

                        <hr class="mt-1" />
                        <div>
                            <h6 class="text-dark spartan-medium">Players in this room</h6>
                            <p class="d-flex mb-2 small spartan-medium">
                                <span><i class="fa fa-circle small text-twitter"></i> {{game.teams.blue.spymaster.split(":")[0]}} <small v-if="game.teams.blue.spymaster == game.creatorid.join(':')" class="text-success spartan-bold"><i class="fa fa-star"></i></small><small v-if="game.teams.blue.spymaster == user.gamerid" class="text-dark text-extrabold">(Me)</small></span>
                            </p>
                            <p class="d-flex mb-2 small spartan-medium" v-for="person in game.teams.blue.operatives" :key="person">
                                <span><i class="fa fa-circle small text-twitter"></i> {{person.split(":")[0]}} <small v-if="person == game.creatorid.join(':')" class="text-success spartan-bold"><i class="fa fa-star"></i></small><small v-if="person == user.gamerid" class="text-dark text-extrabold">(Me)</small> </span>
                            </p>
                            <p class="d-flex mb-2 small spartan-medium">
                                <span><i class="fa fa-circle small text-youtube"></i> {{game.teams.red.spymaster.split(":")[0]}} <small v-if="game.teams.red.spymaster == game.creatorid.join(':')" class="text-success spartan-bold"><i class="fa fa-star"></i></small><small v-if="game.teams.red.spymaster == user.gamerid" class="text-dark text-extrabold">(Me)</small></span>
                            </p>
                            <p class="d-flex  mb-2 small spartan-medium" v-for="person in game.teams.red.operatives" :key="person">
                                <span><i class="fa fa-circle small text-youtube"></i> {{person.split(":")[0]}} <small v-if="person == game.creatorid.join(':')" class="text-success spartan-bold"><i class="fa fa-star"></i></small><small v-if="person == user.gamerid" class="text-dark text-extrabold">(Me)</small> </span>
                            </p>
                        </div>
                        <div>
                            <h6 class="text-dark spartan-medium">Spectators</h6>
                            <p class="mb-2 small">
                                <span v-for="person in game.teams.spectators" :key="person"> {{person.split(":")[0]}} <small v-if="person == game.creatorid.join(':')" class="text-success spartan-bold"><i class="fa fa-star"></i></small><small v-if="person == user.gamerid" class="text-dark text-extrabold">(Me)</small>,</span>
                            </p>

                        </div>
                        <div class="text-center">
                            <base-button type="primary" @click="leave()" class="mt-3 text-capitalize spartan-regular">Leave Room</base-button>
                        </div>
                    </div>
                </base-dropdown>

            </div>
        </div>

        <div class="px-3 py-3  d-flex align-items-center">
            <div id="game-view" class="player">

                <div id="status-line" v-if="winner[0]">
                    <div class="btn-group">
                        <base-button type="twitter" size="" class="text-capitalize  spartan-extrabold">{{game.points[0]}}</base-button>
                        <base-button type="youtube" size="" class="text-capitalize spartan-extrabold">{{game.points[1]}}</base-button>
                    </div>

                    <span class="mx-auto spartan-bold text-white text-capitalize">!!! {{winner[1]}}</span>

                </div>
                <div id="status-line" v-else>
                    <div class="btn-group">
                        <base-button type="twitter" size="" class="text-capitalize  spartan-extrabold">{{game.points[0]}}</base-button>
                        <base-button type="youtube" size="" class="text-capitalize spartan-extrabold">{{game.points[1]}}</base-button>
                    </div>
                    <div id="status" class="text-white"><span v-if="convertToTurn(user.team) == game.turn">Your</span><span v-else-if="game.turn == 1">Blue's</span> <span v-else-if="game.turn == 2">Reds's</span> turn</div>

                    <base-button v-if="game.turn == 1 && (user.role == 'spymaster' || convertToTurn(user.team) == game.turn)" @click="endturn(1)" type="white" size="sm" class="text-capitalize">End <span v-if="convertToTurn(user.team) != 1">blue's</span> turn</base-button>
                    <base-button v-if="game.turn == 2 && (user.role == 'spymaster' || convertToTurn(user.team) == game.turn)" @click="endturn(2)" type="white" size="sm" class="text-capitalize">End <span v-if="convertToTurn(user.team) != 2">red's</span> turn</base-button>
                </div>
                <!--div-- >
                    <h1 class="display-3 text-white spartan-bold text-center my-5">Red Won!</h1>
                </!--div-->
                <div v-if="loading" class="board">
                    <div class="loader-white mx-auto my-auto">
                        <svg viewBox="0 0 80 80">
                            <rect x="8" y="8" width="64" height="64"></rect>
                        </svg>
                    </div>
                </div>
                <div v-else>
                    <div v-if="user.role == 'spymaster'" class="board">

                        <div class="cell spymaster" :class="word[1] + ' ' + word[2]" v-for="word in game.words" :key="word.join('-')">
                            <span class="word small spartan-bold text-capitalize" role="button" aria-disabled="true" :aria-label="word[0]+','+word[1]+', revealed'">{{word[0]}}</span>
                        </div>

                    </div>
                    <div v-else class="board">

                        <div @click="flip(word)" class="cell hover" :class="word[1] + ' ' + word[2]" v-for="word in game.words" :key="word.join('-')">
                            <span class="word small spartan-medium text-capitalize" role="button" aria-disabled="true" :aria-label="word[0]+','+word[1]+','+word[2]">{{word[0]}}</span>
                        </div>
                    </div>
                </div>

                <div v-if="game.creatorid[0] == user.gamerid.split(':')[0]" class="btn-wrapper mt-3">
                    <base-button @click="next()" type="white" size="" class="text-capitalize">Next Game</base-button>
                     <base-button @click="close()" type="outline-white" class="text-capitalize spartan-regular">Close Room</base-button>

                </div>
                <div class="mt-5">
                    <label class="text-white spartan-medium">Invite players by sending them this link</label>

                    <div class="row">
                        <div class="col-10 mr-0">
                            <base-input label="" id="roomlink" class="mb-3 spartan-medium" :value="'https://ciphertag.herokuapp.com/join/'+roomid" placeholder="https://ciphertag.herokuapp.com/join/xyz">
                            </base-input>
                        </div>
                        <div class=" mx-0">
                            <base-button v-if="!copied" @click="copy()" type="white" class="px-2">
                                <i class="fa fa-copy"></i>
                            </base-button>
                            <a v-if="copied" class="spartan-medium text-white">Copied!</a>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    </section>

</div>
</template>

<script>
import io from "socket.io-client";
import BaseDropdown from "@/components/BaseDropdown";
import BaseButton from '../components/BaseButton.vue';
export default {
    name: "home",
    components: {
        BaseDropdown
    },
    data() {

        return {
            game: {
                roomid: "",
                creatorid: [],
                lastactive: "",
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
            },
            user: JSON.parse(sessionStorage.getItem("gameid")),
            roomid: this.$route.params.id,
            copied: false,
            connected: true,
            loading: true,
            winner: [false, ""]

        }
    },
    methods: {
          close() {
            this.socket.emit("close", this.roomid);
        },
        flip(word) {
            if (!this.winner[0]) {
                if (this.game.turn == this.convertToTurn(this.user.team)) {
                    let req = {
                        word: word,
                        roomid: this.roomid
                    }
                    this.socket.emit("flip", req);

                }
            }
        },
        endturn(currentturn) {
            this.socket.emit("endturn", {
                roomid: this.roomid,
                turn: this.game.turn
            });
        },

        next() {
            this.socket.emit("nextround", {
                roomid: this.roomid,
            });
        },

        leave() {
            this.socket.emit("leave", {
                roomid: this.roomid,
                gamerid: this.user.gamerid,
            });
            this.socket.on("lobby", res => {
                if (res.code == 382) {
                    sessionStorage.setItem("gameid", res.data);
                    sessionStorage.removeItem("room");
                    this.$router.push("/join");

                }
            });
        },
        convertToTurn(team) {
            if (team == "blue") {
                return 1;
            } else if (team == "red") {
                return 2;
            }
        },
        copy() {
            this.copied = true;
            var copyText = document.getElementById("roomlink");
            copyText.select();
            copyText.setSelectionRange(0, 99999);
            document.execCommand("copy");
            setTimeout(() => {
                this.copied = false;
            }, 3000);

        },

        gamewon(e) {
            let winner = e;
            this.winner = [true, e + " wins."]

        }

    },
    created() {
        this.socket = io();

    },
    mounted() {
        this.socket.emit("game", {
            roomid: this.roomid
        });
        this.socket.on("game", res => {
            if (res.code == 200) {
                let data = res.data;
                sessionStorage.setItem("room", JSON.stringify(data));
                this.game = data;
                this.user = JSON.parse(sessionStorage.getItem("gameid"));
                setTimeout(() => {
                    this.loading = false;
                }, 3000);
                if (res.winner != null) {
                    let winner = res.winner;
                    this.gamewon(winner);
                }
            } else if (res.code == 201) {
                this.$router.push("/lobby/" + this.$route.params.id);
            } else if (res.code == 382) {
                sessionStorage.removeItem("gameid");
                sessionStorage.removeItem("room");
                this.$router.push("/join");
            } else if (res.code == 400) {
                this.$router.push("/404");
            }

        });

    },
};
</script>

<style lang="scss" scoped>
.col-20 {
    flex: 0 0 18%;
    height: 60px;
}

#game-view,
.loading {
    width: 700px;
    margin: 0 auto;
}

#status-line {
    margin: 1em 0;
    display: flex;
    justify-content: space-between
}

.cell {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    width: 19%;
    height: 18%;
    transition: transform 0.3s;
    transform-style: preserve-3d;

}

.cell.hidden:active {
    transform: rotateY(180deg);
}

.cell.hidden {
    cursor: pointer;
}

.board {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    height: 500px
}

.board .neutral.revealed {
    background: #ede2cc;
}

.cell .word {
    vertical-align: middle;
    display: inline-block;
    word-break: break-all;
}

.cell {
    background: white;
    border-radius: 5px;
}

.spymaster.red.hidden {
    color: #d13030
}

.spymaster.blue.hidden {
    color: #1da1f2
}

.spymaster.black.hidden {
    background: #999;
    color: black;
}

.board .red.revealed {
    background: #d13030;
    color: #fff
}

.board .blue.revealed {
    background: #1da1f2;
    color: #fff
}

.board .black.revealed {
    background: #000;
    color: #fff
}

.dark-mode {
    background: #212121
}

.dark-mode h1 {
    color: #ccc
}

.dark-mode .cell {
    background: #757575
}

.dark-mode .codemaster .blue {
    color: #0d407b
}

.dark-mode .codemaster .red {
    color: #8c0f0f
}

.dark-mode .codemaster .blue.revealed,
.dark-mode .codemaster .red.revealed {
    color: #fff
}

.dark-mode .codemaster .black.hidden-word {
    background: #444
}

.dark-mode #end-turn-btn,
.dark-mode #mode-toggle button {
    background: #444;
    border: 1px solid #999;
    color: #bbb
}

.dark-mode #mode-toggle button.gear {
    background-color: transparent;
    border: none;
    color: #444
}

.dark-mode #remaining,
.dark-mode #timer {
    color: #eee
}

#game-view.full-screen {
    width: 98vw
}

.full-screen .board {
    height: 75vh
}

.full-screen .cell {
    font-size: 1.5vw
}

.full-screen #status-line {
    font-size: 3vh;
    margin: .25em 0
}

.full-screen #infoContent {
    justify-content: flex-end
}

@media (max-width: 1000px) {
    .full-screen .cell {
        font-size: 2.5vw
    }
}

@media (max-width:720px) {
    .text-sm {
        font-size: 80%
    }

}
</style>
