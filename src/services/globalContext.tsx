import { createContext, useContext } from "react";
import * as functions from "./functions";

// usecontext  function global hanya untuk function component bukan class component

export const GlobalContext = createContext(functions);

export const useGlobalContext = () => useContext(GlobalContext);