// src/server/server.ts
import type * as Party from "partykit/server";

interface State {
  activeIndex: number;
  participants: number;
}

export default class Server implements Party.Server {
  constructor(readonly party: Party.Party) {}

  state: State = {
    activeIndex: 0,
    participants: 0,
  };

  async onConnect(conn: Party.Connection) {
    this.state.participants++;
    await this.broadcastState();
  }

  async onClose() {
    this.state.participants = Math.max(0, this.state.participants - 1);
    await this.broadcastState();
  }

  async onRequest(req: Party.Request) {
    // Handle HTTP requests if needed
    return new Response("PartyKit server is running", { status: 200 });
  }

  async onMessage(message: string, sender: Party.Connection) {
    const event = JSON.parse(message);
    
    if (event.type === "incrementActiveIndex") {
      this.state.activeIndex++;
      await this.broadcastState();
    } else if (event.type === "decrementActiveIndex") {
      this.state.activeIndex = Math.max(0, this.state.activeIndex - 1);
      await this.broadcastState();
    }
  }

  async broadcastState() {
    await this.party.broadcast(JSON.stringify(this.state));
  }

  async onStart() {
    // Load state from storage if needed
    const storedState = await this.party.storage.get("state");
    if (storedState) {
      this.state = JSON.parse(storedState);
    }
  }

  async onUpdate() {
    // Save state to storage
    await this.party.storage.put("state", JSON.stringify(this.state));
  }
}

Server satisfies Party.Worker;