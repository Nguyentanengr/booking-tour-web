
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MessageCircle, Phone, Mail,  X } from "lucide-react"

export default function ContactButton() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleOpen = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="absolute bottom-16 right-0 bg-white rounded-lg shadow-lg p-4 w-64 border animate-in fade-in slide-in-from-bottom-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Liên hệ với chúng tôi</h3>
            <Button variant="ghost" size="icon" onClick={toggleOpen} className="h-8 w-8">
              <X size={16} />
            </Button>
          </div>
          <div className="space-y-3">
            <a
              href="tel:19001234"
              className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 transition-colors"
            >
              <div className="bg-blue-100 p-2 rounded-full">
                <Phone size={18} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Gọi điện</p>
                <p className="text-xs text-gray-500">1900 1234</p>
              </div>
            </a>
            <a
              href="mailto:info@dulichviet.com"
              className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 transition-colors"
            >
              <div className="bg-blue-100 p-2 rounded-full">
                <Mail size={18} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-xs text-gray-500">info@dulichviet.com</p>
              </div>
            </a>
            <a href="#" className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 transition-colors">
              <div className="bg-blue-100 p-2 rounded-full">
                <MessageCircle size={18} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Chat trực tuyến</p>
                <p className="text-xs text-gray-500">Hỗ trợ 24/7</p>
              </div>
            </a>
          </div>
        </div>
      )}
      <Button onClick={toggleOpen} className="h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg">
        {isOpen ? <X size={24} className="text-white" /> : <MessageCircle size={24} className="text-white" />}
      </Button>
    </div>
  )
}
