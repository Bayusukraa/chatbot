import { useState } from "react";

function App() {
  const [started, setStarted] = useState(false);

  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Halo! 👋 Ada yang bisa saya bantu hari ini?",
    },
  ]);

  const [input, setInput] = useState("");

  const startChat = () => {
    setStarted(true);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);

    const temp = input;
    setInput("");

    // pesan loading
    setMessages((prev) => [
      ...prev,
      { sender: "bot", text: "Sebentar ya… saya sedang berpikir 🤖" },
    ]);

    try {
      // ✅ FIX: pakai relative path (AMAN di Vercel & lokal)
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: temp }),
      });

      const data = await res.json();

      // ganti pesan loading dengan balasan bot
      setMessages((prev) => [
        ...prev.slice(0, prev.length - 1),
        { sender: "bot", text: data.reply },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev.slice(0, prev.length - 1),
        { sender: "bot", text: "Error menghubungi server 😢" },
      ]);
    }
  };

  // ============================
  // WELCOME SCREEN
  // ============================
  if (!started) {
    return (
      <div className="welcome-container">
        <div className="welcome-card">
          <h1>Selamat Datang 👋</h1>
          <p>
            Ini adalah chatbot AI yang didukung oleh GROQ.
            Klik tombol di bawah untuk memulai percakapan.
          </p>

          <button className="start-btn" onClick={startChat}>
            Mulai Chat
          </button>

          {/* ✅ FIX: jangan hardcode localhost */}
          <button
            className="start-btn"
            style={{ background: "#64748b" }}
            onClick={() => (window.location.href = "https://dashboardsamdbal.vercel.app/")}
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  // ============================
  // CHAT SCREEN
  // ============================
  return (
    <div className="chat-container">
      {/* ✅ FIX: className (bukan class) */}
      <div className="chat-header">
        <h1>Chatbot</h1>
        <button
          className="close-btn"
          onClick={() => (window.location.href = "/")}
        >
          ✖
        </button>
      </div>

      <div className="chat-box">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
      </div>

      <div className="input-area">
        <input
          value={input}
          placeholder="Ketik pesan di sini..."
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Kirim</button>
      </div>
    </div>
  );
}

export default App;
