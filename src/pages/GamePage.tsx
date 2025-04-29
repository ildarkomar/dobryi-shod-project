
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import GameChat from "@/components/GameChat";
import GameDialog from "@/components/GameDialog";

const GamePage = () => {
  const [happyPeople, setHappyPeople] = useState(0);
  const [currentNPC, setCurrentNPC] = useState({ 
    name: "Михаил", 
    problem: "не может найти работу уже несколько месяцев",
    avatarUrl: "https://source.unsplash.com/random/100x100/?man,sad" 
  });
  const [chatOpen, setChatOpen] = useState(false);
  const [userInput, setUserInput] = useState("");
  const navigate = useNavigate();
  
  useEffect(() => {
    // Проверка авторизации
    const user = localStorage.getItem("gameUser");
    if (!user) {
      navigate("/");
    }
  }, [navigate]);

  const handleDialogResponse = (response: string) => {
    // Имитация обработки ответа
    setTimeout(() => {
      setHappyPeople(prev => prev + 1);
      
      // Случайно выбираем следующего NPC
      const names = ["Анна", "Сергей", "Ольга", "Иван", "Мария"];
      const problems = [
        "потеряла ключи от квартиры",
        "грустит из-за расставания с девушкой",
        "не может позволить себе купить продукты",
        "чувствует себя одиноким в новом городе",
        "переживает из-за предстоящего экзамена"
      ];
      
      setCurrentNPC({
        name: names[Math.floor(Math.random() * names.length)],
        problem: problems[Math.floor(Math.random() * problems.length)],
        avatarUrl: `https://source.unsplash.com/random/100x100/?person,${Math.random()}`
      });
    }, 1500);
  };

  const handleLogout = () => {
    localStorage.removeItem("gameUser");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/30 p-4 fade-in">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-game-purple-light">Добрый Шод: в городе</h1>
            <Badge variant="outline" className="bg-muted/30">Beta</Badge>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm">
              Привет, <span className="font-bold">{localStorage.getItem("gameUser") || "Гость"}</span>
            </div>
            <Button size="sm" variant="outline" onClick={handleLogout}>
              Выйти
            </Button>
          </div>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-4 col-span-1 bg-card/90 backdrop-blur-sm">
            <h2 className="text-xl font-bold mb-4">Прогресс</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Счастливые люди:</span>
                  <span className="text-sm font-bold">{happyPeople}/100</span>
                </div>
                <Progress value={happyPeople} max={100} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Достижения:</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Badge variant="outline" className={`${happyPeople >= 1 ? "bg-game-purple/20" : "bg-muted/20"}`}>
                    Первый счастливый
                  </Badge>
                  <Badge variant="outline" className={`${happyPeople >= 10 ? "bg-game-purple/20" : "bg-muted/20"}`}>
                    10 счастливых
                  </Badge>
                  <Badge variant="outline" className={`${happyPeople >= 50 ? "bg-game-purple/20" : "bg-muted/20"}`}>
                    50 счастливых
                  </Badge>
                  <Badge variant="outline" className={`${happyPeople >= 100 ? "bg-game-purple/20" : "bg-muted/20"}`}>
                    100 счастливых
                  </Badge>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <Button 
                  className="w-full bg-game-purple hover:bg-game-purple-dark"
                  onClick={() => setChatOpen(true)}
                >
                  Открыть чат
                </Button>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 col-span-1 md:col-span-2 bg-card/90 backdrop-blur-sm">
            <Tabs defaultValue="game">
              <TabsList className="mb-4">
                <TabsTrigger value="game">Игра</TabsTrigger>
                <TabsTrigger value="map">Карта города</TabsTrigger>
                <TabsTrigger value="inventory">Инвентарь</TabsTrigger>
              </TabsList>
              
              <TabsContent value="game" className="space-y-4">
                <GameDialog 
                  npc={currentNPC}
                  onResponse={handleDialogResponse}
                />
              </TabsContent>
              
              <TabsContent value="map">
                <div className="aspect-video bg-muted/20 rounded-md flex items-center justify-center">
                  <p className="text-muted-foreground">Карта города будет доступна в следующем обновлении</p>
                </div>
              </TabsContent>
              
              <TabsContent value="inventory">
                <div className="grid grid-cols-4 gap-2">
                  {Array(8).fill(0).map((_, i) => (
                    <div key={i} className="aspect-square bg-muted/20 rounded-md flex items-center justify-center">
                      <span className="text-muted-foreground text-xs">Пусто</span>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
        
        {chatOpen && (
          <GameChat
            isOpen={chatOpen}
            onClose={() => setChatOpen(false)}
            username={localStorage.getItem("gameUser") || "Гость"}
          />
        )}
      </div>
    </div>
  );
};

export default GamePage;
