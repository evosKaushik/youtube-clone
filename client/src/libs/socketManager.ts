import { socket } from "./socket";

export function connectSocket() {
    if (!socket.connected) {
        // Remove any stale listeners first to avoid duplicates
        socket.off("connect");
        socket.connect();
        socket.on("connect", () => {
            console.log("Connected:", socket.id);
        });
    }
}

export function disconnectSocket() {
    if (socket.connected) {
        socket.removeAllListeners("connect");
        socket.disconnect();
    }
}