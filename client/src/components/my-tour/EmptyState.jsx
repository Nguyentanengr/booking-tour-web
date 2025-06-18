import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const EmptyState = ({ icon: Icon, title, description, buttonText, buttonLink }) => {
  return (
    <div className="text-center py-12">
      {Icon && <Icon className="h-16 w-16 text-gray-300 mx-auto mb-4" />}
      <h2 className="text-xl font-semibold text-gray-600 mb-2">{title}</h2>
      <p className="text-gray-500 mb-6">{description}</p>
      {buttonText && buttonLink && (
        <Link to={buttonLink}>
          <Button>{buttonText}</Button>
        </Link>
      )}
    </div>
  );
};

export default EmptyState;