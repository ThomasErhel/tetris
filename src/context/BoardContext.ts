import { createContext } from "react";

interface BoardContextType {
  // Ajoutez ici les propriétés et les types nécessaires pour votre contexte
}

const BoardContext = createContext<BoardContextType | undefined>(undefined);

export default BoardContext;
