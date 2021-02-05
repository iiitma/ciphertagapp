<template>
  <section class="section-hero bg-primary" >
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
    <div class="container shape-container align-items-center" style="padding: 20vh 0;
    position: relative;">
      <div class="row justify-content-center">
        <div class="col-lg-5 col-md-8">

          <card
            type="secondary"
            shadow
            header-classes="bg-white pb-5"
            body-classes="px-lg-5 py-lg-5"
            class="border-0"
          >
            <template>
              <div class="text-center">
                <h4 class="text-dark spartan-bold">Welcome to CipherTag!</h4>
         
              </div>
            </template>
            <template>
      

              <p v-if="!alt" class="spartan-medium text-center mb-1">
                Room: {{ room }}
              </p>
              <p v-if="error[0]" class="text-danger spartan-medium text-center">
                {{ error[1] }}
              </p>
              <form v-if="!spectate" role="form" @submit.prevent="join()">
                <p
                  class="spartan-medium text-center mt-3 mb-0"
                  v-if="!newPerson"
                >
                  Hey {{ username }},
                </p>
                <div v-if="alt">
                  <label class="spartan-regular">Enter Room ID</label>
                  <base-input
                    label=""
                    name="username"
                    class="mb-3 spartan-medium"
                    v-model="room"
                    placeholder="Room ID"
                    addon-left-icon="ni ni-user-02"
                  >
                  </base-input>
                </div>

                <label class="spartan-regular" v-if="newPerson"
                  >To enter the room, choose a nickname.</label
                >
                <base-input
                  v-if="newPerson"
                  label=""
                  name="username"
                  class="mb-3 spartan-medium"
                  v-model="username"
                  placeholder="Nickname"
                  addon-left-icon="ni ni-user-02"
                >
                </base-input>

                <div class="text-center">
                  <base-button
                    v-if="!loading"
                    type="primary"
                    nativeType="submit"
                    class="my-4 text-capitalize"
                    >Join Room</base-button
                  >
                  <div v-else class="loader">
                    <svg viewBox="0 0 80 80">
                      <rect x="8" y="8" width="64" height="64"></rect>
                    </svg>
                  </div>
                </div>
                <div class="text-center">
                  <router-link class="spartan-medium mx-auto" to="/create"
                    >or create a room</router-link
                  >
                </div>
              </form>

              <form
                v-if="spectate"
                role="form"
                @submit.prevent="joinSpectate()"
              >
                <p
                  class="spartan-medium text-center mt-3 mb-0"
                  v-if="!newPerson"
                >
                  Hey {{ username }},
                </p>
                <div v-if="alt">
                  <label class="spartan-regular">Enter Room ID</label>
                  <base-input
                    label=""
                    name="username"
                    class="mb-3 spartan-medium"
                    v-model="room"
                    placeholder="Room ID"
                    addon-left-icon="ni ni-user-02"
                  >
                  </base-input>
                </div>

                <label class="spartan-regular" v-if="newPerson"
                  >To enter the room, choose a nickname.</label
                >
                <base-input
                  v-if="newPerson"
                  label=""
                  name="username"
                  class="mb-3 spartan-medium"
                  v-model="username"
                  placeholder="Nickname"
                  addon-left-icon="ni ni-user-02"
                >
                </base-input>

                <div class="text-center">
                  <base-button
                    v-if="!loading"
                    type="primary"
                    nativeType="submit"
                    class="my-4 text-capitalize"
                    >Spectate Room</base-button
                  >
                  <div v-else class="loader">
                    <svg viewBox="0 0 80 80">
                      <rect x="8" y="8" width="64" height="64"></rect>
                    </svg>
                  </div>
                </div>
                <div class="text-center">
                  <router-link class="spartan-medium mx-auto" to="/create"
                    >or create a room</router-link
                  >
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
import { v4 as uuidv4 } from "uuid";
import io from "socket.io-client";
export default {
  name: "create",
  data() {
    return {
      username: "",
      language: "English",
      room: "",
      loading: false,
      error: [false, ""],
      alt: false,
      spectate: false,
      newPerson: true,
      gamerid: null,
    };
  },
  methods: {
    convertToID(e) {
      let array = e.split("/");
      let count = array.length;
      if (count > 1) {
        return array[count - 1];
      } else {
        return e;
      }
    },
    join() {
      this.room = this.convertToID(this.room);
      this.loading = true;
      let gamerid = JSON.parse(localStorage.getItem("gamerid"));
      let uid;
      if (gamerid != null) {
        if (gamerid.split(":")[0] == this.username) {
          uid = gamerid;
          console.log(`uid: ${uid}`);
        } else {
          uid = [this.username, gamerid.split(":")[1]].join(":");
          localStorage.setItem("gamerid", JSON.stringify(uid));
          console.log(`uid: ${uid}`);
        }
      } else {
        uid = [this.username, uuidv4(this.username)].join(":");
        localStorage.setItem("gamerid", JSON.stringify(uid));
        console.log(`uid: ${uid}`);
      }
      let req = {
        gamerid: uid,
        roomid: this.room,
      };
      this.socket.emit("join", req);
      this.socket.on("join", (res) => {
        if (res.code == 200) {
          let data = res.data;
          let gameid = {
            gamerid: uid,
            roomid: this.room,
            team: "",
            role: "",
          };
          sessionStorage.setItem("gameid", JSON.stringify(gameid));
          this.loading = false;
          this.$router.push("/lobby/" + this.room);
        } else if (res.code == 202) {
          let data = res.data;
          let gameid = JSON.parse(sessionStorage.getItem("gameid"));
          if (gameid.roomid == data.roomid) {
            this.loading = false;
            this.$router.push("/room/" + this.room);
          } else {
            gameid.roomid = this.room;

            if (data.teams.blue.spymaster == gamerid) {
              gameid.role = "spymaster";
              gameid.team = "blue";
            } else if (data.teams.red.spymaster == gamerid) {
              gameid.role = "spymaster";
              gameid.team = "red";
            } else if (data.teams.blue.operatives.includes(gamerid)) {
              gameid.role = "operative";
              gameid.team = "blue";
            } else if (data.teams.red.operatives.includes(gamerid)) {
              gameid.role = "operative";
              gameid.team = "red";
            }
            sessionStorage.setItem("gameid", JSON.stringify(gameid));
            this.loading = false;
            this.$router.push("/room/" + this.room);
          }
        } else if (res.code == 401) {
          let data = res.data;
          this.error = [true, data];
          this.spectate = true;
          this.loading = false;
        } else if (res.code == 400) {
          let data = res.data;
          this.error = [true, data];
          this.loading = false;
        }
      });
    },
    joinSpectate() {
      this.room = this.convertToID(this.room);
      this.loading = true;
      let gamerid = JSON.parse(localStorage.getItem("gamerid"));
      let uid;
      console.log(`gamerid: ${gamerid}`);
      console.log(`uid1: ${uid}`);
      if (gamerid != null) {
        if (gamerid.split(":")[0] == this.username) {
          uid = gamerid;
          console.log(`uid2: ${uid}`);
        } else {
          uid = [this.username, gamerid.split(":")[1]].join(":");
          localStorage.setItem("gamerid", JSON.stringify(uid));
          console.log(`uid3: ${uid}`);
        }
      } else {
        uid = [this.username, uuidv4(this.username)].join(":");
        localStorage.setItem("gamerid", JSON.stringify(uid));
        console.log(`uid4: ${uid}`);
      }
      let req = {
        gamerid: uid,
        roomid: this.room,
      };
      console.log(`req: ${req.gamerid}, ${req.roomid}`);

      this.socket.emit("spectate", req);
      this.socket.on("spectate", (res) => {
        console.log(`res: ${res.code}`);
        if (res.code != 400) {
          let data = res.data;
          let gameid = {
            gamerid: uid,
            roomid: this.room,
            team: "",
            role: "",
          };
          if (data.teams.spectators.includes(gamerid)) {
            gameid.role = "spectator";
            gameid.team = "spectator";
          }
          sessionStorage.setItem("gameid", JSON.stringify(gameid));
          this.loading = false;

          if (res.code == 200) {
            this.$router.push("/lobby/" + this.room);
          } else if (res.code == 201) {
            this.$router.push("/room/" + this.room);
          }
        } else if (res.code == 400) {
          let data = res.data;
          this.error = [true, data];
          this.loading = false;
        }
      });
    },
  },
  created() {
    this.socket = io();
    var gamerid = JSON.parse(localStorage.getItem("gamerid"));
    if (gamerid != null) {
      this.username = gamerid.split(":")[0];
      this.newPerson = false;
    }
    if (this.$route.params.id == undefined) {
      this.alt = true;
    } else {
      this.room = this.$route.params.id;
    }
  },
};
</script>

<style></style>
