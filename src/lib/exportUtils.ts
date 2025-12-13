import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Types
interface NutritionData {
  date: string;
  mealType: string;
  foodName: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface ShoppingItem {
  name: string;
  quantity: number;
  unit: string;
  purchased: boolean;
}

interface ShoppingList {
  name: string;
  items: ShoppingItem[];
}

// CSV Export utilities
export const exportToCSV = (data: Record<string, unknown>[], filename: string) => {
  if (data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(","),
    ...data.map((row) =>
      headers
        .map((header) => {
          const value = row[header];
          // Escape quotes and wrap in quotes if contains comma
          const stringValue = String(value ?? "");
          if (stringValue.includes(",") || stringValue.includes('"')) {
            return `"${stringValue.replace(/"/g, '""')}"`;
          }
          return stringValue;
        })
        .join(",")
    ),
  ].join("\n");

  downloadFile(csvContent, `${filename}.csv`, "text/csv;charset=utf-8;");
};

// PDF Export utilities
export const exportNutritionReportPDF = (
  nutritionData: NutritionData[],
  dateRange: { from: string; to: string },
  summary: {
    totalCalories: number;
    avgCalories: number;
    totalProtein: number;
    totalCarbs: number;
    totalFat: number;
  }
) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Title
  doc.setFontSize(20);
  doc.setTextColor(34, 197, 94); // Green color
  doc.text("Báo cáo Dinh dưỡng", pageWidth / 2, 20, { align: "center" });

  // Date range
  doc.setFontSize(12);
  doc.setTextColor(100);
  doc.text(`Từ ${dateRange.from} đến ${dateRange.to}`, pageWidth / 2, 30, {
    align: "center",
  });

  // Summary section
  doc.setFontSize(14);
  doc.setTextColor(0);
  doc.text("Tổng quan", 14, 45);

  const summaryData = [
    ["Tổng calo", `${summary.totalCalories.toLocaleString()} kcal`],
    ["Calo trung bình/ngày", `${summary.avgCalories.toLocaleString()} kcal`],
    ["Tổng protein", `${summary.totalProtein.toLocaleString()} g`],
    ["Tổng carbs", `${summary.totalCarbs.toLocaleString()} g`],
    ["Tổng chất béo", `${summary.totalFat.toLocaleString()} g`],
  ];

  autoTable(doc, {
    startY: 50,
    head: [["Chỉ số", "Giá trị"]],
    body: summaryData,
    theme: "striped",
    headStyles: { fillColor: [34, 197, 94] },
    margin: { left: 14, right: 14 },
  });

  // Detail table
  const lastTableY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY;
  doc.setFontSize(14);
  doc.text("Chi tiết bữa ăn", 14, lastTableY + 15);

  const detailData = nutritionData.map((item) => [
    item.date,
    item.mealType,
    item.foodName,
    `${item.calories}`,
    `${item.protein}g`,
    `${item.carbs}g`,
    `${item.fat}g`,
  ]);

  autoTable(doc, {
    startY: lastTableY + 20,
    head: [["Ngày", "Bữa", "Món ăn", "Calo", "Protein", "Carbs", "Chất béo"]],
    body: detailData,
    theme: "striped",
    headStyles: { fillColor: [34, 197, 94] },
    margin: { left: 14, right: 14 },
    styles: { fontSize: 9 },
  });

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text(
      `ThucdonAI - Trang ${i}/${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: "center" }
    );
  }

  doc.save(`bao-cao-dinh-duong-${dateRange.from}-${dateRange.to}.pdf`);
};

export const exportShoppingListPDF = (shoppingList: ShoppingList) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Title
  doc.setFontSize(20);
  doc.setTextColor(34, 197, 94);
  doc.text("Danh sách Mua sắm", pageWidth / 2, 20, { align: "center" });

  // List name
  doc.setFontSize(14);
  doc.setTextColor(0);
  doc.text(shoppingList.name, pageWidth / 2, 30, { align: "center" });

  // Date
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Ngày tạo: ${new Date().toLocaleDateString("vi-VN")}`, pageWidth / 2, 38, {
    align: "center",
  });

  // Items table
  const itemsData = shoppingList.items.map((item, index) => [
    (index + 1).toString(),
    item.name,
    `${item.quantity} ${item.unit}`,
    item.purchased ? "✓" : "☐",
  ]);

  autoTable(doc, {
    startY: 45,
    head: [["#", "Nguyên liệu", "Số lượng", "Đã mua"]],
    body: itemsData,
    theme: "striped",
    headStyles: { fillColor: [34, 197, 94] },
    margin: { left: 14, right: 14 },
    columnStyles: {
      0: { cellWidth: 15 },
      3: { cellWidth: 25, halign: "center" },
    },
  });

  // Summary
  const lastY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY;
  const purchasedCount = shoppingList.items.filter((i) => i.purchased).length;
  doc.setFontSize(12);
  doc.setTextColor(0);
  doc.text(
    `Đã mua: ${purchasedCount}/${shoppingList.items.length} món`,
    14,
    lastY + 15
  );

  // Footer
  doc.setFontSize(10);
  doc.setTextColor(150);
  doc.text(
    "ThucdonAI - Danh sách mua sắm",
    pageWidth / 2,
    doc.internal.pageSize.getHeight() - 10,
    { align: "center" }
  );

  doc.save(`danh-sach-mua-sam-${shoppingList.name.replace(/\s+/g, "-")}.pdf`);
};

export const exportShoppingListCSV = (shoppingList: ShoppingList) => {
  const data = shoppingList.items.map((item, index) => ({
    STT: index + 1,
    "Nguyên liệu": item.name,
    "Số lượng": item.quantity,
    "Đơn vị": item.unit,
    "Đã mua": item.purchased ? "Có" : "Chưa",
  }));

  exportToCSV(data, `danh-sach-mua-sam-${shoppingList.name.replace(/\s+/g, "-")}`);
};

export const exportNutritionCSV = (
  nutritionData: NutritionData[],
  dateRange: { from: string; to: string }
) => {
  const data = nutritionData.map((item) => ({
    Ngày: item.date,
    "Bữa ăn": item.mealType,
    "Món ăn": item.foodName,
    "Calo (kcal)": item.calories,
    "Protein (g)": item.protein,
    "Carbs (g)": item.carbs,
    "Chất béo (g)": item.fat,
  }));

  exportToCSV(data, `bao-cao-dinh-duong-${dateRange.from}-${dateRange.to}`);
};

// Helper function
const downloadFile = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob(["\ufeff" + content], { type: mimeType }); // BOM for UTF-8
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
