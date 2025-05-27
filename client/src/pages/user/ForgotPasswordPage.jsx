import React from "react"
import { useState } from "react"
import {Link , useNavigate  } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"

export default function ForgotPasswordPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [step, setStep] = useState(1)
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleEmailSubmit = (e) => {
    e.preventDefault()
    // Xử lý gửi email
    console.log({ email })
    setStep(2)
  }

  const handleOtpChange = (index , value) => {
    if (value.length <= 1) {
      const newOtp = [...otp]
      newOtp[index] = value
      setOtp(newOtp)

      // Auto focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`)
        if (nextInput) {
          nextInput.focus()
        }
      }
    }
  }

  const handleOtpSubmit = (e) => {
    e.preventDefault()
    // Xử lý xác thực OTP
    console.log({ otp: otp.join("") })
    setStep(3)
  }

  const handleResetPassword = (e) => {
    e.preventDefault()
    // Xử lý đặt lại mật khẩu
    console.log({ newPassword, confirmPassword })
  }

  return (
    <div className="container max-w-md mx-auto py-12">
      <div className="bg-white p-8 rounded-lg shadow-sm border">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => (step > 1 ? setStep(step - 1) : navigate("/dang-nhap"))}
            className="mr-2"
          >
            <ArrowLeft size={18} />
          </Button>
          <h1 className="text-2xl font-bold">
            {step === 1 && "Quên mật khẩu"}
            {step === 2 && "Xác nhận OTP"}
            {step === 3 && "Đặt lại mật khẩu"}
          </h1>
        </div>

        {step === 1 && (
          <>
            <p className="text-gray-600 mb-6">
              Vui lòng nhập địa chỉ email của bạn. Chúng tôi sẽ gửi mã OTP để xác nhận tài khoản.
            </p>
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-blue-600 text-white hover:bg-blue-700">
                Gửi mã xác nhận
              </Button>
            </form>
          </>
        )}

        {step === 2 && (
          <>
            <p className="text-gray-600 mb-6">
              Chúng tôi đã gửi mã OTP đến email {email}. Vui lòng kiểm tra và nhập mã xác nhận.
            </p>
            <form onSubmit={handleOtpSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">Mã xác nhận</Label>
                <div className="flex justify-between gap-2">
                  {otp.map((digit, index) => (
                    <Input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      className="w-12 h-12 text-center text-lg"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      required
                    />
                  ))}
                </div>
              </div>
              <div className="text-center">
                <Button type="button" variant="link" className="text-blue-600">
                  Gửi lại mã
                </Button>
              </div>
              <Button type="submit" className="w-full bg-blue-600 text-white hover:bg-blue-700">
                Xác nhận
              </Button>
            </form>
          </>
        )}

        {step === 3 && (
          <>
            <p className="text-gray-600 mb-6">Vui lòng nhập mật khẩu mới cho tài khoản của bạn.</p>
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-password">Mật khẩu mới</Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Xác nhận mật khẩu</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-blue-600 text-white hover:bg-blue-700">
                Đặt lại mật khẩu
              </Button>
            </form>
          </>
        )}

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Quay lại{" "}
            <Link to="/dang-nhap" className="text-blue-600 hover:underline">
              đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
