import type { Organizer } from "@/types/event"

interface Props {
  organizer: Organizer
}

export const EventOrganizer: React.FC<Props> = ({ organizer }) => {
  return (
    <div className="bg-white border rounded-xl p-4">
      <h3 className="text-sm font-medium text-gray-900 mb-3">
        Organized By
      </h3>

      <div className="flex items-center gap-3">
        {organizer.logoUrl && (
          <img
            src={organizer.logoUrl}
            alt={organizer.name}
            className="w-10 h-10 rounded-lg object-contain bg-gray-100"
          />
        )}

        <div>
          <p className="text-sm font-medium text-gray-900">
            {organizer.name}
          </p>
          {organizer.subtitle && (
            <p className="text-xs text-gray-500">
              {organizer.subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
