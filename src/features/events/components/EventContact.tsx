import type { ContactInfo } from "@/types/event"
import { Phone, Mail } from "lucide-react"

interface Props {
  contact: ContactInfo
}

export const EventContact: React.FC<Props> = ({ contact }) => {
  if (!contact.phone && !contact.email) return null

  return (
    <div className="bg-white border rounded-xl p-4">
      <h3 className="text-sm font-medium text-gray-900 mb-3">
        Contact
      </h3>

      <div className="space-y-2 text-sm text-gray-600">
        {contact.phone && (
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-gray-400" />
            {contact.phone}
          </div>
        )}

        {contact.email && (
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-gray-400" />
            {contact.email}
          </div>
        )}
      </div>
    </div>
  )
}
