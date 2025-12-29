import { Button } from '@atoms/button';

interface ProfileCardProps {
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  onEdit?: () => void;
}

export function ProfileCard({
  name,
  email,
  avatar,
  bio,
  onEdit,
}: ProfileCardProps) {
  return (
    <div className="p-6 border rounded-lg bg-white dark:bg-gray-800 max-w-md">
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
          {avatar ? (
            <img
              src={avatar}
              alt={name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span className="text-2xl font-bold text-gray-600 dark:text-gray-300">
              {name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        <div className="flex-1">
          <h3 className="text-xl font-bold">{name}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{email}</p>
          {bio && (
            <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
              {bio}
            </p>
          )}
        </div>
      </div>

      {onEdit && (
        <div className="mt-4">
          <Button variant="outline" className="w-full" onClick={onEdit}>
            Edit Profile
          </Button>
        </div>
      )}
    </div>
  );
}
