// src/server/server.ts
import type * as Party from "partykit/server";

interface State {
  activeIndex: number;
  participants: number;
}

// PartyKit's Server interface
export default class Server implements Party.Server {
  // Init room
  constructor(readonly room: Party.Room) {}


  state: State = {
    activeIndex: 0,
    participants: 0,
  };

  // Increment participants
  async onConnect(conn: Party.Connection) {
    this.state.participants++;
    await this.broadcastState();
  }

  // Decrement participants
  async onClose() {
    this.state.participants = Math.max(0, this.state.participants - 1);
    await this.broadcastState();
  }

  // Handle HTTP requests if needed
  async onRequest(req: Party.Request) {
    return new Response("Running PartyKit", { status: 200 });
  }

  // This logic could be handled on client
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

  // Broadcast current state to ALL
  async broadcastState() {
    await this.room.broadcast(JSON.stringify(this.state));
  }

  async onStart() {
    // Load state from storage if needed
    const storedState = await this.room.storage.get("state");
    if (typeof storedState === "string") {
      this.state = JSON.parse(storedState);
    }
  }

  async onUpdate() {
    // Save state to storage
    await this.room.storage.put("state", JSON.stringify(this.state));
  }
}

Server satisfies Party.Worker;






/*
NOTES:
how do I do:

constructor(readonly room: PartyKitServer['room']) {}

and

async broadcastState() {
  await this.room.broadcast(JSON.stringify(this.state));
}
*/ 
// 2Kb max size for connection.setState({ });
