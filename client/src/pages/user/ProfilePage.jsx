import React from "react";
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Upload } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { format } from "date-fns"
import { vi } from "date-fns/locale"

export default function ProfilePage() {
  const [birthDate, setBirthDate] = useState(new Date(1990, 0, 1))
  const [userData, setUserData] = useState({
    fullName: "Nguyễn Văn A",
    gender: "male",
    email: "nguyenvana@gmail.com",
    phone: "0912345678",
    avatarUrl: "/placeholder.svg?height=160&width=160",
  })

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [showPasswordModal, setShowPasswordModal] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setUserData({
      ...userData,
      [name]: value,
    })
  }

  const handleRadioChange = (value) => {
    setUserData({
      ...userData,
      gender: value,
    })
  }

  const handleSaveProfile = () => {
    console.log("Saving profile:", { ...userData, dateOfBirth: birthDate })
    alert("Thông tin đã được cập nhật thành công!")
  }

  const handlePasswordChange = (e) => {
    e.preventDefault()
    console.log("Changing password:", passwordForm)
    setShowPasswordModal(false)
    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" })
    alert("Mật khẩu đã được thay đổi thành công!")
  }

  const handleAvatarUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setUserData({
          ...userData,
          avatarUrl: e.target?.result ,
        })
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="container py-8 w-[1400px] mx-auto">
      <h1 className="text-2xl font-bold mb-6">Thông tin cá nhân</h1>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Avatar Section */}
          <div className="flex flex-col items-center">
            <Avatar className="w-40 h-40 mb-4 border-4 border-gray-200">
              <AvatarImage
                src={userData.avatarUrl || "/placeholder.svg"}
                alt="Avatar"
                className="object-cover"
              />
              <AvatarFallback>AVT</AvatarFallback>
            </Avatar>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                id="avatar-upload"
              />
              <Button variant="outline" className="w-full">
                <Upload className="mr-2 h-4 w-4" />
                Thay đổi ảnh đại diện
              </Button>
            </div>
          </div>

          {/* Profile Form */}
          <div className="md:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Họ và tên</Label>
                <Input id="fullName" name="fullName" value={userData.fullName} onChange={handleChange} />
              </div>

                <div className="space-y-2">
                <Label>Giới tính</Label>
                <RadioGroup value={userData.gender} onValueChange={handleRadioChange} className="flex space-x-6">
                        <div className="flex items-center space-x-2">
                        <RadioGroupItem value="male" id="profile-male" />
                        <Label htmlFor="profile-male">Nam</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                        <RadioGroupItem value="female" id="profile-female" />
                        <Label htmlFor="profile-female">Nữ</Label>
                        </div>
                </RadioGroup>
                </div>
            </div>

        
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" value={userData.email} disabled className="bg-gray-100" />
                <p className="text-xs text-gray-500">Email không thể thay đổi</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input id="phone" name="phone" type="tel" value={userData.phone} onChange={handleChange} />
              </div>
            </div>

            <div className="pt-4 flex flex-row-reverse">
              <Button onClick={handleSaveProfile} className="bg-blue-600 hover:bg-blue-800">Lưu thay đổi</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
