import { useEffect } from 'react';

// Warns on tab close / refresh when there are unsaved changes. In-app
// navigation blocking (e.g. clicking "Projects" in the sidebar mid-edit)
// would need a data router (createBrowserRouter + useBlocker); this app
// uses a plain BrowserRouter, so that part isn't practical without a
// bigger routing change. The browser-level warning covers the most
// common accidental-loss case (closing the tab or hitting refresh).
export function useUnsavedChangesWarning(isDirty) {
  useEffect(() => {
    function handler(e) {
      if (!isDirty) return;
      e.preventDefault();
      e.returnValue = '';
    }
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isDirty]);
}
