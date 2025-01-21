import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { Item } from "@/types/item";

// Add type augmentation at top of file
declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => void;
  }
}

// Add helper function at top of file
const groupByCategory = (items: Item[]) => {
  return items.reduce((groups, item) => {
    const category = item.category;
    groups[category] = groups[category] || [];
    groups[category].push(item);
    return groups;
  }, {} as Record<string, Item[]>);
};

export const generateInventoryPDF = (items: Item[]) => {
  const doc = new jsPDF();

  // Add header
  doc.setFontSize(20);
  doc.text("Home Inventory Report", 20, 20);

  // Group items by category
  const itemsByCategory = groupByCategory(items);

  let yPosition = 40;

  // Generate tables for each category
  Object.entries(itemsByCategory).forEach(([category, items]) => {
    doc.setFontSize(16);
    doc.text(category, 20, yPosition);

    const tableData = items.map((item) => [
      item.name,
      item.brand || "-",
      item.model || "-",
      item.serialNumber || "-",
      item.purchasePrice ? `$${item.purchasePrice}` : "-",
      item.detailedDescription || "-",
    ]);

    doc.autoTable({
      startY: yPosition + 10,
      head: [["Item", "Brand", "Model", "Serial #", "Price", "Description"]],
      body: tableData,
    });

    yPosition = (doc as any).lastAutoTable.finalY + 20;
  });

  // Generate and download PDF
  doc.save("home-inventory.pdf");
};
