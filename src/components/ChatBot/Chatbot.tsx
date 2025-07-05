import React, { useEffect, useState } from "react";
import axios from "axios";
import knowledgeRaw from "../../constants/knowledge.txt?raw";

interface Message {
  sender: "user" | "bot";
  text: string;
}

const ChatBot: React.FC = () => {
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([
    { 
      sender: "bot", 
      text: "Xin chào! Tôi là chatbot tư vấn tuyển sinh Đại học FPT. Tôi có thể giúp bạn tìm hiểu về các ngành học, học phí, và thông tin tuyển sinh. Bạn có câu hỏi gì không?" 
    }
  ]);
  const [knowledge, setKnowledge] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const API_KEY = import.meta.env.VITE_CHATBOT_API || "AIzaSyBRy1Tn2_To2RWcCu1WNSMqqOykdp1LxUc";
  
  // Validate API key
  if (!API_KEY) {
    console.error('VITE_CHATBOT_API environment variable is not set');
  }
  
  // Try the newer endpoint format
  const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
  
  // Debug: Check if API key is loaded
  console.log('API Key loaded:', API_KEY ? 'Yes' : 'No');
  console.log('API Key length:', API_KEY?.length);
  console.log('API Key (first 10 chars):', API_KEY?.substring(0, 10));
  console.log('Full URL:', URL);
  console.log('All env vars:', import.meta.env);

  useEffect(() => {
    setKnowledge(knowledgeRaw);
    
    // Test API key on component mount
    if (API_KEY) {
      console.log('Testing API key...');
      // You can add a simple test here if needed
    }
  }, [API_KEY]);

  const sendMessage = async (): Promise<void> => {
    if (!input.trim()) return;

    const userMsg: Message = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    // Check if API key is available
    if (!API_KEY) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "❌ API key không được cấu hình. Vui lòng kiểm tra file .env" },
      ]);
      setLoading(false);
      return;
    }

    try {
      // Tạo lịch sử hội thoại gửi kèm API
      const historyParts: { text: string }[] = [
        {
          text: "Bạn là một chatbot tư vấn tuyển sinh. Trả lời ngắn gọn, rõ ràng và chỉ dựa trên dữ liệu sau:",
        },
        { text: knowledge },
        { text: "Dưới đây là đoạn hội thoại giữa người dùng và bạn:" },
      ];

      // Chỉ gửi 6 tin nhắn gần nhất để tránh request quá dài
      const recentMessages = [...messages, userMsg].slice(-6);
      recentMessages.forEach((msg) => {
        historyParts.push({
          text: `${msg.sender === "user" ? "Người dùng" : "Chatbot"}: ${
            msg.text
          }`,
        });
      });

      console.log('Making API call to:', URL);
      console.log('Request payload:', {
        contents: [
          {
            parts: historyParts,
          },
        ],
      });
      
      const res = await axios.post(
        URL,
        {
          contents: [
            {
              parts: historyParts,
            },
          ],
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      
      console.log('API Response:', res.data);

      const botReply =
        res.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Không có phản hồi.";
      setMessages((prev) => [...prev, { sender: "bot", text: botReply }]);
    } catch (error: any) {
      console.error('API Error:', error);
      
      let errorMessage = "❌ Lỗi khi gọi API";
      
      if (error.response?.data?.error?.message) {
        errorMessage = `❌ ${error.response.data.error.message}`;
      } else if (error.message) {
        errorMessage = `❌ ${error.message}`;
      }
      
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: errorMessage },
      ]);
    }

    setLoading(false);
  };

  return (
    <>
      {/* Nút mở chat */}
      {!isOpen && (
        <button
          className="fixed bottom-5 right-5 bg-blue-600 text-white p-3 rounded-full shadow-lg z-[9999] hover:bg-blue-700"
          onClick={() => setIsOpen(true)}
        >
          💬
        </button>
      )}

      {/* Hộp chat */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-1/5 h-2/5 z-[9999] bg-white border border-gray-300 rounded-xl shadow-2xl flex flex-col">
          <div className="bg-blue-600 text-white text-center py-2 rounded-t-xl font-semibold relative">
            🎓 Chatbot Tư vấn
            <button
              className="absolute top-2 right-3 text-white text-sm"
              onClick={() => setIsOpen(false)}
            >
              ✖
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-50">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`text-sm max-w-[85%] break-words px-3 py-2 rounded-lg ${
                  m.sender === "user"
                    ? "ml-auto bg-blue-100 text-right text-blue-800"
                    : "mr-auto bg-green-100 text-left text-green-800"
                }`}
              >
                {m.text}
              </div>
            ))}

            {loading && (
              <div className="text-sm text-gray-500 italic">
                <span className="animate-pulse">Đang trả lời...</span>
              </div>
            )}
          </div>

          <div className="flex border-t p-2 gap-2">
            <input
              className="flex-1 border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none"
              placeholder="Nhập câu hỏi..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              className="bg-blue-600 text-white px-3 rounded text-sm hover:bg-blue-700 disabled:opacity-50"
              disabled={loading}
            >
              Gửi
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot; 