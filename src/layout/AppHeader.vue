<template>
<header class="header-global">
    <base-nav class="navbar-main" transparent type="" effect="light" expand>
        <router-link slot="brand" class="navbar-brand mr-lg-5" to="/">
            <!--img src="img/brand/blue.png" alt="logo"-->
            <base-button type="white" size="sm">
                <span class="spartan-bold text-primary">CIPHERTAG</span>
            </base-button>
        </router-link>

        <div class="row" slot="content-header" slot-scope="{closeMenu}">
            <div class="col-6 collapse-brand">
                <router-link slot="brand" class="navbar-brand mr-lg-5" to="/">
            
                    <base-button type="primary" size="sm">
                        <span class="spartan-bold">CIPHERTAG</span>
                    </base-button>
                </router-link>
            </div>
            <div class="col-6 collapse-close">
                <close-button @click="closeMenu"></close-button>
            </div>
        </div>

        <ul class="navbar-nav align-items-lg-center ml-lg-auto">
            <li class="nav-item" v-if="user != null">
                 <router-link class="nav-link nav-link-icon"  to="">
                  <span class="nav-link-inner--text d-lg-none spartan-medium">
                      Hi {{user.split(":")[0]}}
                  </span>
                 </router-link>
               </li>
            <li class="nav-item">
                <router-link class="nav-link nav-link-icon" to="/howtoplay">
                    <span class="nav-link-inner--text spartan-medium ">How to play</span>
                </router-link>

            </li>
           
              <li class="nav-item" v-if="user == null">
                    <router-link class="nav-link nav-link-icon"  to="/">

                    <a class="avatar rounded-circle bg-transparent d-lg-flex d-none" >
                        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-alien " width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M11 17a2.5 2.5 0 0 0 2 0" />
                        <path d="M12 3c-4.664 0 -7.396 2.331 -7.862 5.595a11.816 11.816 0 0 0 2 8.592a10.777 10.777 0 0 0 3.199 3.064c1.666 1 3.664 1 5.33 0a10.777 10.777 0 0 0 3.199 -3.064a11.89 11.89 0 0 0 2 -8.592c-.466 -3.265 -3.198 -5.595 -7.862 -5.595z" />
                        <line x1="8" y1="11" x2="10" y2="13" />
                        <line x1="16" y1="11" x2="14" y2="13" />
                    </svg></a>
               <span class="nav-link-inner--text d-lg-none spartan-medium">Account</span>
                    </router-link>
            
                </li>
                <li class="nav-item d-none d-lg-block" v-if="user!= null">
                    <span>{{user.split(":")[0] || 0}}</span>
                   <base-dropdown menu-classes="dropdown-menu-lg dropdown-menu-right">
                    <a slot="title" class="avatar avatar-sm rounded-circle spartan-bold bg-white shadow">{{user.split(":")[0][0]}} </a>
                    <div class="dropdown-menu-inner p-4">
                        <p class="text-center spartan-medium">Hi, {{user.split(":")[0]}}</p>
                        <div class="text-center">
                            <base-button type="primary" @click="logout()" class="mt-3 text-capitalize spartan-regular">Logout</base-button>
                        </div>
                    </div>
                </base-dropdown>

            </li>

            <li class="nav-item d-sm-block d-lg-none d-md-none" v-if="user != null">  <a  @click="logout()" class="btn btn-sm btn-primary text-white mt-3 text-capitalize spartan-regular">Logout</a></li>
        </ul>

    </base-nav>
</header>
</template>

<script>
import BaseNav from "@/components/BaseNav";
import BaseDropdown from "@/components/BaseDropdown";
import CloseButton from "@/components/CloseButton";

export default {
    components: {
        BaseNav,
        CloseButton,
        BaseDropdown
    },
    data() {
        return {
           user: null,
           //user: "Timi:1a0d52fa-8d36-48ba-ba3c-3069e655bc21",
        }
    },

    methods: {
        logout() {
            sessionStorage.removeItem("gamerid");
             this.user = null;
           if (this.$route.path !== '/') this.$router.push("/");
        },
        getUser(){
              setInterval(() => {
             this.user = JSON.parse(sessionStorage.getItem("gamerid"));
        }, 3000);
        }

    },
    mounted () {
        this.getUser();
    },
  
};
</script>

<style>
</style>
