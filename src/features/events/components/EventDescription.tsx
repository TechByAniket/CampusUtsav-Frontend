interface Props {
  description: string
}

export const EventDescription: React.FC<Props> = ({ description }) => {
  return (
    <div className="bg-white border rounded-2xl p-6 h-[420px] flex flex-col">
      <h2 className="text-lg font-semibold text-gray-900 mb-3">
        About Event
      </h2>

      <div className="overflow-y-auto pr-2 text-sm text-gray-600 leading-relaxed whitespace-pre-line scrollbar-thin">
        {description}
      </div>
    </div>
  )
}
