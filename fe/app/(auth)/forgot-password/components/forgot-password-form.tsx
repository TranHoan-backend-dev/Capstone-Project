"use client"

import type React from "react"

import { useState } from "react"
import { Input, Button } from "@heroui/react"

interface ForgotPasswordFormProps {
  onSuccess: (email: string) => void
}

export function ForgotPasswordForm({ onSuccess }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // Simulate API call to send OTP
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Validation
      if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        setError("Vui lòng nhập email hợp lệ")
        setIsLoading(false)
        return
      }

      // Here you would call your API to send OTP
      console.log("Sending OTP to:", email)
      onSuccess(email)
    } catch (err) {
      setError("Có lỗi xảy ra. Vui lòng thử lại.")
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-slate-900">Quên mật khẩu?</h1>
        <p className="text-sm text-slate-600">Nhập email của bạn và chúng tôi sẽ gửi mã xác nhận OTP</p>
      </div>

      <div className="space-y-2">
        <div className="relative">
          <Input
            id="email"
            type="email"
            label="Địa chỉ Email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setError("")
            }}
            disabled={isLoading}
            required
          />
        </div>
        {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
      </div>

      <Button
        type="submit"
        disabled={isLoading || !email}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-all disabled:opacity-50"
      >
        {isLoading ? (
          <>
            Đang gửi...
          </>
        ) : (
          "Gửi mã OTP"
        )}
      </Button>
    </form>
  )
}
