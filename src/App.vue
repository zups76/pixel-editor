<script setup>
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <header>
    <img alt="Vue logo" class="logo" src="@/assets/lion.gif" width="200" />

    <div class="wrapper">
      <HelloWorld msg="Pixel Editor v0.0.7" />

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <!-- <RouterLink to="/about">About</RouterLink>
        <RouterLink to="/maker">Image Maker</RouterLink> -->
        <RouterLink to="/layer">Image Maker Layer</RouterLink>
        <RouterLink to="/PixelEditor">Pixel Editor</RouterLink>
        <RouterLink to="/CanvasRotate">Canvas Rotate</RouterLink>
        <button @click="ooooppeen">팝업</button>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<script>
export default {
  data() {
    return {
      
    }
  },
  mounted() {
    window.ch = false
    if(opener)
      opener.window.asdsads = true
  },
  methods: {
    ooooppeen() {
      window.ch = true
      window.aaaaaaaaa = window.open('http://localhost:5173/pixel-editor/')
    }
  }
}
</script>
<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (max-width: 1024px) {
  nav {
    margin-top: 0px;
  }

  .logo {
    display: block;
    width: 100px;
    margin: 0 auto 0px;
  }
}

@media (min-width: 1300px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
