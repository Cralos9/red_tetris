"use client"

import Image from "next/image";
import { useEffect } from "react"
import { socket } from "../socket"

export default function Home() {

  useEffect(() => {
	socket.on("connect", () => {
	  console.log("Connected to the websocket")
	})

	socket.emit("action", "Hello")
  }, [])

  return (
    <h1>
      Teste
    </h1>
  );
}
