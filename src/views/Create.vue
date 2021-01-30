<template>
<section class="section-hero section-shaped my-0">

    <div class="shape shape-skew bg-primary">
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
    <div class="container shape-container align-items-center">
        <div class="row justify-content-center">
            <div class="col-lg-5 col-md-8">
                <card type="secondary" shadow header-classes="bg-white pb-5" body-classes="px-lg-5 py-lg-5" class="border-0">
                    <template>
                        <div class="text-center">
                            <h4 class="text-dark spartan-bold">Welcome to Codenames!</h4>
                            <!--a href="#!" class="avatar rounded-circle" style="height: 100px; width: 100px">
    <img alt="Image placeholder" src="img/theme/team-4-800x800.jpg">
</a-->

                        </div>

                    </template>
                    <template>
                        <!--div-- class="text-center text-muted mb-4">
                              <base-button size="sm" type="primary">Randomize</base-button>
                            </!--div-->
                        <form role="form" @submit.prevent="create()">
                            <!--base-input-- label="Language" >
                                <select v-model="language" class="form-control form-control-sm spartan-medium">
                                    <option value="English">English</option>
                                </select>
                            </!--base-input-->

                            <label>To enter the room, choose a nickname.</label>
                            <base-input label="" class="mb-3 spartan-medium" v-model="username" placeholder="Nickname" addon-left-icon="ni ni-user-02">
                            </base-input>
                            <div class="text-center">
                                <base-button v-if="!loading" type="primary" nativeType="submit" class="my-4 text-capitalize">Create Room</base-button>
                                <div v-else class="loader">
                                    <svg viewBox="0 0 80 80">
                                        <rect x="8" y="8" width="64" height="64"></rect>
                                    </svg>
                                </div>
                            </div>
                            <div class="text-center">

                                <router-link class="spartan-medium mx-auto" to="/join">or join a room</router-link>
                            </div>

                        </form>
                    </template>
                </card>

            </div>
        </div>
    </div>
</section>
</template>

<script>
import {
    v4 as uuidv4
} from 'uuid';
import io from "socket.io-client";
export default {
    name: "create",
    data() {
        return {
            loading: false,
            socket: {},
            username: "",
            language: "English",
            error: [false, ""]
        }
    },
    methods: {
        create() {
            this.loading = true;
            let gamerid = JSON.parse(sessionStorage.getItem('gamerid'));
            let uid;
            if (gamerid != null) {
                if (gamerid.split(":")[0] == this.username) {
                    uid = gamerid;
                    console.log(`uid: ${uid}`);
                } else {
                    uid = [this.username, gamerid.split(":")[1]].join(':');
                    sessionStorage.setItem("gamerid", JSON.stringify(uid));
                    console.log(`uid: ${uid}`);
                }

            } else {
                uid = [this.username, uuidv4(this.username)].join(':');
                sessionStorage.setItem("gamerid", JSON.stringify(uid));
                console.log(`uid: ${uid}`);
            }
            this.socket.emit("create", uid);
            this.socket.on("create", res => {
                if (res.code == 200) {
                    let game = res.data;
                    let gameid = {
                        gamerid: uid,
                        roomid: game.roomid,
                        team: "",
                        role: ""
                    };
                    sessionStorage.setItem("gameid", JSON.stringify(gameid));
                    this.loading = false;
                    this.$router.push("/lobby/" + game.roomid);
                }
            });
        }
    },
    created() {
        this.socket = io();
        var gamerid = JSON.parse(sessionStorage.getItem('gamerid'));
        if (gamerid != null) {
            this.username = gamerid.split(":")[0];
        }
    },

};
</script>

<style scoped>

</style>
