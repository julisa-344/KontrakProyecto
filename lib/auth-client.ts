"use client"

import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
  baseURL: typeof window !== "undefined" ? window.location.origin : undefined,
  pluginOptions: {
    debug: process.env.NODE_ENV === "development"
  }
})
