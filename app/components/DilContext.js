"use client"

import { createContext, useContext, useState } from "react"
import tr from "../locales/tr"
import ar from "../locales/ar"

const DilContext = createContext()

export function DilProvider({ children }) {
  const [dil, setDil] = useState("tr")
  const t = dil === "tr" ? tr : ar
  const rtl = dil === "ar"

  return (
    <DilContext.Provider value={{ dil, setDil, t, rtl }}>
      {children}
    </DilContext.Provider>
  )
}

export function useDil() {
  return useContext(DilContext)
}