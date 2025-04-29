
import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface GameChatProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
}

type Message = {
  text: string;
  author: string;
  timestamp: Date;
};

const GameChat = ({ isOpen, onClose, username }: GameChatProps) => {
  const [privateMessages, setPrivateMessages] = useState<Message[]>([]);
  const [globalMessages, setGlobalMessages] = useState<Message[]>([
    { text: "Добро пожаловать в глобальный чат!", author: "Система", timestamp: new Date() },
    { text: "Ищу напарника для совместной игры", author: "Алексей", timestamp: new Date() },
    { text: "Привет всем! Как играть?", author: "Новичок", timestamp: new Date() },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [activeTab, setActiveTab] = useState("global");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Прокрутка чата вниз при новых сообщениях
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [privateMessages, globalMessages]);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    
    const newMessage = {
      text: inputMessage,
      author: username,
      timestamp: new Date()
    };
    
    if (activeTab === "global") {
      setGlobalMessages(prev => [...prev, newMessage]);
    } else {
      setPrivateMessages(prev => [...prev, newMessage]);
      
      // Имитация ответа от друга в приватном чате
      setTimeout(() => {
        const responses = [
          "Хорошая идея!",
          "Я согласен, давай сделаем так.",
          "Не уверен, что это сработает...",
          "Как твои успехи в игре?"
        ];
        
        setPrivateMessages(prev => [
          ...prev, 
          { 
            text: responses[Math.floor(Math.random() * responses.length)], 
            author: "Друг", 
            timestamp: new Date() 
          }
        ]);
      }, 2000);
    }
    
    setInputMessage("");
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 fade-in">
      <Card className="w-full max-w-2xl h-[70vh] overflow-hidden flex flex-col">
        <div className="p-4 flex justify-between items-center border-b">
          <h3 className="font-bold">Чат</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="px-4 py-2">
            <TabsTrigger value="global">Глобальный</TabsTrigger>
            <TabsTrigger value="private">Личный</TabsTrigger>
          </TabsList>
          
          <TabsContent value="global" className="flex-1 flex flex-col p-0">
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {globalMessages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`p-2 rounded-lg max-w-[80%] ${
                    msg.author === username 
                      ? "bg-game-purple/30 ml-auto" 
                      : "bg-secondary/50 mr-auto"
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-xs">{msg.author}</span>
                    <span className="text-xs text-muted-foreground">{formatTime(msg.timestamp)}</span>
                  </div>
                  <p className="text-sm">{msg.text}</p>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            
            <div className="p-4 border-t">
              <div className="flex space-x-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Напишите сообщение..."
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  className="bg-muted/30"
                />
                <Button 
                  onClick={handleSendMessage} 
                  disabled={!inputMessage.trim()}
                  className="bg-game-purple hover:bg-game-purple-dark"
                >
                  Отправить
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="private" className="flex-1 flex flex-col p-0">
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {privateMessages.length === 0 ? (
                <div className="text-center text-muted-foreground h-full flex items-center justify-center">
                  <p>Начните переписку с другом</p>
                </div>
              ) : (
                privateMessages.map((msg, idx) => (
                  <div 
                    key={idx} 
                    className={`p-2 rounded-lg max-w-[80%] ${
                      msg.author === username 
                        ? "bg-game-purple/30 ml-auto" 
                        : "bg-secondary/50 mr-auto"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-xs">{msg.author}</span>
                      <span className="text-xs text-muted-foreground">{formatTime(msg.timestamp)}</span>
                    </div>
                    <p className="text-sm">{msg.text}</p>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
            
            <div className="p-4 border-t">
              <div className="flex space-x-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Напишите сообщение другу..."
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  className="bg-muted/30"
                />
                <Button 
                  onClick={handleSendMessage} 
                  disabled={!inputMessage.trim()}
                  className="bg-game-purple hover:bg-game-purple-dark"
                >
                  Отправить
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default GameChat;
