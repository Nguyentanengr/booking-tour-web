import React from "react";
import { Textarea } from "@/components/ui/textarea";

export function NotesSection({ notes, setNotes }) {
  return (
    <div className="bg-white rounded-lg border p-6">
      <h2 className="text-xl font-semibold mb-4">Ghi chú</h2>
      <Textarea
        placeholder="Nhập ghi chú đặc biệt (yêu cầu ăn chay, dị ứng thực phẩm, yêu cầu phòng...)"
        rows={4}
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />
    </div>
  );
}