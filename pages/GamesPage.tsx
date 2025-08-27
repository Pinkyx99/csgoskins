import React from 'react';
import { useNavigate } from 'react-router-dom';

interface GameCardProps {
  title: string;
  description: string;
  imageUrl: string;
  path: string;
}

const GameCard: React.FC<GameCardProps> = ({ title, description, imageUrl, path }) => {
  const navigate = useNavigate();
  return (
    <div
      className="relative rounded-lg overflow-hidden cursor-pointer group transition-all duration-300 transform hover:scale-105 hover:-translate-y-2"
      onClick={() => navigate(path)}
    >
      <img src={imageUrl} alt={title} className="w-full h-80 object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
      <div className="absolute bottom-0 left-0 p-6">
        <h3 className="text-3xl font-bold text-white">{title}</h3>
        <p className="text-gray-300 mt-1">{description}</p>
      </div>
    </div>
  );
};

const GamesPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 fade-in-up">
      <h1 className="text-4xl font-bold text-center mb-8">Choose a Game</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <GameCard
          title="Mines"
          description="Click tiles, find gems, and avoid the mines. Cash out anytime!"
          imageUrl="https://i.imgur.com/e9LA8iT.png"
          path="/games/mines"
        />
        <GameCard
          title="Coinflip"
          description="A simple 50/50 chance. Choose a side and double your bet."
          imageUrl="https://i.imgur.com/a9Oq7s5.png"
          path="/games/coinflip"
        />
      </div>
    </div>
  );
};

export default GamesPage;
