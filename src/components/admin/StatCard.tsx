import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: number;
  icon: ReactNode;
  color: string;
  gradient?: string;
}

const StatCard = ({ title, value, icon, color, gradient }: StatCardProps) => {
  return (
    <div 
      className={`${color} ${gradient} rounded-lg shadow-md p-6 transition-transform duration-300 hover:shadow-lg hover:-translate-y-1 font-heading`}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold mb-1">{title}</h3>
          <p className="text-3xl font-bold">{value}</p>
        </div>
        <div className="p-3 bg-white/30 rounded-full shadow-inner">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard; 