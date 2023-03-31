import { createContext } from "react";

interface BoardContextType {}

const BoardContext = createContext<BoardContextType | undefined>(undefined);

export default BoardContext;
