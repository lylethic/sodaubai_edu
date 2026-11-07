"use client";
// import { isClient } from '@/lib/http';
import { UserResType } from "@/schemaValidations/account.schema";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type User = UserResType["data"];

// ======================= APP USER CONTEXT =======================
const AppContext = createContext<{
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
}>({
  user: null,
  setUser: () => {},
  isAuthenticated: false,
});

export const useAppContext = () => {
  const context = useContext(AppContext);
  return context;
};

// ===================== LOADING CONTEXT & HOOK =====================
interface LoadingContextType {
  isLoading: boolean;
  message?: string;
  showLoading: (msg?: string) => void;
  hideLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType>({
  isLoading: false,
  message: undefined,
  showLoading: () => {},
  hideLoading: () => {},
});

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error(
      "useLoading must be used within an AppProvider/LoadingProvider",
    );
  }
  return context;
};

// Global Loading Overlay Component
export function GlobalLoadingOverlay({
  isLoading,
  message,
}: {
  isLoading: boolean;
  message?: string;
}) {
  if (!isLoading) return null;

  return (
    <div
      role='status'
      aria-live='polite'
      className='fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px] transition-all'
    >
      <div className='flex flex-col items-center gap-3 rounded-2xl bg-white/95 p-6 shadow-2xl dark:bg-slate-900/95 border border-gray-100 dark:border-gray-800'>
        <svg
          aria-hidden='true'
          className='h-10 w-10 animate-spin text-gray-200 dark:text-gray-700 fill-blue-600'
          viewBox='0 0 100 101'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
            fill='currentColor'
          />
          <path
            d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
            fill='currentFill'
          />
        </svg>
        <span className='text-sm font-medium text-gray-700 dark:text-gray-200'>
          {message || ""}
        </span>
      </div>
    </div>
  );
}

// ======================== APP PROVIDER ========================
export default function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUserState] = useState<User | null>(() => {
    return null;
  });
  const isAuthenticated = Boolean(user);

  // Counter để quản lý nhiều cuộc gọi showLoading/hideLoading đồng thời
  const [loadingCount, setLoadingCount] = useState<number>(0);
  const [loadingMessage, setLoadingMessage] = useState<string | undefined>(
    undefined,
  );

  const showLoading = useCallback((msg?: string) => {
    setLoadingMessage(msg);
    setLoadingCount((prev) => prev + 1);
  }, []);

  const hideLoading = useCallback(() => {
    setLoadingCount((prev) => {
      const nextCount = Math.max(0, prev - 1);
      if (nextCount === 0) {
        setLoadingMessage(undefined);
      }
      return nextCount;
    });
  }, []);

  const setUser = useCallback(
    (user: User | null) => {
      setUserState(user);
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        localStorage.removeItem("user");
      }
    },
    [setUserState],
  );

  useEffect(() => {
    const _user = localStorage.getItem("user");
    setUserState(_user ? JSON.parse(_user) : null);
  }, [setUserState]);

  // Keep the global overlay in sync with requests made by the shared HTTP client.
  useEffect(() => {
    const onRequestStart = (event: Event) => {
      const message = (event as CustomEvent<string | undefined>).detail;
      showLoading(message);
    };
    const onRequestEnd = () => hideLoading();

    window.addEventListener("app:loading:start", onRequestStart);
    window.addEventListener("app:loading:end", onRequestEnd);
    return () => {
      window.removeEventListener("app:loading:start", onRequestStart);
      window.removeEventListener("app:loading:end", onRequestEnd);
    };
  }, [showLoading, hideLoading]);

  const isLoading = loadingCount > 0;

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated,
      }}
    >
      <LoadingContext.Provider
        value={{
          isLoading,
          message: loadingMessage,
          showLoading,
          hideLoading,
        }}
      >
        {children}
        <GlobalLoadingOverlay isLoading={isLoading} message={loadingMessage} />
      </LoadingContext.Provider>
    </AppContext.Provider>
  );
}
