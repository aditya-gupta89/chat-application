import { Server } from "socket.io";
import Redis from "ioredis";

const pub = new Redis({
  host: process.env.PORT_NUMBER,
  port: 18341,
  username: "default",
  password: process.env.REDIS_PASSWORD,
});
const sub = new Redis({
  host: "redis-2ab29e84-aditya-chat-application.a.aivencloud.com",
  port: 18341,
  username: "default",
  password: "AVNS_-FOAbdY2OpUJBGK0_SH",
});

class SocketService {
  private _io: Server;

  constructor() {
    console.log("Init Socket Service...");
    this._io = new Server({
      cors: {
        allowedHeaders: ["*"],
        origin: "*",
      },
    });
    sub.subscribe("MESSAGES");
  }
  public initListeners() {
    const io = this.io;
    console.log("Init Socket Listenings...");
    io.on("connect", (socket) => {
      console.log("New Socket Connected", socket.id);
      socket.on("event:message", async ({ message }: { message: string }) => {
        console.log("New Message Rec.", message);
        await pub.publish("MESSAGES", JSON.stringify({ message }));
      });
    });
    sub.on("message", (channel, message) => {
      if (channel === "MESSAGES") {
        io.emit("message", message);
      }
    });
  }
  get io() {
    return this._io;
  }
}

export default SocketService;
