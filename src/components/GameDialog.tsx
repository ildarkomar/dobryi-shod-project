
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface NPC {
  name: string;
  problem: string;
  avatarUrl: string;
}

interface GameDialogProps {
  npc: NPC;
  onResponse: (success: boolean, response: string) => void;
}

const GameDialog = ({ npc, onResponse }: GameDialogProps) => {
  const [userInput, setUserInput] = useState("");
  const [conversation, setConversation] = useState<{ text: string; isPlayer: boolean; isError?: boolean }[]>([]);
  const [thinking, setThinking] = useState(false);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  
  // Обновляем диалог при смене NPC
  useEffect(() => {
    setConversation([
      { text: `Привет, я ${npc.name}. Я расстроен потому что ${npc.problem}.`, isPlayer: false }
    ]);
    setFeedbackMessage(null);
  }, [npc]);
  
  const handleSendMessage = () => {
    if (!userInput.trim() || thinking) return;
    
    // Добавляем сообщение игрока
    setConversation(prev => [...prev, { text: userInput, isPlayer: true }]);
    
    // Имитация "размышления" NPC
    setThinking(true);
    setInputDisabled(true);
    
    // Шанс 50/50 на успех ответа
    const isSuccessful = Math.random() > 0.5;
    
    setTimeout(() => {
      // Ответ NPC на основе успеха или неудачи
      if (isSuccessful) {
        const successResponses = [
          "Спасибо за помощь! Мне стало легче.",
          "Как мило с вашей стороны. Это мне очень помогло.",
          "Вау, я не ожидал такой поддержки! Спасибо!",
          "Это очень помогло мне. Мир не без добрых людей."
        ];
        
        setConversation(prev => [
          ...prev, 
          { text: successResponses[Math.floor(Math.random() * successResponses.length)], isPlayer: false }
        ]);
        
        setFeedbackMessage("Вы успешно помогли этому человеку! 👍");
        
        // Уведомляем родительский компонент о успешном ответе
        onResponse(true, userInput);
        
        // Полностью блокируем ввод для этого NPC
        setInputDisabled(true);
      } else {
        const failResponses = [
          "Я не думаю, что это поможет мне...",
          "Не уверен, что вы меня правильно поняли.",
          "Хм, это не совсем то, что мне нужно сейчас.",
          "Спасибо за попытку, но это не решает мою проблему."
        ];
        
        setConversation(prev => [
          ...prev, 
          { 
            text: failResponses[Math.floor(Math.random() * failResponses.length)], 
            isPlayer: false,
            isError: true
          }
        ]);
        
        setFeedbackMessage("Ваш ответ не помог. Попробуйте что-то другое.");
        
        // Уведомляем родительский компонент о неуспешном ответе
        onResponse(false, userInput);
        
        // Разблокируем ввод для новой попытки
        setInputDisabled(false);
      }
      
      setThinking(false);
      setUserInput("");
    }, 1500);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start space-x-4">
        <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 shadow-lg border-2 border-purple-500/30">
          <img src={npc.avatarUrl} alt={npc.name} className="w-full h-full object-cover" />
        </div>
        
        <div className="flex-1">
          <h3 className="font-bold text-lg">{npc.name}</h3>
          <p className="text-sm text-muted-foreground">Проблема: {npc.problem}</p>
        </div>
      </div>
      
      <Card className="p-4 bg-muted/30 h-64 overflow-y-auto flex flex-col border border-purple-500/20">
        <div className="flex-1 space-y-3">
          {conversation.map((message, i) => (
            <div 
              key={i} 
              className={`p-2 rounded-lg max-w-[80%] transition-all animate-fade-in ${
                message.isPlayer 
                  ? "bg-game-purple/30 ml-auto" 
                  : message.isError
                    ? "bg-red-500/20 border border-red-500/30 mr-auto"
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
      
      {feedbackMessage && (
        <Alert className={`py-2 ${feedbackMessage.includes("успешно") ? "bg-green-500/10 border-green-500/30" : "bg-amber-500/10 border-amber-500/30"}`}>
          <AlertCircle className={`h-4 w-4 ${feedbackMessage.includes("успешно") ? "text-green-500" : "text-amber-500"}`} />
          <AlertDescription className="text-sm">
            {feedbackMessage}
          </AlertDescription>
        </Alert>
      )}
      
      <div className="flex space-x-2">
        <Input
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder={inputDisabled && feedbackMessage?.includes("успешно") ? "Вы уже помогли этому человеку" : "Напишите, как вы хотите помочь..."}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          disabled={thinking || (inputDisabled && feedbackMessage?.includes("успешно"))}
          className="bg-muted/30"
        />
        <Button 
          onClick={handleSendMessage} 
          disabled={!userInput.trim() || thinking || (inputDisabled && feedbackMessage?.includes("успешно"))}
          className="bg-game-purple hover:bg-game-purple-dark"
        >
          Отправить
        </Button>
      </div>
      
      <div className="text-xs text-muted-foreground">
        <p>Подсказка: Предложите конкретную помощь в решении проблемы персонажа. Если не получилось с первого раза - попробуйте другой подход!</p>
      </div>
    </div>
  );
};

export default GameDialog;
