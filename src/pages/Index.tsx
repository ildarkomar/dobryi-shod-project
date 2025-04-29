
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GameLogo from "@/components/GameLogo";

const Index = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // В реальном приложении здесь была бы настоящая авторизация
    localStorage.setItem("gameUser", username);
    navigate("/game");
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // В реальном приложении здесь была бы настоящая регистрация
    localStorage.setItem("gameUser", username);
    navigate("/game");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl flex flex-col items-center space-y-8 fade-in">
        <GameLogo className="w-64 h-64 mb-4 float-animation" />
        
        <Card className="w-full max-w-md p-6 bg-card/80 backdrop-blur-sm border-game-purple">
          <h1 className="text-3xl font-bold text-center mb-2 text-game-purple-light">Добрый Шод: в городе</h1>
          
          <div className="space-y-6 mt-6">
            <div className="prose prose-invert max-w-none">
              <p className="text-center mb-4">
                Добро пожаловать в игру, где вы можете изменить мир к лучшему!
              </p>
              <p className="text-sm mb-4">
                Вы переехали в незнакомый город, полный грустных и расстроенных людей. 
                Ваша миссия — развеселить их, помогать с повседневными заботами, 
                осуществлять мечты и делать добрые дела.
              </p>
              <p className="text-sm">
                Достигните цели в 100 счастливых горожан, играйте сами или с друзьями, 
                и наблюдайте как город преображается благодаря вашим добрым поступкам!
              </p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Вход</TabsTrigger>
                <TabsTrigger value="register">Регистрация</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Input
                      type="text"
                      placeholder="Имя пользователя"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      className="bg-muted/70"
                    />
                  </div>
                  <div className="space-y-2">
                    <Input
                      type="password"
                      placeholder="Пароль"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="bg-muted/70"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-game-purple hover:bg-game-purple-dark transition-all pulse-animation"
                  >
                    Войти
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Input
                      type="text"
                      placeholder="Имя пользователя"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      className="bg-muted/70"
                    />
                  </div>
                  <div className="space-y-2">
                    <Input
                      type="password"
                      placeholder="Пароль"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="bg-muted/70"
                    />
                  </div>
                  <div className="space-y-2">
                    <Input
                      type="password"
                      placeholder="Подтвердите пароль"
                      required
                      className="bg-muted/70"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-game-purple hover:bg-game-purple-dark transition-all"
                  >
                    Зарегистрироваться
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </div>
        </Card>
        
        <div className="text-center text-sm text-muted-foreground mt-4">
          &copy; 2025 Добрый Шод. Все права защищены.
        </div>
      </div>
    </div>
  );
};

export default Index;
