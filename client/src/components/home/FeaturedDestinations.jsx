// src/components/ui/FeaturedDestinations.jsx
import React from 'react';
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function FeaturedDestinations({ regions }) {
  return (
    <section className="container py-12 w-[1400px] mx-auto">
      <h2 className="text-2xl font-bold text-center mb-8">Địa điểm nổi bật</h2>
      <Tabs defaultValue="mien-nam" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          {regions.map((region) => (
            <TabsTrigger key={region.id} value={region.id}>
              {region.name}
            </TabsTrigger>
          ))}
        </TabsList>
        {regions.map((region) => (
          <TabsContent key={region.id} value={region.id}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {region.provinces.map((province) => (
                <div key={province.id} className="group relative h-[300px] rounded-lg overflow-hidden">
                  <img
                    src={province.image || "/placeholder.svg"}
                    alt={province.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute inset-0 flex flex-col justify-end p-6">
                    <h3 className="text-xl font-bold text-white mb-2">{province.name}</h3>
                    <div className="h-0 overflow-hidden opacity-0 transition-all duration-300 group-hover:h-auto group-hover:opacity-100 mb-4">
                      <p className="text-white text-sm">{province.description}</p>
                    </div>
                    <Link to={`/tours?destination=${province.id}`}>
                      <Button
                        variant="outline"
                        className="w-fit bg-white/10 backdrop-blur-sm border-white text-white hover:bg-white hover:text-black transition-colors opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
                      >
                        Khám phá
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}