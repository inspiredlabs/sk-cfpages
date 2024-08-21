<script lang="ts">
  // src/routes/+page.svelte
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import PartySocket from 'partysocket';

  const activeIndexStore = writable(0);
  const participants = writable(0);
  
  let socket: PartySocket;
  
  // local dev ONLY
  import { PUBLIC_PARTYKIT_HOST, PUBLIC_PIN  } from '$env/static/public'

  onMount(() => {

    socket = new PartySocket({
      // usage: host: 'localhost:1992',
      host: PUBLIC_PARTYKIT_HOST,
      room: 'this-room'
    });

    socket.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);

      // Expects a different type that's throttled
      if (data.type === 'updateActiveIndex') {
        // Ensure $activeIndex does not exceed the amount of `deckTotal`
        activeIndexStore.set((data.activeIndex + deckTotal) % deckTotal);
      }
      if (data.type === 'updateParticipants') {
        participants.set(data.participants);
      }
    });

    return () => {
      socket.close();
    };
  });

  // Throttle `Requests` to limit updates to Cloudflare
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Debounced send function
  const debouncedSend = debounce((index) => {
    socket.send(JSON.stringify({ 
      type: 'updateActiveIndex',
      activeIndex: index
    }));
  }, 300); // Delay in milliseconds

  function increment() {
    activeIndexStore.update(n => {
      const newIndex = (n + 1) % deckTotal;
      debouncedSend(newIndex); // Send the new index after debounce delay
      return newIndex;
    });
  }

  function decrement() {
    activeIndexStore.update(n => {
      const newIndex = (n - 1 + deckTotal) % deckTotal;
      debouncedSend(newIndex); // Send the new index after debounce delay
      return newIndex;
    });
  }




let value: number | undefined = undefined;
// Expose to the client
let pin: number = Number(PUBLIC_PIN); 
let pinVisibility = false;

// Get the total number of entries
const deckTotal = deck.length;

// Control pin visibility
import Radiocheck from '$lib/Radiocheck.svelte';
let checked = false;
let checkboxId = 'pinvis';

// pinVisibility = checked
function handleChange(event) {
  pinVisibility = event.target.checked;
}
  
// Import components
import Container from '$lib/Container.svelte';
import Logo from '$lib/Logo.svelte';
import deck from '$lib/deck.json';
</script>

<nav class="bg-oxford w-100 white relative z-max">
  <Container>
    <div class="flex flex-row flex-wrap justify-between w-100">
      <div class="w-50 w-100-ns w-60-m w-40-l h3 flex items-center">
        <Logo />
        <h1 class="f3 f4-ns f4-m f2-l pl2 code tracked">pindeck<span class="dn dn-ns dib-m dib-l">.me</span></h1>        
      </div>
      <div class="w-50 w-100-ns w-40-m w-30-l h3 flex items-center">
        <div class="flex items-center justify-between items-end w-100">
          <Radiocheck bind:checked id={checkboxId} on:change={handleChange} />
          <input
            id="pin"
            type="number"
            inputmode="numeric"
            name="pin"
            pattern="[0-9]{4}"
            maxlength="4"
            bind:value
            style="width: 10ch"
            class="highlight transition br0 ba bw1 b--custom pa3 fw9 tc tracked-mega code { pinVisibility ? '' : 'pin'}"
            oninput={ () => value = parseInt((value ?? '').toString().slice(0, 4), 10) }
          />
        </div>
      </div>
    </div>
  </Container>

  <Container>
    {#if value === pin}
    <div class="flex flex-auto justify-between w-100">
      <button class="bn w-40 pv4 bg-moon-gray fw9 black" onclick={decrement}>-</button>

      <div class="w-20 flex flex-column items-center justify-center">
        <code class="db w-100 bg-dark-red flex items-center justify-center tc" style="height: 50%;">
          <small class="o-50 dn dib-m dib-l">Slide:</small> {$activeIndexStore}
        </code>

        <code class="db w-100 bg-soccorso flex items-center justify-center tc black" style="height: 50%;">
          <small class="o-50 dn dib-m dib-l">Participants:</small>{$participants}
        </code>
      </div>

      <button class="bn w-40 pv4 bg-gray fw9 white" onclick={increment}>+</button>
    </div>
    {/if}
  </Container>

</nav>
<main class="bg-soccorso w-100 flex items-center overflow-hidden">
  <Container>

  <!-- slides -->    
    <div
    style="height: calc(100vh - 4rem);"
    class="w-100 flex items-center justify-center">
      {#each deck as {title, src, caption, links}, index}
      <div
      style="height: calc(100vh - 4rem); z-index: 1;"
      class="w-100 absolute transition {index === $activeIndexStore ? 'db' : 'dn' }" >


      
        <div
        style="height: calc(100vh - 6rem);background: url('{src}') center center / contain no-repeat;"
        class="w-100 flex flex-row flex-wrap relative overflow-hidden">
        <Container>
          <div class="flex flex-column items-center justify-between w-100">
            <div class="absolute bottom-2 flex flex-column items-center { !title && !caption ? '' : 'bg-black-70' } mb5 measure-wide-l">
              {#if title}
              <h2 class="white ma0 pa3">{@html title}</h2>
              {/if}
              <h3 class="white ma0 pa3">{@html caption}</h3>

              {#if links && links.length > 0}
              <h4 class="white ma0 pa3 { !title && !caption ? 'bg-black-70' : '' }">
                {#each links as {title, url}, index}
                  <a class="white poiner pr3 ttu tracked f6 " href={url} title={title}>{@html title}</a>
                {/each}
              </h4>
              {/if}
            </div>


            
          </div>
        </Container>
        </div>
      </div>
      {/each}
    </div>
<!-- /slides -->

  </Container>
</main>  



<style>
.b--custom {
border-color: transparent
}  
.b--custom:active,  
.b--custom:focus,
.b--custom:hover {
border-color: cyan
}

.pin {
  text-security: disc;
  -webkit-text-security: disc;
  -moz-text-security: disc;
}

input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"] {
  -moz-appearance: textfield;
}
</style>