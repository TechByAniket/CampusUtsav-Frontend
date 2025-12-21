interface Props {
  name: string
  meta?: string
}

export const EventCollege: React.FC<Props> = ({ name, meta }) => {
  return (
    <div className="bg-white border rounded-xl p-4">
      <h3 className="text-sm font-medium text-gray-900 mb-3">
        College
      </h3>

      <p className="text-sm font-medium text-gray-900">
        {name}
      </p>

      {meta && (
        <p className="text-xs text-gray-600 mt-1">
          {meta}
        </p>
      )}
    </div>
  )
}
