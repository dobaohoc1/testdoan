import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, FileText, Table, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ExportButtonProps {
  onExportPDF?: () => Promise<void> | void;
  onExportCSV?: () => Promise<void> | void;
  disabled?: boolean;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
}

export const ExportButton = ({
  onExportPDF,
  onExportCSV,
  disabled = false,
  variant = "outline",
  size = "default",
}: ExportButtonProps) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (type: "pdf" | "csv") => {
    setIsExporting(true);
    try {
      if (type === "pdf" && onExportPDF) {
        await onExportPDF();
        toast.success("Đã xuất file PDF thành công!");
      } else if (type === "csv" && onExportCSV) {
        await onExportCSV();
        toast.success("Đã xuất file CSV thành công!");
      }
    } catch (error) {
      console.error("Export failed:", error);
      toast.error("Xuất file thất bại. Vui lòng thử lại.");
    } finally {
      setIsExporting(false);
    }
  };

  const hasMultipleOptions = onExportPDF && onExportCSV;

  if (!hasMultipleOptions) {
    // Single button if only one option
    const handleClick = () => {
      if (onExportPDF) handleExport("pdf");
      else if (onExportCSV) handleExport("csv");
    };

    return (
      <Button
        variant={variant}
        size={size}
        onClick={handleClick}
        disabled={disabled || isExporting}
      >
        {isExporting ? (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <Download className="h-4 w-4 mr-2" />
        )}
        Xuất {onExportPDF ? "PDF" : "CSV"}
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} disabled={disabled || isExporting}>
          {isExporting ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Download className="h-4 w-4 mr-2" />
          )}
          Xuất báo cáo
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleExport("pdf")}>
          <FileText className="h-4 w-4 mr-2" />
          Xuất PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("csv")}>
          <Table className="h-4 w-4 mr-2" />
          Xuất CSV
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
