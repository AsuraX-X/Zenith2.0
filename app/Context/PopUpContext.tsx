import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

interface PUCI {
  addPopUp: () => void;
  removePopUp: () => void;
}

const PopUpContext = createContext<PUCI | undefined>(undefined);

export const PopUpProvider = ({ children }: { children: ReactNode }) => {
  const [popUpCount, setPopUpCount] = useState(0);

  const addPopUp = () => {
    setPopUpCount(popUpCount + 1);
  };

  const removePopUp = () => {
    setPopUpCount(popUpCount - 1);
  };

  useEffect(() => {
    if (popUpCount > 0) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    console.log(popUpCount);
  }, [popUpCount]);

  return (
    <PopUpContext value={{ addPopUp, removePopUp }}>{children}</PopUpContext>
  );
};

export const usePopUpContext = () => {
  const context = useContext(PopUpContext);
  if (!context) throw new Error("Context not provided");
  return context;
};
