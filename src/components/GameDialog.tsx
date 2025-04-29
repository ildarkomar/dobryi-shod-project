
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface NPC {
  name: string;
  problem: string;
  avatarUrl: string;
}

interface GameDialogProps {
  npc: NPC;
  onResponse: (response: string) => void;
}

const GameDialog = ({ npc, onResponse }: GameDialogProps) => {
  const [userInput, setUserInput] = useState("");
  const [conversation, setConversation] = useState<{ text: string; isPlayer: boolean }[]>([
    { text: `Привет, я ${npc.name}. Я расстроен потому что ${npc.problem}.`, isPlayer: false }
  ]);
  const [thinking, setThinking] = useState(false);
  
  const handleSendMessage = () => {
    if (!userInput.trim()) return;
    
    // Добавляем сообщение игрока
    setConversation(prev => [...prev, { text: userInput, isPlayer: true }]);
    
    // Имитация "размышления" NPC
    setThinking(true);
    setTimeout(() => {
      // Имитация ответа от NPC
      const responses = [
        "Спасибо за помощь! Мне стало легче.",
        "Как мило с вашей стороны. Это мне очень помогло.",
        "Вау, я не ожидал такой поддержки! Спасибо!",
        "Это очень помогло мне. Мир не без добрых людей."
      ];
      
      setConversation(prev => [
        ...prev, 
        { text: responses[Math.floor(Math.random() * responses.length)], isPlayer: false }
      ]);
      
      setThinking(false);
      setUserInput("");
      
      // Уведомляем родительский компонент о успешном ответе
      onResponse(userInput);
    }, 1500);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start space-x-4">
        <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
          <img src={npc.avatarUrl} alt={npc.name} className="w-full h-full object-cover" />
        </div>
        
        <div className="flex-1">
          <h3 className="font-bold">{npc.name}</h3>
          <p className="text-sm text-muted-foreground">Проблема: {npc.problem}</p>
        </div>
      </div>
      
      <Card className="p-4 bg-muted/30 h-64 overflow-y-auto flex flex-col">
        <div className="flex-1 space-y-3">
          {conversation.map((message, i) => (
            <div 
              key={i} 
              className={`p-2 rounded-lg max-w-[80%] ${
                message.isPlayer 
                  ? "bg-game-purple/30 ml-auto" 
                  : "bg-secondary/50 mr-auto"
              }`}
            >
              {message.text}
            </div>
          ))}
          {thinking && (
            <div className="bg-secondary/50 p-2 rounded-lg max-w-[80%] mr-auto">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
              </div>
            </div>
          )}
        </div>
      </Card>
      
      <div className="flex space-x-2">
        <Input
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Напишите, как вы хотите помочь..."
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          disabled={thinking}
          className="bg-muted/30"
        />
        <Button 
          onClick={handleSendMessage} 
          disabled={!userInput.trim() || thinking}
          className="bg-game-purple hover:bg-game-purple-dark"
        >
          Отправить
        </Button>
      </div>
      
      <div className="text-xs text-muted-foreground">
        Подсказка: Предложите конкретную помощь в решении проблемы персонажа
      </div>
    </div>
  );
};

export default GameDialog;
