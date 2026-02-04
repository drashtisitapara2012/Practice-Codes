import Image from 'next/image';
import Link from 'next/link';
import { GitHubUser } from '@/app/types/github';

interface UserCardProps {
  user: GitHubUser;
}

export default function UserCard({ user }: UserCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">
          <Image
            src={user.avatar_url}
            alt={`${user.login}'s avatar`}
            width={60}
            height={60}
            className="rounded-full"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
            {user.login}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
            {user.type}
          </p>
        </div>
        <div className="flex-shrink-0">
          <Link
            href={`/users/${user.login}`}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            View Profile
          </Link>
        </div>
      </div>
    </div>
  );
}
