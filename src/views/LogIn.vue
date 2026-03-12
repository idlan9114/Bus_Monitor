<script setup lang="ts">
import { ref } from 'vue'

const name = ref("")
const email = ref("")
const password = ref("")

function LogIn() {
    console.log(name.value, email.value, password.value)

    
    return { name, email, password, LogIn }
}


</script>

<template>
    <div>
        <form @submit.prevent="LogIn">
            <input type="text"     v-model="name"     placeholder="Enter name...">
            <input type="email"    v-model="email"    placeholder="Enter email...">
            <input type="password" v-model="password" placeholder="Enter password...">
            <button>Log In</button>
        </form>
        
    </div>
</template>