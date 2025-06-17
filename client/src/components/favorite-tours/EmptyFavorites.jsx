import {Link} from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

export function EmptyFavorites() {
  return (
    <div className="text-center py-12">
      <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
      <h2 className="text-xl font-semibold text-gray-600 mb-2">Chưa có tour yêu thích</h2>
      <p className="text-gray-500 mb-6">Hãy thêm các tour bạn quan tâm vào danh sách yêu thích</p>
      <Link to="/tours"> {/* Sử dụng 'to' prop cho react-router-dom */}
        <Button>Khám phá tour</Button>
      </Link>
    </div>
  );
}