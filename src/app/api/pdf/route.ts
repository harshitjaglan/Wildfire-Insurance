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

    // Title
    doc.setFontSize(20);
    doc.text("Home Inventory Report", 105, yPos, { align: "center" });
    yPos += 20;

    let totalValue = 0;

    rooms.forEach((room) => {
      // Check if we need a new page
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }

      // Room header
      doc.setFontSize(16);
      doc.text(room.name, 20, yPos);
      yPos += 10;

      // Items in the room
      room.items.forEach((item) => {
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }

        totalValue += item.value;
        doc.setFontSize(12);
        doc.text(`${item.name} - $${item.value}`, 30, yPos);
        yPos += 7;

        if (item.description) {
          doc.setFontSize(10);
          doc.text(`Description: ${item.description}`, 40, yPos);
          yPos += 7;
        }
      });

      yPos += 10;
    });

    // Total value
    doc.setFontSize(14);
    doc.text(`Total Value: $${totalValue.toLocaleString()}`, 190, yPos, {
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
