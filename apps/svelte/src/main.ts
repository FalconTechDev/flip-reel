import { mount } from 'svelte'
import '@flipatic/flip-reel'
import '@flipatic/flip-reel-demo-shared/demo.css'
import App from './App.svelte'

const target = document.getElementById('app')
if (target) {
  mount(App, { target })
}
