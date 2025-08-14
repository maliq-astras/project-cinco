export const toastMessagesStyles = {
  container: "fixed top-4 right-4 z-50 flex flex-col gap-2",
  duplicateToast: "hidden bg-yellow-100 text-yellow-800 py-2 px-4 rounded-md text-sm font-medium border border-yellow-200 shadow-md animate-slideInRight font-mono",
  skipToast: "hidden bg-blue-100 text-blue-800 py-2 px-4 rounded-md text-sm font-medium border border-blue-200 shadow-md animate-slideInRight font-mono"
} as const;
