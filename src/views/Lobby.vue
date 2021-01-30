<template>
<div>
    <section class="section-hero section-shaped my-0" style="min-height: 100vh;">

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
            <div class="px-3">
                <router-link to="/">
                    <!--img src="img/brand/blue.png" alt="logo"-->
                    <base-button type="white" size="sm">
                        <span class="spartan-bold text-primary">ciphertag</span>
                    </base-button>
                </router-link>
            </div>
            <div class="ml-auto px-3">
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
                                <span v-for="person in game.teams.spectators" :key="person"> {{person.split(":")[0]}}<small v-if="person == game.creatorid.join(':')" class="text-success spartan-bold"><i class="fa fa-star"></i></small><small v-if="person == user.gamerid" class="text-dark text-extrabold">(Me)</small>,</span>
                            </p>

                        </div>
                        <div class="text-center">
                            <base-button type="primary" @click="leave()" class="mt-3 text-capitalize spartan-regular">Leave Room</base-button>
                        </div>
                    </div>
                </base-dropdown>

            </div>
        </div>

        <div class=" shape-container d-flex align-items-center">
            <div class="col px-0">
                <div class="row justify-content-center align-items-center">
                         <div v-if="loading" class="col-lg-7 text-center mt-lg">
                    <div class="loader-white mx-auto my-auto">
                        <svg viewBox="0 0 80 80">
                            <rect x="8" y="8" width="64" height="64"></rect>
                        </svg>
                    </div>
                    <p class="text-white text-center spartan-medium"> setting up the lobby</p>
                </div>
                    <div v-else class="col-lg-7 text-center pt-lg">

                        <h1 class="display-4  text-white spartan-extrabold px-3">Welcome to the Lobby! Pick a side
                        </h1>
                        <p class=" text-white spartan-bold mb-0">Room: {{game.roomid}}</p>
                        <p class=" text-white spartan-bold mb-0">Room Owner: {{game.creatorid[0]}}</p>

                        <div class="p-4">
                            <base-alert type="secondary" v-if="error[0]">
                                <strong>!!!</strong> {{error[1]}}
                            </base-alert>

                            <card class="text-center ">

                                <div class="d-flex"><label class="mr-auto spartan-bold text-youtube">Red Team</label> <label class="ml-auto spartan-bold text-twitter">Blue Team</label></div>
                                <div class="d-flex">
                                    <a v-if="game.teams.red.spymaster.length == 0" class="avatar rounded-circle spartan-bold bg-grey text-white shadow hover">+</a>
                                    <a v-else class="avatar rounded-circle spartan-bold bg-youtube text-white shadow hover">{{game.teams.red.spymaster[0]}}</a>
                                    <div class="mr-auto">
                                        <div v-if="game.teams.red.operatives.length == 0" class="avatar-group">
                                            <a class="avatar rounded-circle spartan-bold bg-grey text-white shadow hover">+</a>
                                            <a class="avatar rounded-circle spartan-bold bg-grey text-white shadow hover">+</a>
                                            
                                        </div>
                                        <div v-else class="avatar-group">
                                            <a v-for="operative in game.teams.red.operatives" :key="operative" class="avatar rounded-circle spartan-bold bg-youtube text-white shadow hover">{{operative[0]}}</a>
                                            <a v-if="game.teams.red.operatives.length < 2" class="avatar rounded-circle spartan-bold bg-grey text-white shadow hover">+</a>
                                        </div>

                                    </div>

                                    <div class="ml-auto">

                                        <div v-if="game.teams.blue.operatives.length == 0" class="avatar-group">
                                            <a class="avatar rounded-circle spartan-bold bg-grey text-white shadow hover">+</a>
                                            <a class="avatar rounded-circle spartan-bold bg-grey text-white shadow hover">+</a>
                                        </div>
                                        <div v-else class="avatar-group">
                                            <a v-if="game.teams.blue.operatives.length < 2" class="avatar rounded-circle spartan-bold bg-grey text-white shadow hover">+</a>
                                            <a v-for="operative in game.teams.blue.operatives" :key="operative" class="avatar rounded-circle spartan-bold bg-twitter text-white shadow hover">{{operative[0]}}</a>

                                        </div>

                                    </div>
                                    <a v-if="game.teams.blue.spymaster.length == 0" class="avatar rounded-circle spartan-bold bg-grey text-white shadow hover">+</a>
                                    <a v-else class="avatar rounded-circle spartan-bold bg-twitter text-white shadow hover">{{game.teams.blue.spymaster[0]}}</a>

                                </div>
                                <div class="d-flex">
                                    <div class="mr-auto"></div>
                                    <div class="ml-auto"></div>
                                </div>
                                <div class="d-flex mt-3">
                                    <div class="mr-auto">
                                        <base-button size="sm" v-if="!(user.team == 'red' && user.role == 'operative')" type="youtube" @click="joinTeam('red', 'operative')" block>Join as Operative</base-button>
                                        <base-button size="sm" v-if="!(user.team == 'red' && user.role == 'spymaster')" type="youtube" @click="joinTeam('red', 'spymaster')" block>Join as Spymaster</base-button>
                                    </div>
                                    <div class="ml-auto">
                                        <base-button size="sm" v-if="!(user.team == 'blue' && user.role == 'operative')" type="twitter" @click="joinTeam('blue', 'operative')" block>Join as Operative</base-button>
                                        <base-button size="sm" v-if="!(user.team == 'blue' && user.role == 'spymaster')" type="twitter" @click="joinTeam('blue', 'spymaster')" block>Join as Spymaster</base-button>
                                    </div>

                                </div>

                                <p class="card-text spartan-regular mt-4">Wait for the room owner to start the game</p>
                                <label class="text-primary text-center spartan-medium">Invite players by sending them this link</label>

                                <div class="row col-lg-6 mx-auto">
                                    <div class="col mr-0">
                                        <base-input id="roomlink" label="" class="mb-3 spartan-medium" :value="'https://ciphertag.herokuapp.com/join/'+roomid" placeholder="https://ciphertag.herokuapp.com/join/xyz">
                                        </base-input>
                                    </div>
                                    <div class=" mx-0">
                                        <base-button v-if="!copied" @click="copy()" type="primary" class="px-3">
                                            <i class="fa fa-copy"></i>
                                        </base-button>
                                        <a v-if="copied" class="spartan-medium text-primary">Copied!</a>
                                    </div>

                                </div>
                                <div>
                                    <base-button size="sm" v-if="user.role != 'spectator'" :type="bgs[0]" @click="joinTeam('spectator', 'spectator')">Become a Spectator</base-button>
                                </div>

                                <div v-if="game.teams.spectators.length != 0">
                                    <p class="card-text spartan-regular mt-4">Spectators</p>
                                    <div class="avatar-group">
                                        <a v-for="spectator in game.teams.spectators" :key="spectator" class="avatar rounded-circle spartan-bold text-white shadow hover text-uppercase" :class="'bg-'+bgs[getRandomInt(0,10)]">{{spectator[0]}}</a>
                                        <a class="avatar rounded-circle spartan-bold text-white shadow hover bg-grey ">+</a>
                                    </div>
                                </div>

                            </card>

                            <div v-if="game.creatorid[0] == user.gamerid.split(':')[0]" class="btn-wrapper mt-3">
                                <base-button @click="start()" type="white" class="text-capitalize spartan-regular my-3">Start Game</base-button>
                                <base-button @click="reset()" type="white" class="text-capitalize spartan-regular my-3">Reset Teams</base-button>
                                <base-button @click="close()" type="outline-white" class="text-capitalize spartan-regular my-3" >Close Room</base-button>
                            </div>

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
    name: "lobby",
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
            loading: true,
            user: JSON.parse(sessionStorage.getItem("gameid")),
            roomid: this.$route.params.id,
            copied: false,
            connected: true,
            error: [false, ""],
            bgs: ['primary', 'yellow', 'twitter', 'facebook', 'pinterest', 'slack', 'dribbble', 'warning', 'youtube', 'success', 'youtube']

        }
    },
    methods: {
        start() {
            this.socket.emit("start", this.roomid);
        },
         close() {
            this.socket.emit("close", this.roomid);
        },

        joinTeam(team, role) {

            let req = {
                user: this.user,
                role: role,
                team: team,
            };
            this.socket.emit("joinTeam", req);
            this.socket.on("changeTeam", res => {
                if (res.code == 200) {
                    let user = res.user;
                    sessionStorage.setItem("gameid", JSON.stringify(user));
                    this.user = JSON.parse(sessionStorage.getItem("gameid"));
                } else {
                    let data = res.data;
                    this.error = [true, data];
                    this.loading = false;
                }
            });

        },

        reset() {
            this.socket.emit("reset", this.roomid);
        },
        leave() {
            this.socket.emit("leave", {
                roomid: this.roomid,
                gamerid: this.user.gamerid,
            });
            this.socket.on("lobby", res => {
                if (res.code == 382) {
                    sessionStorage.setItem("gameid", JSON.stringify(res.data));
                    sessionStorage.removeItem("room");
                    this.$router.push("/join");

                }
            });
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

        getRandomInt(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

    },
    created() {
        this.socket = io();
    },
    mounted() {

        this.socket.emit("lobby", this.roomid);
        this.socket.on("lobby", res => {
            if (res.code == 200) {
                let data = res.data;
                sessionStorage.setItem("room", JSON.stringify(data));
                this.game = data;
                this.error = [false, ""];
                this.loading = false;
            } else if (res.code == 102) {
                this.user.role = "";
                this.user.team = "";
                sessionStorage.setItem("gameid", JSON.stringify(this.user));
                this.user = JSON.parse(sessionStorage.getItem("gameid"));
                this.loading = false;
            } else if (res.code == 110) {
                this.user = JSON.parse(sessionStorage.getItem("gameid"));
                this.$router.push("/room/" + res.roomid);
                this.loading = false;
            } else if (res.code == 401) {
                this.error = [true, res.msg]
                this.loading = false;
            } else if (res.code == 400) {
                this.loading = false;
                this.$router.push("/404");
            } else if (res.code == 382) {
                sessionStorage.setItem("gameid", res.data);
                sessionStorage.removeItem("room");
                this.loading = false;
                this.$router.push("/join");

            }

        });

    },

};
</script>

<style scoped>

</style>
