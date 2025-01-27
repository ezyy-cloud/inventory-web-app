import { Bell, User, Menu } from 'lucide-react';
import { useSessionStore } from '../stores/sessionStore';

export function TopBar() {
  const { user } = useSessionStore();

  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-800 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between w-full">
        <div className="flex items-center">
          {/* Hamburger menu toggle */}
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 dark:text-gray-300 lg:hidden"
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <div className="flex items-center gap-x-4 lg:gap-x-6">
            <button
              type="button"
              className="-m-2.5 p-2.5 text-gray-700 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-200"
            >
              <Bell className="h-5 w-5" />
            </button>

            <div className="flex items-center">
              <span className="text-sm text-gray-700 dark:text-gray-300 mr-2">
                {user?.email}
              </span>
              <button
                type="button"
                className="-m-2.5 p-2.5 text-gray-700 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-200"
              >
                <User className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}