import { prisma } from "@/lib/prisma";
import { jsPDF } from "jspdf";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    // Get all rooms with their items
    const rooms = await prisma.room.findMany({
      include: {
        items: true,
      },
    });

    // Create PDF document
    const doc = new jsPDF();
    let yPos = 20;

    // Header with styling
    doc.setFillColor(52, 144, 220); // Blue header background
    doc.rect(0, 0, 210, 40, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text("Home Inventory Report", 105, 25, { align: "center" });
    yPos = 50;

    let totalValue = 0;

    rooms.forEach((room) => {
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }

      // Room header with background
      doc.setFillColor(240, 240, 240);
      doc.rect(10, yPos - 5, 190, 10, "F");
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(16);
      doc.text(room.name, 15, yPos);

      // Decorative line under room name
      doc.setDrawColor(52, 144, 220);
      doc.setLineWidth(0.5);
      doc.line(15, yPos + 2, 195, yPos + 2);

      yPos += 15;

      // Table headers for items
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text("Item", 20, yPos);
      doc.text("Value", 140, yPos);
      doc.text("Description", 20, yPos + 7);
      yPos += 12;

      room.items.forEach((item) => {
        if (yPos > 250) {
          doc.addPage();
          yPos = 20;
        }

        totalValue += item.value;

        // Item name and value
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);
        doc.text("•", 15, yPos);
        doc.text(item.name, 25, yPos);
        doc.text(`$${item.value.toLocaleString()}`, 140, yPos);
        yPos += 7;

        // Additional details if present
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);

        if (item.brand) {
          doc.text(`Brand: ${item.brand}`, 25, yPos);
          yPos += 5;
        }

        if (item.modelNumber) {
          doc.text(`Model: ${item.modelNumber}`, 25, yPos);
          yPos += 5;
        }

        if (item.serialNumber) {
          doc.text(`Serial: ${item.serialNumber}`, 25, yPos);
          yPos += 5;
        }

        if (item.description) {
          doc.text(`Description: ${item.description}`, 25, yPos);
          yPos += 5;
        }

        // Subtle separator line
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.1);
        doc.line(20, yPos + 3, 190, yPos + 3);

        yPos += 8;
      });

      yPos += 10;
    });

    // Total value section with styling
    doc.setFillColor(245, 245, 245);
    doc.rect(0, yPos - 5, 210, 20, "F");
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(`Total Value: $${totalValue.toLocaleString()}`, 190, yPos + 5, {
      align: "right",
    });

    // Get the PDF as bytes
    const pdfBytes = doc.output("arraybuffer");

    return new NextResponse(pdfBytes, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=home-inventory.pdf",
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}
