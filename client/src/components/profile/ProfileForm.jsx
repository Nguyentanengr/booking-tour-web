import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Upload } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { cn } from "@/lib/utils"; // Assuming you have shadcn's utility for classnames

const ProfileForm = ({
  userData,
  handleProfileChange,
  handleGenderChange,
  handleBirthDateChange,
  handleAvatarUpload,
  handleSaveProfile,
  savingProfile,
  loading // Passed from hook to disable inputs while initial data is loading
}) => {
  return (
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
              disabled={loading || savingProfile}
            />
            <Label htmlFor="avatar-upload" className="w-full">
              <Button variant="outline" className="w-full pointer-events-none"> {/* pointer-events-none to let input click through */}
                <Upload className="mr-2 h-4 w-4" />
                Thay đổi ảnh đại diện
              </Button>
            </Label>
          </div>
        </div>

        {/* Profile Form Fields */}
        <div className="md:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Họ và tên</Label>
              <Input
                id="fullName"
                name="fullName"
                value={userData.fullName}
                onChange={handleProfileChange}
                disabled={loading || savingProfile}
              />
            </div>

            <div className="space-y-2">
              <Label>Giới tính</Label>
              <RadioGroup
                value={userData.gender}
                onValueChange={handleGenderChange}
                className="flex space-x-6"
                disabled={loading || savingProfile}
              >
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
              <Input
                id="email"
                name="email"
                type="email"
                value={userData.email}
                disabled
                className="bg-gray-100"
              />
              <p className="text-xs text-gray-500">Email không thể thay đổi</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={userData.phone}
                onChange={handleProfileChange}
                disabled={loading || savingProfile}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="birthDate">Ngày sinh</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[240px] justify-start text-left font-normal",
                    !userData.birthDate && "text-muted-foreground"
                  )}
                  disabled={loading || savingProfile}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {userData.birthDate ? (
                    format(userData.birthDate, "dd/MM/yyyy", { locale: vi })
                  ) : (
                    <span>Chọn ngày sinh</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={userData.birthDate}
                  onSelect={handleBirthDateChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="pt-4 flex flex-row-reverse">
            <Button
              onClick={handleSaveProfile}
              className="bg-blue-600 hover:bg-blue-800"
              disabled={loading || savingProfile}
            >
              {savingProfile ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;