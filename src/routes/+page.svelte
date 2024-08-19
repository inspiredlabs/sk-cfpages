<script lang="ts">
  // src/routes/+page.svelte
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import PartySocket from 'partysocket';

  const activeIndexStore = writable(0);
  const participants = writable(0);

  let socket: PartySocket;

  onMount(() => {
    
    socket = new PartySocket({
      host: 'localhost:1992', // local dev ONLY
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

  // function updateActiveIndex(newIndex) {
  //   socket.send(JSON.stringify({
  //     type: 'updateIndex',
  //     index: newIndex
  //   }));
  // }

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
  <h1 class="ma0">PartyKit</h1>

  <button onclick={incrementActiveIndex}>Increment</button>
  <button onclick={decrementActiveIndex}>Decrement</button>

  <code>activeIndexStore: {$activeIndexStore}</code>
  <code>participants: {$participants}</code>
</main>