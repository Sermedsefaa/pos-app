"use client"

import { useDil } from "./DilContext"
import Navbar from "./Navbar"

export default function MainLayout({ children }) {
  const { rtl } = useDil()

  return (
    <div dir={rtl ? "rtl" : "ltr"}>
      <Navbar />
      <main>{children}</main>
    </div>
  )
}