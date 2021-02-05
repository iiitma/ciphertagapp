<template>
    <footer class="footer bg-white">
     
        <div class="container">
          
            <hr>
            <div class="row align-items-center justify-content-md-between">
                <div class="col-md-6">
                    <div class="copyright">
                        &copy; {{year}}
                        <a href="" target="_blank" rel="noopener">Edge Experience</a> & <a href="https://svetlo.com.ng" target="_blank" rel="noopener">Svetlo Code</a>
                    </div>
                </div>
                <div class="col-md-6">
                    <ul class="nav nav-footer justify-content-end">
                        <li class="nav-item">
                            <a href="https://ciphertag.herokuapp.com" class="nav-link" target="_blank" rel="noopener">CipherTag</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </footer>
</template>
<script>
export default {
  name: 'app-footer',
  data() {
    return {
      year: new Date().getFullYear()
    }
  }
};
</script>
<style>
</style>
