
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Building {
  id: number;
  name: string;
  type: 'house' | 'shop' | 'park' | 'hospital' | 'school';
  x: number;
  y: number;
  peopleCount: number;
}

const CityMap = ({ onBuildingSelect }: { onBuildingSelect: (buildingId: number) => void }) => {
  const [buildings, setBuildings] = useState<Building[]>([
    { id: 1, name: "Жилой дом №1", type: "house", x: 15, y: 20, peopleCount: 8 },
    { id: 2, name: "Продуктовый магазин", type: "shop", x: 40, y: 30, peopleCount: 5 },
    { id: 3, name: "Городской парк", type: "park", x: 65, y: 40, peopleCount: 12 },
    { id: 4, name: "Больница", type: "hospital", x: 25, y: 60, peopleCount: 10 },
    { id: 5, name: "Школа №3", type: "school", x: 75, y: 70, peopleCount: 15 },
    { id: 6, name: "Жилой дом №2", type: "house", x: 55, y: 15, peopleCount: 6 },
    { id: 7, name: "Спортивный центр", type: "shop", x: 85, y: 50, peopleCount: 7 },
  ]);

  const getBuildingColor = (type: Building['type']) => {
    switch (type) {
      case 'house': return 'bg-blue-500/70';
      case 'shop': return 'bg-green-500/70';
      case 'park': return 'bg-emerald-500/70';
      case 'hospital': return 'bg-red-500/70';
      case 'school': return 'bg-yellow-500/70';
      default: return 'bg-gray-500/70';
    }
  };

  const getBuildingIcon = (type: Building['type']) => {
    switch (type) {
      case 'house': return '🏠';
      case 'shop': return '🛒';
      case 'park': return '🌳';
      case 'hospital': return '🏥';
      case 'school': return '🏫';
      default: return '🏢';
    }
  };

  return (
    <div className="relative w-full h-[500px] bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg overflow-hidden border border-purple-800/50">
      {/* Дороги */}
      <div className="absolute w-full h-1 top-1/3 bg-gray-600"></div>
      <div className="absolute w-full h-1 top-2/3 bg-gray-600"></div>
      <div className="absolute h-full w-1 left-1/3 bg-gray-600"></div>
      <div className="absolute h-full w-1 left-2/3 bg-gray-600"></div>
      
      {/* Здания */}
      {buildings.map((building) => (
        <TooltipProvider key={building.id}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div 
                className={`absolute cursor-pointer rounded-md p-2 ${getBuildingColor(building.type)} hover:scale-110 transition-transform shadow-md backdrop-blur-sm`}
                style={{
                  left: `${building.x}%`,
                  top: `${building.y}%`,
                  transform: 'translate(-50%, -50%)',
                  width: '50px',
                  height: '50px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(255,255,255,0.2)'
                }}
                onClick={() => onBuildingSelect(building.id)}
              >
                <span className="text-2xl">{getBuildingIcon(building.type)}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent className="bg-gray-900/90 border border-purple-700/50">
              <div className="p-1 text-xs">
                <p className="font-bold">{building.name}</p>
                <p>Людей: {building.peopleCount}</p>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}

      {/* Легенда */}
      <div className="absolute bottom-2 right-2 bg-gray-900/80 p-2 rounded-md border border-purple-800/50 text-xs">
        <h4 className="font-bold mb-1">Легенда:</h4>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1">
          <div className="flex items-center">
            <span className="mr-1">🏠</span> Жилые дома
          </div>
          <div className="flex items-center">
            <span className="mr-1">🛒</span> Магазины
          </div>
          <div className="flex items-center">
            <span className="mr-1">🌳</span> Парки
          </div>
          <div className="flex items-center">
            <span className="mr-1">🏥</span> Больницы
          </div>
          <div className="flex items-center">
            <span className="mr-1">🏫</span> Школы
          </div>
        </div>
      </div>
    </div>
  );
};

export default CityMap;
