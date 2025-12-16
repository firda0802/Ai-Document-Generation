import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { FileText, Trash2, Download, Search, Presentation, FileSpreadsheet, Mic, BookOpen, FolderOpen } from "lucide-react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/DashboardLayout";
import { fileHistoryDb } from "@/lib/databaseProxy";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface GeneratedFile {
  id: string;
  title: string;
  content: string;
  file_type: string;
  created_at: string;
  updated_at: string;
}

const FILE_TYPE_CONFIG: Record<string, { label: string; icon: any; color: string }> = {
  document: { label: "Document", icon: FileText, color: "text-blue-500" },
  presentation: { label: "Presentation", icon: Presentation, color: "text-orange-500" },
  spreadsheet: { label: "Spreadsheet", icon: FileSpreadsheet, color: "text-green-500" },
  voiceover: { label: "Voiceover", icon: Mic, color: "text-purple-500" },
  story: { label: "Story", icon: BookOpen, color: "text-pink-500" },
  pdf: { label: "PDF", icon: FileText, color: "text-red-500" },
  writer: { label: "AI Writer", icon: FileText, color: "text-indigo-500" },
};

export default function Files() {
  const { user, loading: authLoading } = useAuth();
  const [files, setFiles] = useState<GeneratedFile[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<GeneratedFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchFiles();
    }
  }, [user]);

  useEffect(() => {
    filterFiles();
  }, [searchQuery, activeTab, files]);

  const fetchFiles = async () => {
    try {
      const { data, error } = await fileHistoryDb.getAll({
        order: { column: "created_at", ascending: false }
      });

      if (error) throw error;

      setFiles(data || []);
      setFilteredFiles(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch files",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterFiles = () => {
    let filtered = files;

    if (searchQuery) {
      filtered = filtered.filter(
        (file) =>
          file.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          file.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (activeTab !== "all") {
      filtered = filtered.filter((file) => file.file_type === activeTab);
    }

    setFilteredFiles(filtered);
  };

  const handleDelete = async (fileId: string) => {
    try {
      const { error } = await fileHistoryDb.delete(fileId);

      if (error) throw error;

      setFiles(files.filter((file) => file.id !== fileId));
      toast({
        title: "File deleted",
        description: "The file has been successfully deleted.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete file",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setFileToDelete(null);
    }
  };

  const handleDownload = (file: GeneratedFile) => {
    const element = document.createElement("a");
    const blob = new Blob([file.content], { type: "text/plain" });
    element.href = URL.createObjectURL(blob);
    element.download = `${file.title}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const getFileTypeInfo = (type: string) => {
    return FILE_TYPE_CONFIG[type] || { label: type, icon: FileText, color: "text-muted-foreground" };
  };

  const getFileCountByType = (type: string) => {
    if (type === "all") return files.length;
    return files.filter(f => f.file_type === type).length;
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <DashboardLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-2">
              <FolderOpen className="h-8 w-8 text-primary" />
              My Files
            </h1>
            <p className="text-muted-foreground text-lg">
              Manage all your AI-generated content
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Tabs for File Types */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="flex flex-wrap h-auto gap-2 bg-transparent p-0">
              <TabsTrigger 
                value="all" 
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full px-4"
              >
                All Files ({getFileCountByType("all")})
              </TabsTrigger>
              <TabsTrigger 
                value="document"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full px-4"
              >
                <FileText className="h-4 w-4 mr-2" />
                Documents ({getFileCountByType("document")})
              </TabsTrigger>
              <TabsTrigger 
                value="presentation"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full px-4"
              >
                <Presentation className="h-4 w-4 mr-2" />
                Presentations ({getFileCountByType("presentation")})
              </TabsTrigger>
              <TabsTrigger 
                value="spreadsheet"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full px-4"
              >
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Spreadsheets ({getFileCountByType("spreadsheet")})
              </TabsTrigger>
              <TabsTrigger 
                value="pdf"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full px-4"
              >
                <FileText className="h-4 w-4 mr-2" />
                PDFs ({getFileCountByType("pdf")})
              </TabsTrigger>
              <TabsTrigger 
                value="voiceover"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full px-4"
              >
                <Mic className="h-4 w-4 mr-2" />
                Voiceovers ({getFileCountByType("voiceover")})
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : filteredFiles.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FolderOpen className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-xl font-semibold mb-2">No files found</p>
                <p className="text-muted-foreground text-center">
                  {files.length === 0
                    ? "Start creating content with our AI tools!"
                    : "Try adjusting your search or filter criteria"}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredFiles.map((file, index) => {
                const typeInfo = getFileTypeInfo(file.file_type);
                const IconComponent = typeInfo.icon;
                
                return (
                  <motion.div
                    key={file.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Card className="hover:shadow-lg transition-shadow h-full">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className={`p-2 rounded-lg bg-muted ${typeInfo.color}`}>
                              <IconComponent className="h-5 w-5" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <CardTitle className="text-base truncate">{file.title}</CardTitle>
                              <CardDescription className="text-xs">
                                {typeInfo.label} • {new Date(file.created_at).toLocaleDateString()}
                              </CardDescription>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="bg-muted/50 p-3 rounded-lg mb-4">
                          <p className="text-sm line-clamp-2 text-muted-foreground">
                            {file.content.substring(0, 100)}...
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => handleDownload(file)}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setFileToDelete(file.id);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the file from
              your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => fileToDelete && handleDelete(fileToDelete)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
