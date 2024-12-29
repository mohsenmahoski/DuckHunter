"use client"

import { useEffect } from "react"

const SetCode = ({ uniqueCode }) => {
  useEffect(() => {
    window.uniqueCode = uniqueCode;
  }, []);  
  return (
    null
  )
}

export default SetCode