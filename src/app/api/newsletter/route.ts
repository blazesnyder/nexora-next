import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 })
    }
    return NextResponse.json({ success: true, message: "Subscribed" })
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
