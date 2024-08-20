<script lang="ts">
  // src/routes/+page.svelte
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import PartySocket from 'partysocket';

  const activeIndexStore = writable(0);
  const participants = writable(0);
  
  let socket: PartySocket;
  
  // local dev ONLY
  import { PUBLIC_PARTYKIT_HOST } from '$env/static/public'

  onMount(() => {

    socket = new PartySocket({
      // usage: host: 'localhost:1992',
      host: PUBLIC_PARTYKIT_HOST,
      room: 'this-room'
    });

    socket.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);
      activeIndexStore.set(data.activeIndex);
      participants.set(data.participants);
    });

    return () => {
      socket.close();
    };
  });

  function incrementActiveIndex() {
    socket.send(JSON.stringify({
      type: 'incrementActiveIndex'
    }));
  }

  function decrementActiveIndex() {
    socket.send(JSON.stringify({
      type: 'decrementActiveIndex'
    }));
  }
</script>

<main class="bg-dark-red white pa4">
  <h1 class="ma0">PartyKit on: {@html PUBLIC_PARTYKIT_HOST}</h1>
  
  <button onclick={incrementActiveIndex}>Increment</button>
  <button onclick={decrementActiveIndex}>Decrement</button>
  
  <code>activeIndexStore: {$activeIndexStore}</code>
  <code>participants: {$participants}</code>
</main>


<!-- <h1 class="ma0">PartyKit via CloudFlare Workers + Pages</h1> -->