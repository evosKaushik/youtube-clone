import { socket } from "./socket";

export function connectSocket() {
    if (!socket.connected) {
        socket.connect();
        socket.on("connect", () => {
            console.log("Connected:", socket.id);
        });
    }
}

export function disconnectSocket() {
    if (socket.connected) {
        socket.disconnect();
    }
}