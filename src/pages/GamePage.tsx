
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/use-toast";
import GameChat from "@/components/GameChat";
import GameDialog from "@/components/GameDialog";
import CityMap from "@/components/CityMap";

const GamePage = () => {
  const [happyPeople, setHappyPeople] = useState(0);
  const [selectedBuilding, setSelectedBuilding] = useState<number | null>(null);
  const [currentNPC, setCurrentNPC] = useState({ 
    name: "Михаил", 
    problem: "не может найти работу уже несколько месяцев",
    avatarUrl: "https://source.unsplash.com/random/100x100/?man,sad" 
  });
  const [chatOpen, setChatOpen] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Проверка авторизации
    const user = localStorage.getItem("gameUser");
    if (!user) {
      navigate("/");
    }
    
    // Загрузка прогресса
    const savedProgress = localStorage.getItem("gameProgress");
    if (savedProgress) {
      setHappyPeople(parseInt(savedProgress, 10));
    }
  }, [navigate]);

  // Сохраняем прогресс при изменении счётчика счастливых людей
  useEffect(() => {
    localStorage.setItem("gameProgress", happyPeople.toString());
  }, [happyPeople]);

  const handleDialogResponse = (success: boolean, response: string) => {
    if (success) {
      // Инкрементируем счётчик только при успешном ответе
      setHappyPeople(prev => prev + 1);
      
      // Проверяем достижения
      if (happyPeople === 0) {
        toast({
          title: "Достижение разблокировано!",
          description: "Первый счастливый человек",
          variant: "default",
        });
      } else if (happyPeople === 9) {
        toast({
          title: "Достижение разблокировано!",
          description: "10 счастливых людей",
          variant: "default",
        });
      } else if (happyPeople === 49) {
        toast({
          title: "Достижение разблокировано!",
          description: "50 счастливых людей",
          variant: "default",
        });
      } else if (happyPeople === 99) {
        toast({
          title: "Поздравляем!",
          description: "Вы сделали счастливыми 100 человек и завершили игру!",
          variant: "default",
        });
      }
      
      // Случайно выбираем следующего NPC
      setTimeout(() => {
        generateNewNPC();
      }, 2000);
    }
  };
  
  const generateNewNPC = () => {
    const names = ["Анна", "Сергей", "Ольга", "Иван", "Мария", "Дмитрий", "Елена", "Никита", "Татьяна"];
    const problems = [
      "потеряла ключи от квартиры",
      "грустит из-за расставания с девушкой",
      "не может позволить себе купить продукты",
      "чувствует себя одиноким в новом городе",
      "переживает из-за предстоящего экзамена",
      "не может найти потерявшуюся кошку",
      "ищет хорошего врача для больной мамы",
      "не может оплатить счета за коммунальные услуги",
      "нужна помощь с переездом в новую квартиру"
    ];
    
    setCurrentNPC({
      name: names[Math.floor(Math.random() * names.length)],
      problem: problems[Math.floor(Math.random() * problems.length)],
      avatarUrl: `https://source.unsplash.com/random/100x100/?person,${Math.random()}`
    });
  };

  const handleBuildingSelect = (buildingId: number) => {
    setSelectedBuilding(buildingId);
    // Генерируем нового NPC для этого здания
    generateNewNPC();
    
    // Переключаем на вкладку игры
    const tabsElement = document.querySelector('[data-state="inactive"][data-value="game"]') as HTMLElement;
    if (tabsElement) {
      tabsElement.click();
    }
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
          <Card className="p-4 col-span-1 bg-card/90 backdrop-blur-sm border border-purple-500/20">
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
              
              <div className="space-y-2">
                <div className="text-sm mb-2">
                  Подсказка: Помогая людям, вы увеличиваете их счастье. У вас не всегда будет получаться с первого раза - пробуйте разные подходы!
                </div>
                <Button 
                  className="w-full bg-game-purple hover:bg-game-purple-dark"
                  onClick={() => setChatOpen(true)}
                >
                  Открыть чат
                </Button>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 col-span-1 md:col-span-2 bg-card/90 backdrop-blur-sm border border-purple-500/20">
            <Tabs defaultValue="game">
              <TabsList className="mb-4">
                <TabsTrigger value="game">Игра</TabsTrigger>
                <TabsTrigger value="map">Карта города</TabsTrigger>
                <TabsTrigger value="inventory">Инвентарь</TabsTrigger>
              </TabsList>
              
              <TabsContent value="game" className="space-y-4 min-h-[500px]">
                {selectedBuilding !== null ? (
                  <GameDialog 
                    npc={currentNPC}
                    onResponse={handleDialogResponse}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-[400px] text-center space-y-4">
                    <div className="text-xl font-medium">Выберите здание на карте города</div>
                    <p className="text-muted-foreground max-w-md">
                      Чтобы начать помогать людям, перейдите на вкладку "Карта города" и выберите здание, где вы хотите найти человека, нуждающегося в помощи.
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        const tabsElement = document.querySelector('[data-state="inactive"][data-value="map"]') as HTMLElement;
                        if (tabsElement) {
                          tabsElement.click();
                        }
                      }}
                    >
                      Открыть карту города
                    </Button>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="map">
                <CityMap onBuildingSelect={handleBuildingSelect} />
              </TabsContent>
              
              <TabsContent value="inventory">
                <div className="grid grid-cols-4 gap-2">
                  {Array(8).fill(0).map((_, i) => (
                    <div key={i} className="aspect-square bg-muted/20 rounded-md flex items-center justify-center border border-purple-500/10 hover:border-purple-500/30 transition-colors">
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
