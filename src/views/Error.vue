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
            <div class="col px-0">
                <div class="row justify-content-center align-items-center">
                    <div class="col-lg-7 text-center">
                         <h1 class="display-1  text-white spartan-extrabold">404!
                            </h1>
                            <p class="text-white spartan-medium"> Oops! Room no longer exists. Create a new room or join an existing one.</p>
                              <div class="btn-wrapper">

                                   <router-link to="/create" class="mb-3 mb-sm-0 text-capitalize spartan-semibold btn btn-white">
                                        <small> Create Room</small>
                     
                                </router-link>
                                <router-link to="/join" class="mb-3 mb-sm-0 text-capitalize spartan-semibold btn btn-transparent text-white">
                                    <small>Join a Room <i class="fa fa-plus ml-2"></i> </small>
                                </router-link>

                            </div>
                    </div>
                </div>
                <div class="row align-items-center justify-content-around stars-and-coded">
                    <div class="col-sm-4">
                      <!--  <span class="text-white alpha-7 ml-3">Star us on</span>
                        <a href="https://github.com/creativetimofficial/argon-design-system" target="_blank" title="Support us on Github">
                            <img src="img/brand/github-white-slim.png" style="height: 22px; margin-top: -3px">
                        </a> -->
                    </div>
                    <div class="col-sm-4 mt-4 mt-sm-0 text-right">
                        <span class="text-white alpha-7 spartan-regular">Coded by</span>
                        <a href="https://www.creative-tim.com" target="_blank" title="Creative Tim - Premium Bootstrap Themes and Templates">
                          <h6 class="spartan-extrabold text-white">thetimilehin</h6>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </section>
   
</template>

<script>
export default {
    name: "error",
    components: {},
    methods: {
     
    }
};
</script>
<style scoped>



</style>
