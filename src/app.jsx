import { useState } from "react";

function App() {
  const [started, setStarted] = useState(false);

  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Halo! 👋 Selamat datang di Samdbal – Asisten AI Pengelolaan Sampah di Bali! Ada yang bisa saya bantu hari ini?",
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
      { sender: "bot", text: "Sebentar ya… saya sedang memproses pertanyaanmu 🤖" },
    ]);

    try {
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
        { sender: "bot", text: "Maaf, ada masalah menghubungi server 😢 Coba lagi nanti ya!" },
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
          <h1>Selamat Datang di Samdbal! ♻️</h1>
          <p>
            Samdbal adalah asisten AI khusus untuk pengelolaan sampah di Bali.  
            Tanya apa saja tentang daur ulang, bank sampah, lokasi TPS, tips 3R, atau masalah sampah di pulau Dewata!
          </p>

          <button className="start-btn" onClick={startChat}>
            Mulai Chat Sekarang
          </button>

          <button
            className="start-btn"
            style={{ background: "#64748b" }}
            onClick={() => (window.location.href = "https://dashboardsamdbal.vercel.app/")}
          >
            Kembali ke Dashboard
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
      <div className="chat-header">
        <h1>Samdbal – Asisten Sampah Bali</h1>
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
          placeholder="Tanya tentang sampah di Bali (contoh: cara daur ulang plastik)"
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Kirim</button>
      </div>
    </div>
  );
}

export default App;
