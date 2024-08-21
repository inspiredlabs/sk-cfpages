<script>
	// src/lib/Radiocheck.svelte
  export let checked;
	export let id;
</script>

<!--
when label is highlighted automatically tab into the text entry field -->

<label for="pinvis" class="flex items-center relative no-clutter pointer">
  <input
    class="visually-hidden"
    type="checkbox"
    id={id}
    bind:checked
    on:change
  />
  <svg
    class="checkbox-animation h2 w2 z-1 absolute pa0 ml0"
    viewBox="0 0 512 512"
    alt="disk">
    <use xlink:href="#disk"></use>
  </svg>
  <div class="flex items-center w-100">				
    <aside class="h2 w2 b--silver ba bw1-ns br-100 pa0 bg-transparent">
    </aside>
    <div class="code">
      <!-- style="width: calc(100% - 2rem)" -->
      <span >&nbsp;{ checked ? 'hide' : 'show' }</span>
      <span class="dn dn-ns dn-m dib-l">pin</span>
    </div>
  </div>
</label>

<svg class="spirites" style="display: none;">
	<defs>
		<g id="check" fill="currentcolor"><path d="M505.943 79.594c-8.077-8.077-21.172-8.077-29.249 0l-308.939 308.938-132.449-132.449c-8.076-8.077-21.172-8.077-29.248 0-8.077 8.077-8.077 21.172 0 29.249l147.074 147.074c4.038 4.039 9.332 6.058 14.625 6.058 5.293 0 10.587-2.019 14.625-6.059l323.562-323.562c8.075-8.076 8.075-21.171-.001-29.249z"/></g>
	  <g id="disk" fill="currentcolor"><circle cx="256" cy="256" r="215"/></g>
	</defs>
</svg>

<style>
/*
ColeBemis.com feather collection:
https://inspiredlabs.co.uk/j/feather/
in SVG defs `.spirites` */
.checkbox-animation {
	/* clip: rect(0 0 0 0);  */
	/* background-image: rgba(0,0,0, 0); */
  fill:currentColor;
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;

  -ms-transform: scale(0);
  -webkit-transform: scale(0);
  transform: scale(0);
  
  -ms-transition: all .3s ease;
  -webkit-transition: all .3s ease;
  transition: all .3s ease;
}

.visually-hidden:checked ~ .checkbox-animation {
  -ms-transform: scale(.55);
  -webkit-transform: scale(.55);
  transform: scale(.55);
}

.visually-hidden {
  clip: rect(0 0 0 0); 
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  white-space: nowrap; 
  width: 1px;
}


/****** Checkbox/Radio hint ******/

/* input[type="checkbox"]:active ~ aside,
input[type="checkbox"]:focus ~ aside {
  border-color: white;
  background-color:black;
} */

/* input[type="checkbox"]:hover ~ aside {
  border-color: white;
  background-color:transparent;
} */

/* WebKit native focus styles 
@media (-webkit-min-device-pixel-ratio:0) {
  .focus-style {
    outline-color: -webkit-focus-ring-color;
    outline-style: auto;
  }
} */
</style>


<svg class="spirites" style="display: none;">
	<defs>
		<g id="check" fill="currentcolor"><path d="M505.943 79.594c-8.077-8.077-21.172-8.077-29.249 0l-308.939 308.938-132.449-132.449c-8.076-8.077-21.172-8.077-29.248 0-8.077 8.077-8.077 21.172 0 29.249l147.074 147.074c4.038 4.039 9.332 6.058 14.625 6.058 5.293 0 10.587-2.019 14.625-6.059l323.562-323.562c8.075-8.076 8.075-21.171-.001-29.249z"/></g>
	  <g id="disk" fill="currentcolor"><circle cx="256" cy="256" r="215"/></g>
	</defs>
</svg>