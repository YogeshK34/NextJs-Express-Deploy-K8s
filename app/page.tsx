"use client"

import { useState, useEffect } from "react"

export default function Home() {
  const [message, setMessage] = useState("Loading...")
  const [status, setStatus] = useState("pending")

  useEffect(() => {
    const fetchData = async () => {
      try {
        // In production, this would be the service name in Kubernetes
        const response = await fetch("http://localhost:30001/api/hello")
        const data = await response.json()
        setMessage(data.message)
        setStatus("success")
      } catch (error) {
        console.error("Error fetching data:", error)
        setMessage("Failed to connect to backend")
        setStatus("error")
      }
    }

    fetchData()
  }, [])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm lg:flex">
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
          <div className="flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0">
            By <p className="font-bold">K8s Demo App</p>
          </div>
        </div>
      </div>

      <div className="relative flex place-items-center my-16">
        <h1 className="text-4xl font-bold">Kubernetes Demo App</h1>
      </div>

      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-1 lg:text-left">
        <div
          className={`group rounded-lg border border-transparent px-5 py-4 transition-colors ${
            status === "success" ? "bg-green-100" : status === "error" ? "bg-red-100" : "bg-yellow-100"
          }`}
        >
          <h2 className="mb-3 text-2xl font-semibold">Backend Response</h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">Status: {status}</p>
          <p className="m-0 max-w-[30ch] text-xl">{message}</p>
        </div>
      </div>
    </main>
  )
}
