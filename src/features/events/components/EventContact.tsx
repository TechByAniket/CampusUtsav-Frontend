import { Phone, Mail, Headset, User } from "lucide-react"

interface Contact {
  name: string;
  phone: string;
  email: string;
}

interface Props {
  contactDetails: Contact[];
}

export const EventContact: React.FC<Props> = ({ contactDetails }) => {
  if (!contactDetails || contactDetails.length === 0) return null;

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header Section - Better padding */}
      <div className="px-6 py-4 border-b border-gray-50 bg-white flex items-center gap-3">
        <div className="text-indigo-600 bg-indigo-50 p-2 rounded-xl border border-indigo-100 shadow-sm">
          <Headset className="w-5 h-5" />
        </div>
        <h2 className="text-sm font-black text-gray-800 uppercase tracking-widest">
          Contact Organizers
        </h2>
      </div>

      {/* Content Area */}
      <div className="p-5 bg-white space-y-4">
        {contactDetails.map((contact, index) => (
          <div key={index} className="bg-gray-50/50 rounded-2xl border border-gray-100 p-4 transition-all hover:bg-white hover:border-indigo-100 duration-300">
            
            {/* Minimalist Name Tag - Bumped to text-xs */}
            <div className="flex items-center gap-2 mb-3 pb-2.5 border-b border-gray-100">
              <User className="w-4 h-4 text-indigo-500" />
              <span className="text-xs font-black text-gray-700 uppercase tracking-wide">
                {contact.name}
              </span>
            </div>

            {/* Vertical Info Stack - Improved Spacing */}
            <div className="space-y-3">
              {contact.phone && (
                <a href={`tel:${contact.phone}`} className="flex items-center gap-4 group">
                  <div className="text-indigo-600 bg-white p-2 rounded-xl shadow-sm border border-gray-50 group-hover:bg-indigo-50 group-hover:scale-105 transition-all">
                    <Phone className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 leading-none mb-1">
                      Phone
                    </span>
                    <span className="text-sm font-bold text-gray-800 tracking-tight">
                      {contact.phone}
                    </span>
                  </div>
                </a>
              )}

              {contact.email && (
                <a href={`mailto:${contact.email}`} className="flex items-center gap-4 group">
                  <div className="text-indigo-600 bg-white p-2 rounded-xl shadow-sm border border-gray-50 group-hover:bg-indigo-50 group-hover:scale-105 transition-all">
                    <Mail className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 leading-none mb-1">
                      Email
                    </span>
                    <span className="text-sm font-bold text-gray-800 truncate tracking-tight">
                      {contact.email}
                    </span>
                  </div>
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};