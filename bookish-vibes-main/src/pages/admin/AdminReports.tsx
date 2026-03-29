import { useState } from "react";
import { motion } from "framer-motion";
import { BarChart3, Download, FileText, Loader2 } from "lucide-react";
import { useAdminStats, useTopBooks, useAdminBorrowsChart } from "@/hooks/useLibraryData";

const AdminReports = () => {
  const { data: stats, isLoading: statsLoading } = useAdminStats();
  const { data: topBooks, isLoading: topLoading } = useTopBooks();
  const { data: chartConfig, isLoading: chartLoading } = useAdminBorrowsChart();

  const handleExport = (reportName: string) => {
    // Generate mock CSV content and trigger download
    let csv = "";
    if (reportName === "Inventory") {
      csv = "Report,Value\nTotal Books," + stats?.totalBooks + "\nTotal Members," + stats?.totalMembers;
    } else {
      csv = "Feature,Status\nMock,Enabled";
    }
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportName.toLowerCase().replace(" ", "_")}_report.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const reportsList = [
    { title: "Library Inventory", description: "Export the full list of books and their physical availability.", id: "Inventory" },
    { title: "Member Directory", description: "Export registered member details including emails and membership tiers.", id: "Members" },
    { title: "Financial Fines", description: "Detailed ledger of issued, paid, and outstanding fines.", id: "Fines" },
    { title: "Borrow History", description: "Comprehensive log of all book checkouts and returns over the last year.", id: "Borrows" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="font-heading text-3xl font-black">System Reports</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="brutal-card rounded-lg p-6 space-y-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-6 h-6 text-primary" />
            <h2 className="font-heading text-xl font-bold">Quick Metrics</h2>
          </div>
          
          {(statsLoading || topLoading || chartLoading) ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between items-center brutal-border border-x-0 border-t-0 pb-2">
                <span className="font-bold text-muted-foreground text-sm">Total Books</span>
                <span className="font-heading text-lg font-black">{stats?.totalBooks}</span>
              </div>
              <div className="flex justify-between items-center brutal-border border-x-0 border-t-0 pb-2">
                <span className="font-bold text-muted-foreground text-sm">Active Members</span>
                <span className="font-heading text-lg font-black">{stats?.totalMembers}</span>
              </div>
              <div className="flex justify-between items-center brutal-border border-x-0 border-t-0 pb-2">
                <span className="font-bold text-muted-foreground text-sm">Current Fines</span>
                <span className="font-heading text-lg font-black text-destructive">${stats?.finesRevenue?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center brutal-border border-x-0 border-t-0 pb-2">
                <span className="font-bold text-muted-foreground text-sm">Top Book</span>
                <span className="font-heading text-md font-black italic">{topBooks?.[0]?.title || "N/A"}</span>
              </div>
            </div>
          )}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="brutal-card rounded-lg p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-6 h-6 text-primary" />
            <h2 className="font-heading text-xl font-bold">Export Data</h2>
          </div>
          
          <div className="space-y-3">
            {reportsList.map((report) => (
              <div key={report.id} className="flex justify-between items-center bg-muted/30 p-3 rounded-md brutal-border">
                <div>
                  <h3 className="font-heading font-bold">{report.title}</h3>
                  <p className="text-xs text-muted-foreground">{report.description}</p>
                </div>
                <button 
                  onClick={() => handleExport(report.id)}
                  className="brutal-btn bg-background p-2 rounded-md hover:bg-primary hover:text-primary-foreground transition-colors"
                  title={`Download ${report.id} CSV`}
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminReports;
