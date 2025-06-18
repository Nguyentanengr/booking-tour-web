import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import useDestinations from "@/hooks/useDestinations"; // Import custom hook

export default function DestinationDropdown() {
  const { regions, isLoading, error } = useDestinations();

  if (isLoading) {
    return (
      <Button variant="ghost" className="flex items-center gap-1" disabled>
        Đang tải điểm đến...
      </Button>
    );
  }

  if (error) {
    return (
      <Button variant="ghost" className="flex items-center gap-1" disabled>
        Lỗi tải điểm đến
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-1">
          Điểm đến <ChevronDown size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[500px] p-4">
        <div className="grid grid-cols-3 gap-6">
          {regions.length > 0 ? (
            regions.map((region) => (
              <div key={region.id}>
                <DropdownMenuLabel className="text-blue-600 font-semibold">{region.name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="space-y-1">
                  {region.provinces.map((province) => (
                    <DropdownMenuItem key={province.id} asChild>
                      <Link
                        href={`/tours?destination=${province.id}`}
                        className="block px-2 py-1 text-sm hover:bg-gray-100 rounded"
                      >
                        {province.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center text-gray-500">Không có dữ liệu điểm đến.</div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}