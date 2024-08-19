---

init: https://www.perplexity.ai/search/how-do-i-clone-this-https-gith-Tx2Dvw86Tr65NKvhZ2.BYA
desired outcome:
- Sveltekit 2.0 + Svelte 5 runes syntax
- Cloudflare pages
- PartyKit abstraction over WebSocket to broadcast/subscribe to `activeIndex`
- durable objects?
- later serviceWorker.js + manifest?
- use as the basis of a pindeck.me refactor
- poll/vote
- redo this process. game design; Threlte, geolocation magnetic tweened animation, sound, multi-player

---

# Voting Template

This is a `Svelte 5` runes syntax repo using `Sveltekit 2.0`, `Cloudflare`, `PartyKit` and `c`.

<!-- Cloudflare's `durable objects` -->

## `Workers & Pages / voting` is a reduced test case on Cloudflare

Here's a step by step guide to what's been configured in this repo if you need to reconstruct it for yourself:

- cli: `npm install partykit@beta partysocket@beta`
- added: `"start": "npx partykit dev ./server/server.ts",` to `package.json`
- app.HTML uses: `touch-action: manipulation`, `<meta name="viewport" content="width=device-width, viewport-fit=cover" />` for improved mobile UX.
- `+layout.svelte`: uses: `import '$src/app.css';`
- `+page.server.js` has: `export const ssr = false;`
- `server/server.ts` has: `State { activeIndex: number; participants: number; }`, with multiple instances of `broadcastState()`.
- `partykit.json`:

```json
{
  "port": 1992
}
```





I have seen this worker for `partykit`: ```import type * as Party from "partykit/server";
import type { Poll } from "@/app/types";
export default class Server implements Party.Server {
  constructor(readonly party: Party.Party) {}
  poll: Poll | undefined;
  async onRequest(req: Party.Request) {
    if (req.method === "POST") {
      const poll = (await req.json()) as Poll;
      this.poll = { ...poll, votes: poll.options.map(() => 0) };
      this.savePoll();
    }
    if (this.poll) {
      return new Response(JSON.stringify(this.poll), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response("Not found", { status: 404 });
  }
  async onMessage(message: string) {
    if (!this.poll) return;
    const event = JSON.parse(message);
    if (event.type === "vote") {
      this.poll.votes![event.option] += 1;
      this.party.broadcast(JSON.stringify(this.poll));
      this.savePoll();
    }
  }
  async savePoll() {
    if (this.poll) {
      await this.party.storage.put("poll", this.poll);
    }
  }
  async onStart() {
    this.poll = await this.party.storage.get("poll");
  }
}
Server satisfies Party.Worker;```, but what I want to do `subscribe` to a number variable called: `activeIndexStore` with Sveltekit, akin to this page: ```

PartyKit

    updateActiveIndex($activeIndexStore + 1)}>     Increment      activeIndexStore: {$activeIndexStore}   participants: {$participants} ```, write a working typescript file that can act as a server: `src/server/server.ts`
