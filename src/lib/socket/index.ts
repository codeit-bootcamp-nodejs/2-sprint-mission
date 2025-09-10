import { Application } from "express";
import * as http from "http";
import { Server } from "socket.io";

export const userSocketMap = new Map<string, string>();

export const createSocket = (app: Application) => {
  const server = http.createServer(app);

  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["*"],
    },
  });
  io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("authenticate", (data) => {
      const { userId } = data;
      userSocketMap.set(userId, socket.id);
      socket.join(userId);
      console.log(`User ${userId} authenticated`);
    });

    socket.on("disconnect", () => {
      console.log(`User disconnect: ${socket.id}`);
    });
  });

  return { server, io };
};
