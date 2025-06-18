// components/TourItinerary.jsx
import React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function TourItinerary({ itinerary }) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Lịch trình tour</h2>
      <Accordion type="single" collapsible className="w-full">
        {itinerary.map((day) => (
          <AccordionItem key={day.order} value={`day-${day.order}`}>
            <AccordionTrigger className="text-left">
              <span className="font-semibold">{day.title}</span>
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-gray-700 leading-relaxed">{day.description}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}