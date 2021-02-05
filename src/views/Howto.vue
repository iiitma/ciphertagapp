<template>
<section class="bg-primary">
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
                    <h1 class="display-3  text-white spartan-extrabold">How to Play!
                    </h1>
                    <p class="text-white spartan-medium my-3 px-3">
                        Players are divided into two teams (red and blue).
                        Each team has one spymaster and one or more operatives.
                        <br />
                        A grid of 5x5 cards with a word on them is laid out on the screen. Some cards are designated as "red," some as "blue," some as "neutral," and one as the "assasin." Only spymasters are shown which is which.
                        <br />
                        The purpose of the game is for the all of the cards of your team's color to be guessed. Teams take turns guessing. The spymaster can give a one-word clue and designate the number of cards to which the given clue applies.

                    </p>

                    <!--ul-- class="text-white text-left text-white spartan-medium my-5">
                            <li>Players split up into two teams of similar size and skill. You need at least four players (two teams of two) for a standard game. 
                                Each team chooses one player to be their spymaster. The other players are called field operatives.
                            </li>

                            <li>
                                The starting team has 9 words to guess. The other team has 8. The starting team will give the first clue of the game.
                            </li>

                            <li>
                                If you are the spymaster, you are trying to think of a one-word clue that relates to some of the words your team is trying to guess. When you think you have a good clue, you say it. You also say one number, which tells your teammates how many codenames are related to your clue.

Example: Two of your words are NUT and BARK. Both of these grow on trees, so you say tree: 2.

You are allowed to give a clue for only one word (cashew: 1 ) but it's fun to try for two or more. Getting four words with one clue is a big accomplishment.
                            </li>
                        </!--ul-->

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

        </div>
    </div>
</section>
</template>

<script>
export default {
    name: "howto",
    components: {},
    methods: {

    }
};
</script>

<style scoped>

</style>
