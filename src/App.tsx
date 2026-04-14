import { useState } from "react";

export default function App() {
  const [secret, setSecret] = useState("");

  return (
    <div className="w-80 h-96 p-4 bg-white flex justify-center items-center">
      <h1 className="mr-4">TOTP Secret</h1>
      <input
        className="border-2 border-black rounded"
        type="text"
        value={secret}
        onChange={(e) => setSecret(e.target.value)}
      />
    </div>
  )
}

