
import { useState, useEffect, useRef } from "react";
import { X, Send, User, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";

interface ChatMessage {
  id: number;
  username: string;
  text: string;
  timestamp: Date;
  isSystem?: boolean;
  isAdmin?: boolean;
}

interface GameChatProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
  onAdminCommand?: (command: string, value: number) => void;
}

const mockUsers = [
  "ДобрыйИгрок", "ГеройГорода", "ПомощникЛюдей", "ВеселыйШод", 
  "ДобряшкаПро", "ГородскойСпасатель", "СветлыйПуть", "ДобрыйВолшебник"
];

const GameChat = ({ isOpen, onClose, username, onAdminCommand }: GameChatProps) => {
  const [globalMessages, setGlobalMessages] = useState<ChatMessage[]>([
    { id: 1, username: "Система", text: "Добро пожаловать в глобальный чат!", timestamp: new Date(), isSystem: true },
    { id: 2, username: "ДобрыйИгрок", text: "Всем привет! Кто хочет поиграть вместе?", timestamp: new Date(Date.now() - 15 * 60000) },
    { id: 3, username: "ГеройГорода", text: "Я уже сделал счастливыми 45 человек!", timestamp: new Date(Date.now() - 10 * 60000) },
    { id: 4, username: "ПомощникЛюдей", text: "Как помочь бабушке, которая потеряла кошку?", timestamp: new Date(Date.now() - 5 * 60000) },
    { id: 5, username: "ВеселыйШод", text: "Предложи ей расклеить объявления и помоги в поисках", timestamp: new Date(Date.now() - 4 * 60000) },
  ]);
  
  const [gameMessages, setGameMessages] = useState<ChatMessage[]>([
    { id: 1, username: "Система", text: "Это чат текущей игры. Здесь пока никого нет.", timestamp: new Date(), isSystem: true },
  ]);
  
  const [currentMessage, setCurrentMessage] = useState("");
  const [activeTab, setActiveTab] = useState("global");
  const [onlineUsers, setOnlineUsers] = useState<string[]>([...mockUsers]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Эффект для имитации присоединения/выхода пользователей
  useEffect(() => {
    const interval = setInterval(() => {
      // 20% шанс на событие
      if (Math.random() > 0.8) {
        const isJoining = Math.random() > 0.5;
        
        if (isJoining && onlineUsers.length < 15) {
          // Добавление нового пользователя
          const randomUser = mockUsers[Math.floor(Math.random() * mockUsers.length)];
          if (!onlineUsers.includes(randomUser)) {
            setOnlineUsers(prev => [...prev, randomUser]);
            if (activeTab === "global") {
              setGlobalMessages(prev => [
                ...prev, 
                { 
                  id: Date.now(), 
                  username: "Система", 
                  text: `${randomUser} присоединился к чату`, 
                  timestamp: new Date(),
                  isSystem: true 
                }
              ]);
            }
          }
        } else if (onlineUsers.length > 3) {
          // Удаление случайного пользователя
          const indexToRemove = Math.floor(Math.random() * onlineUsers.length);
          const userToRemove = onlineUsers[indexToRemove];
          setOnlineUsers(prev => prev.filter((_, i) => i !== indexToRemove));
          
          if (activeTab === "global") {
            setGlobalMessages(prev => [
              ...prev, 
              { 
                id: Date.now(), 
                username: "Система", 
                text: `${userToRemove} покинул чат`, 
                timestamp: new Date(),
                isSystem: true 
              }
            ]);
          }
        }
      }
    }, 10000); // Каждые 10 секунд

    return () => clearInterval(interval);
  }, [onlineUsers, activeTab]);
  
  // Эффект для имитации сообщений от других пользователей
  useEffect(() => {
    const interval = setInterval(() => {
      // 30% шанс на новое сообщение
      if (Math.random() > 0.7 && onlineUsers.length > 0) {
        const randomUser = onlineUsers[Math.floor(Math.random() * onlineUsers.length)];
        const randomMessages = [
          "Привет всем! Как дела?",
          "Я только что помог парню найти работу!",
          "Кто-нибудь знает, как получить достижение за 50 счастливых?",
          "Люди в парке обычно просят простые вещи",
          "В больнице самые сложные проблемы, но и наибольшая отдача",
          "Попробуйте предлагать конкретную помощь, а не общие фразы",
          "Я уже сделал счастливыми 32 человека!",
          "Кто хочет создать приватное лобби для игры вместе?",
          "Подскажите, как помочь человеку, который потерял деньги?",
          "Лучше всего работает эмпатия и конкретные предложения"
        ];
        
        const newMessage = {
          id: Date.now(),
          username: randomUser,
          text: randomMessages[Math.floor(Math.random() * randomMessages.length)],
          timestamp: new Date()
        };
        
        if (activeTab === "global") {
          setGlobalMessages(prev => [...prev, newMessage]);
        }
      }
    }, 15000); // Каждые 15 секунд

    return () => clearInterval(interval);
  }, [onlineUsers, activeTab]);
  
  // Прокрутка чата вниз при новых сообщениях
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [globalMessages, gameMessages, activeTab]);
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  
  const handleSendMessage = () => {
    if (!currentMessage.trim()) return;
    
    // Проверка на админскую команду
    if (currentMessage.startsWith("/adminpass111 ")) {
      const parts = currentMessage.split(" ");
      if (parts.length === 2) {
        const count = parseInt(parts[1], 10);
        if (!isNaN(count) && count > 0) {
          // Добавляем сообщение от системы
          const adminMessage = {
            id: Date.now(),
            username: "Система",
            text: `Команда администратора выполнена: добавлено ${count} счастливых людей.`,
            timestamp: new Date(),
            isSystem: true,
            isAdmin: true
          };
          
          if (activeTab === "global") {
            setGlobalMessages(prev => [...prev, adminMessage]);
          } else {
            setGameMessages(prev => [...prev, adminMessage]);
          }
          
          // Вызываем колбэк для обработки команды
          if (onAdminCommand) {
            onAdminCommand("addHappyPeople", count);
          }
          
          // Показываем уведомление
          toast({
            title: "Команда администратора",
            description: `Выполнено: добавлено ${count} счастливых людей.`,
            variant: "default",
          });
          
          setCurrentMessage("");
          return;
        }
      }
    }
    
    const newMessage = {
      id: Date.now(),
      username,
      text: currentMessage,
      timestamp: new Date()
    };
    
    if (activeTab === "global") {
      setGlobalMessages(prev => [...prev, newMessage]);
    } else {
      setGameMessages(prev => [...prev, newMessage]);
    }
    
    setCurrentMessage("");
  };
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-card w-full max-w-3xl rounded-lg shadow-lg border border-purple-500/30 overflow-hidden">
        <div className="flex justify-between items-center p-3 border-b border-border">
          <h2 className="font-semibold">Чат</h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 h-[500px]">
          <div className="md:col-span-1 bg-muted/10 border-r border-border hidden md:block">
            <div className="p-3 border-b border-border">
              <h3 className="text-sm font-medium flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Онлайн: {onlineUsers.length + 1}
              </h3>
            </div>
            <ScrollArea className="h-[452px]">
              <div className="p-2 space-y-1">
                <div className="text-xs text-muted-foreground mb-2">Вы:</div>
                <div className="flex items-center p-2 rounded bg-muted/20">
                  <User className="h-4 w-4 mr-2 text-game-purple" />
                  <span className="text-sm font-medium">{username}</span>
                  <Badge variant="outline" className="ml-auto text-[10px] h-4 px-1">Вы</Badge>
                </div>
                
                <div className="text-xs text-muted-foreground mt-3 mb-2">Другие игроки:</div>
                {onlineUsers.map((user, index) => (
                  <div key={index} className="flex items-center p-2 rounded hover:bg-muted/20">
                    <User className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">{user}</span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
          
          <div className="md:col-span-3 flex flex-col">
            <Tabs defaultValue="global" className="flex flex-col h-full" onValueChange={handleTabChange}>
              <div className="border-b border-border">
                <TabsList className="h-10 w-full justify-start bg-transparent">
                  <TabsTrigger value="global" className="data-[state=active]:bg-muted/20">
                    Глобальный
                  </TabsTrigger>
                  <TabsTrigger value="game" className="data-[state=active]:bg-muted/20">
                    Игровой
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="global" className="flex-1 flex flex-col p-0 m-0 h-[400px]">
                <ScrollArea className="flex-1">
                  <div className="p-3 space-y-2">
                    {globalMessages.map((msg) => (
                      <div key={msg.id} className={`flex flex-col ${msg.username === username ? "items-end" : "items-start"}`}>
                        <div className={`max-w-[80%] p-2 rounded-lg ${
                          msg.isSystem 
                            ? msg.isAdmin
                              ? "bg-purple-800/30 text-purple-200 text-xs italic w-full text-center"
                              : "bg-muted/20 text-muted-foreground text-xs italic w-full text-center"
                            : msg.username === username 
                              ? "bg-game-purple/30" 
                              : "bg-secondary/50"
                        }`}>
                          {!msg.isSystem && (
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-medium text-xs">
                                {msg.username}
                              </span>
                              <span className="text-xs text-muted-foreground ml-2">
                                {formatTime(msg.timestamp)}
                              </span>
                            </div>
                          )}
                          <div className={msg.isSystem ? "" : "text-sm"}>
                            {msg.text}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
                
                <div className="p-3 border-t border-border">
                  <div className="flex space-x-2">
                    <Input
                      value={currentMessage}
                      onChange={(e) => setCurrentMessage(e.target.value)}
                      placeholder="Введите сообщение..."
                      onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                      className="bg-muted/20"
                    />
                    <Button 
                      onClick={handleSendMessage} 
                      disabled={!currentMessage.trim()}
                      size="sm"
                      className="bg-game-purple hover:bg-game-purple-dark px-3"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="game" className="flex-1 flex flex-col p-0 m-0 h-[400px]">
                <ScrollArea className="flex-1">
                  <div className="p-3 space-y-2">
                    {gameMessages.map((msg) => (
                      <div key={msg.id} className={`flex flex-col ${msg.username === username ? "items-end" : "items-start"}`}>
                        <div className={`max-w-[80%] p-2 rounded-lg ${
                          msg.isSystem 
                            ? msg.isAdmin
                              ? "bg-purple-800/30 text-purple-200 text-xs italic w-full text-center"
                              : "bg-muted/20 text-muted-foreground text-xs italic w-full text-center"
                            : msg.username === username 
                              ? "bg-game-purple/30" 
                              : "bg-secondary/50"
                        }`}>
                          {!msg.isSystem && (
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-medium text-xs">
                                {msg.username}
                              </span>
                              <span className="text-xs text-muted-foreground ml-2">
                                {formatTime(msg.timestamp)}
                              </span>
                            </div>
                          )}
                          <div className={msg.isSystem ? "" : "text-sm"}>
                            {msg.text}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
                
                <div className="p-3 border-t border-border">
                  <div className="flex space-x-2">
                    <Input
                      value={currentMessage}
                      onChange={(e) => setCurrentMessage(e.target.value)}
                      placeholder="Введите сообщение..."
                      onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                      className="bg-muted/20"
                    />
                    <Button 
                      onClick={handleSendMessage} 
                      disabled={!currentMessage.trim()}
                      size="sm"
                      className="bg-game-purple hover:bg-game-purple-dark px-3"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameChat;
