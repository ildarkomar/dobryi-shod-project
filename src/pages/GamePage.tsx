
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
  const [inventory, setInventory] = useState<string[]>([]);
  const navigate = useNavigate();
  
  // Максимальный размер инвентаря
  const MAX_INVENTORY_SIZE = 8;
  
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
    
    // Загрузка инвентаря
    const savedInventory = localStorage.getItem("gameInventory");
    if (savedInventory) {
      setInventory(JSON.parse(savedInventory));
    }
  }, [navigate]);

  // Сохраняем прогресс при изменении счётчика счастливых людей
  useEffect(() => {
    localStorage.setItem("gameProgress", happyPeople.toString());
  }, [happyPeople]);
  
  // Сохраняем инвентарь при его изменении
  useEffect(() => {
    localStorage.setItem("gameInventory", JSON.stringify(inventory));
  }, [inventory]);

  const handleDialogResponse = (success: boolean, response: string) => {
    if (success) {
      // Инкрементируем счётчик только при успешном ответе
      setHappyPeople(prev => prev + 1);
      
      // С вероятностью 20% даём предмет в инвентарь, если есть место
      if (Math.random() < 0.2 && inventory.length < MAX_INVENTORY_SIZE) {
        giveRandomItem();
      }
      
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
  
  const giveRandomItem = () => {
    const items = [
      "Цветы", "Шоколадка", "Книга", "Игрушка", "Билет в кино", 
      "Пицца", "Теплый шарф", "Зонтик", "Чашка чая", "Лекарство",
      "Торт", "Гитара", "Наушники", "Конфеты", "Письмо"
    ];
    
    const newItem = items[Math.floor(Math.random() * items.length)];
    setInventory(prev => [...prev, newItem]);
    
    toast({
      title: "Новый предмет получен!",
      description: `Вы получили: ${newItem}`,
      variant: "default",
    });
  };
  
  const handleUseItem = (itemIndex: number) => {
    // Удаляем использованный предмет из инвентаря
    setInventory(prev => prev.filter((_, index) => index !== itemIndex));
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
  
  // Обработчик админской команды из чата
  const handleAdminCommand = (command: string, value: number) => {
    if (command === "addHappyPeople") {
      // Увеличиваем счётчик счастливых людей на указанное значение
      let newCount = happyPeople + value;
      
      // Ограничиваем максимальное значение до 100
      if (newCount > 100) newCount = 100;
      
      setHappyPeople(newCount);
      
      // Проверяем достижения
      if (newCount >= 10 && happyPeople < 10) {
        toast({
          title: "Достижение разблокировано!",
          description: "10 счастливых людей",
          variant: "default",
        });
      }
      
      if (newCount >= 50 && happyPeople < 50) {
        toast({
          title: "Достижение разблокировано!",
          description: "50 счастливых людей",
          variant: "default",
        });
      }
      
      if (newCount >= 100 && happyPeople < 100) {
        toast({
          title: "Поздравляем!",
          description: "Вы сделали счастливыми 100 человек и завершили игру!",
          variant: "default",
        });
      }
    }
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
                    inventoryItems={inventory}
                    onUseItem={handleUseItem}
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
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Ваш инвентарь</h3>
                    <span className="text-sm text-muted-foreground">{inventory.length}/{MAX_INVENTORY_SIZE}</span>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4">
                    {inventory.length > 0 ? (
                      inventory.map((item, index) => (
                        <div 
                          key={index} 
                          className="aspect-square bg-purple-500/10 rounded-md flex flex-col items-center justify-center p-2 border border-purple-500/30 hover:border-purple-500/50 transition-colors cursor-pointer"
                          onClick={() => {
                            // Показываем уведомление о необходимости использовать предмет в диалоге
                            toast({
                              title: "Предмет выбран",
                              description: "Используйте этот предмет во время диалога с жителем города.",
                              variant: "default",
                            });
                          }}
                        >
                          <div className="text-xl mb-1">🎁</div>
                          <div className="text-xs text-center">{item}</div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-4 py-8 text-center text-muted-foreground">
                        Ваш инвентарь пуст. Помогайте людям, чтобы получать полезные предметы!
                      </div>
                    )}
                    
                    {Array(Math.max(0, MAX_INVENTORY_SIZE - inventory.length)).fill(0).map((_, i) => (
                      <div key={i} className="aspect-square bg-muted/20 rounded-md flex items-center justify-center border border-purple-500/10">
                        <span className="text-muted-foreground text-xs">Пусто</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="p-2 bg-muted/30 rounded-md text-sm text-muted-foreground">
                    <p>Подсказка: В инвентаре хранятся предметы, которые вы можете использовать при общении с жителями города. Предметы могут мгновенно решить проблемы некоторых людей!</p>
                  </div>
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
            onAdminCommand={handleAdminCommand}
          />
        )}
      </div>
    </div>
  );
};

export default GamePage;
