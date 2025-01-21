import { Item } from "@/types/item";
import { generateInventoryPDF } from "@/lib/pdfGenerator";

export const DownloadInventoryButton = ({ items }: { items: Item[] }) => {
  const handleDownload = () => {
    generateInventoryPDF(items);
  };

  return (
    <button
      onClick={handleDownload}
      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
    >
      Download Inventory PDF
    </button>
  );
};
