import { formatDistanceToNow } from 'date-fns';
import { MessageCircle, Users, CheckCircle, XCircle, Clock } from 'lucide-react';

interface Activity {
  id: string;
  type: 'registration' | 'contact';
  title: string;
  name: string;
  email: string;
  date: string;
  status?: string;
  resolved?: boolean;
}

interface ActivityFeedProps {
  activities: Activity[];
}

const ActivityFeed = ({ activities }: ActivityFeedProps) => {
  if (!activities || activities.length === 0) {
    return (
      <div className="text-center text-gray-400 py-6">
        No recent activity found
      </div>
    );
  }

  const getActivityIcon = (activity: Activity) => {
    if (activity.type === 'registration') {
      return <Users size={18} className="text-blue-400" />;
    } else if (activity.type === 'contact') {
      return <MessageCircle size={18} className="text-green-400" />;
    }
    return null;
  };

  const getStatusIcon = (activity: Activity) => {
    if (activity.type === 'registration') {
      if (activity.status === 'confirmed') {
        return <CheckCircle size={16} className="text-green-400" />;
      } else if (activity.status === 'rejected') {
        return <XCircle size={16} className="text-red-400" />;
      } else {
        return <Clock size={16} className="text-yellow-400" />;
      }
    } else if (activity.type === 'contact') {
      return activity.resolved ? 
        <CheckCircle size={16} className="text-green-400" /> : 
        <Clock size={16} className="text-yellow-400" />;
    }
    return null;
  };

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="border-b border-gray-700 pb-4 last:border-0">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-full bg-gray-700">
              {getActivityIcon(activity)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-white truncate">{activity.title}</p>
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  {getStatusIcon(activity)}
                  {formatDistanceToNow(new Date(activity.date), { addSuffix: true })}
                </span>
              </div>
              <p className="text-xs text-gray-400">
                {activity.name} • {activity.email}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActivityFeed; 