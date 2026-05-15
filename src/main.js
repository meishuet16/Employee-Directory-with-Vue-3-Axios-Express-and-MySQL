import { createApp } from 'vue' // like taking the createApp function from the Vue library, which is used to create a new Vue application instance
import App from './App.vue' // import the App component from the App.vue file, which is the root component of our application. This component will be rendered when the application starts.
import './assets/main.css'

createApp(App).mount('#app') // .mount('#app') is a method that tells Vue to render the App component and mount it to the DOM element with the id of 'app' in the index.html file