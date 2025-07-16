import React, { useEffect, useState } from "react";
import axios from "axios";
import knowledgeRaw from "../../constants/knowledge.txt?raw";

interface Message {
  sender: "user" | "bot";
  text: string;
}

// Thêm hàm parseListMessage để chuyển đổi text dạng liệt kê thành danh sách React
function parseListMessage(text: string) {
  // Nhận diện danh sách dạng số thứ tự (1. ... 2. ...)
  const numberedList = text.match(/^(.*?)(\d+\. .+)/s);
  if (numberedList) {
    const [_, intro, listPart] = numberedList;
    // Tách các mục theo số thứ tự
    const items = listPart.split(/\n?\d+\. /).filter(Boolean);
    return (
      <div>
        {intro && <div className="font-semibold mb-1">{intro.trim()}</div>}
        <ol className="list-decimal ml-5 space-y-1">
          {items.map((item, idx) => (
            <li key={idx} className="text-left">{item.trim()}</li>
          ))}
        </ol>
      </div>
    );
  }
  // Nhận diện danh sách dạng gạch đầu dòng (- ... hoặc • ...)
  const bulletList = text.match(/^(.*?)([-•] .+)/s);
  if (bulletList) {
    const [_, intro, listPart] = bulletList;
    // Tách các mục theo dấu gạch đầu dòng
    const items = listPart.split(/\n?[-•] /).filter(Boolean);
    return (
      <div>
        {intro && <div className="font-semibold mb-1">{intro.trim()}</div>}
        <ul className="list-disc ml-5 space-y-1">
          {items.map((item, idx) => (
            <li key={idx} className="text-left">{item.trim()}</li>
          ))}
        </ul>
      </div>
    );
  }
  // Nếu không phải dạng danh sách, trả về text bình thường
  return text;
}

const ChatBot: React.FC = () => {
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([
    { 
      sender: "bot", 
      text: "Xin chào! Tôi là chatbot giúp bạn sử dụng web EduCare hiệu quả hơn . Bạn có câu hỏi gì không?" 
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
          text: "Bạn là một chatbot giúp đỡ người dùng sử dụng web EduCare. Trả lời ngắn gọn, rõ ràng và chỉ dựa trên dữ liệu sau:",
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
        <div className="fixed bottom-24 right-6 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl h-[60vh] z-[9999] bg-white border border-gray-300 rounded-xl shadow-2xl flex flex-col animate-fade-in">
          <div className="bg-blue-600 text-white text-center py-2 rounded-t-xl font-semibold relative">
            🎓 Chatbot Tư vấn
            <button
              className="absolute top-2 right-3 text-white text-sm"
              onClick={() => setIsOpen(false)}
            >
              ✖
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50 custom-scrollbar">
            {messages.map((m, i) => (
              <div key={i} className={`flex items-end ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
                {m.sender === "bot" && (
                  <div className="flex-shrink-0 mr-2">
                    <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center text-lg shadow">
                      🤖
                    </div>
                  </div>
                )}
                <div
                  className={`text-sm max-w-[80%] break-words px-4 py-2 rounded-2xl shadow-md transition-all duration-200
                    ${m.sender === "user"
                      ? "bg-blue-500 text-white ml-2 rounded-br-md"
                      : "bg-white text-gray-800 mr-2 border border-gray-200 rounded-bl-md"}
                  `}
                  style={{ wordBreak: 'break-word' }}
                >
                  {m.sender === "bot" ? parseListMessage(m.text) : m.text}
                </div>
                {m.sender === "user" && (
                  <div className="flex-shrink-0 ml-2">
                    <div className="w-8 h-8 rounded-full bg-green-200 flex items-center justify-center text-lg shadow">
                      🧑
                    </div>
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center text-sm text-gray-500 italic gap-2">
                <span className="animate-pulse">Đang trả lời...</span>
                <span className="text-lg">🤖</span>
              </div>
            )}
          </div>

          <div className="flex border-t p-2 gap-2 bg-white">
            <input
              className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 transition disabled:bg-gray-100"
              placeholder="Nhập câu hỏi..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow hover:bg-blue-700 disabled:opacity-50 transition"
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

<style>{`
  .custom-scrollbar::-webkit-scrollbar {
    width: 8px;
    background: #f1f1f1;
    border-radius: 8px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 8px;
  }
  .animate-fade-in {
    animation: fadeIn 0.4s;
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }
`}</style> 