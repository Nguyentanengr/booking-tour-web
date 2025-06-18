import React from "react";

const ContactInfoCard = ({ icon: Icon, title, children }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-start gap-4">
        <div className="bg-blue-100 p-3 rounded-full">
          <Icon className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-2">{title}</h3>
          {children} {/* Renders the details passed as children */}
        </div>
      </div>
    </div>
  );
};

export default ContactInfoCard;