import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

interface SCI {
  schedule: string;
  setSchedule: (schedule: string) => void;
}

const ScheduleContext = createContext<null | SCI>(null);

export const ScheduleProvider = ({ children }: { children: ReactNode }) => {
  const [schedule, setSchedule] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("slot");
    if (stored) setSchedule(stored);
  }, []);

  useEffect(() => {
    localStorage.setItem("slot", schedule);
  }, [schedule]);

  return (
    <ScheduleContext value={{ schedule, setSchedule }}>
      {children}
    </ScheduleContext>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useScheduleContext = () => {
  const context = useContext(ScheduleContext);
  if (!context) throw new Error("schedule context not provided");
  return context;
};
