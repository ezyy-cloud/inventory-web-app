export function Settings() {
  return (
    <div className="space-y-6 p-6 bg-white dark:bg-dark-900 min-h-screen">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Settings</h1>

      <div className="bg-white dark:bg-dark-800 shadow-sm ring-1 ring-gray-900/5 dark:ring-dark-600/50 sm:rounded-lg">
        <div className="px-4 py-6 sm:p-6">
          <div className="space-y-12">
            <div>
              <h2 className="text-base font-semibold leading-7 text-gray-900 dark:text-gray-100">Profile</h2>
              <p className="mt-1 text-sm leading-6 text-gray-500 dark:text-gray-400">
                Update your personal information and preferences.
              </p>

              <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-300">
                    Full name
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="name"
                      id="name"
                      className="app-input"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-300">
                    Email address
                  </label>
                  <div className="mt-2">
                    <input
                      type="email"
                      name="email"
                      id="email"
                      className="app-input"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-base font-semibold leading-7 text-gray-900 dark:text-gray-100">Notifications</h2>
              <p className="mt-1 text-sm leading-6 text-gray-500 dark:text-gray-400">
                Configure how you receive notifications.
              </p>

              <div className="mt-6">
                <fieldset>
                  <div className="space-y-4">
                    <div className="relative flex items-start">
                      <div className="flex h-6 items-center">
                        <input
                          id="low-stock"
                          name="low-stock"
                          type="checkbox"
                          className="app-checkbox"
                        />
                      </div>
                      <div className="ml-3">
                        <label htmlFor="low-stock" className="text-sm font-medium leading-6 text-gray-900 dark:text-gray-300">
                          Low stock alerts
                        </label>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Get notified when products are running low.</p>
                      </div>
                    </div>
                  </div>
                </fieldset>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-x-6">
            <button 
              type="button" 
              className="text-sm font-semibold leading-6 text-gray-900 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-indigo-600 dark:bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 dark:hover:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:focus-visible:outline-indigo-500"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}