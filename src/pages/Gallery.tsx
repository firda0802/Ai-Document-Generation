import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { SEO } from "@/components/SEO";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { 
  ImageIcon, 
  FileText, 
  Presentation, 
  Table,
  Video,
  Trash2,
  Download,
  Loader2,
  FolderOpen,
  Eye
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface MediaItem {
  id: string;
  title: string;
  description: string | null;
  media_type: string;
  file_url: string;
  thumbnail_url: string | null;
  prompt: string | null;
  style: string | null;
  created_at: string;
}

const mediaTypeIcons: Record<string, any> = {
  image: ImageIcon,
  video: Video,
  document: FileText,
  presentation: Presentation,
  spreadsheet: Table,
  pdf: FileText,
};

const mediaTypeColors: Record<string, string> = {
  image: "from-pink-500 to-purple-600",
  video: "from-red-500 to-orange-500",
  document: "from-blue-500 to-indigo-600",
  presentation: "from-orange-500 to-red-500",
  spreadsheet: "from-green-500 to-emerald-600",
  pdf: "from-red-500 to-pink-500",
};

export default function Gallery() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchGalleryItems();
    }
  }, [user, activeTab]);

  const fetchGalleryItems = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      let query = supabase
        .from('generated_media')
        .select('*')
        .eq('user_id', user.uid)
        .order('created_at', { ascending: false });

      if (activeTab !== 'all') {
        query = query.eq('media_type', activeTab);
      }

      const { data, error } = await query;

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching gallery:', error);
      toast({
        title: "Error",
        description: "Failed to load gallery items.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('generated_media')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setItems(items.filter(item => item.id !== id));
      toast({
        title: "Deleted",
        description: "Item removed from gallery.",
      });
    } catch (error) {
      console.error('Error deleting item:', error);
      toast({
        title: "Error",
        description: "Failed to delete item.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = async (item: MediaItem) => {
    try {
      const link = document.createElement('a');
      link.href = item.file_url;
      link.download = item.title;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download file.",
        variant: "destructive",
      });
    }
  };

  const tabs = [
    { value: "all", label: "All", icon: FolderOpen },
    { value: "image", label: "Images", icon: ImageIcon },
    { value: "video", label: "Videos", icon: Video },
    { value: "document", label: "Documents", icon: FileText },
    { value: "presentation", label: "Presentations", icon: Presentation },
    { value: "spreadsheet", label: "Spreadsheets", icon: Table },
  ];

  return (
    <DashboardLayout>
      <SEO
        title="Media Gallery - Your Generated Content | mydocmaker"
        description="View and manage all your AI-generated images, documents, presentations, and more."
        keywords="media gallery, generated content, ai images, ai documents"
        canonical="/gallery"
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Media Gallery</h1>
          <p className="text-muted-foreground text-lg">
            View and manage all your AI-generated content
          </p>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 flex-wrap h-auto gap-1">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} className="flex items-center gap-2">
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : items.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <FolderOpen className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No items yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start creating content with our AI tools to see them here.
                  </p>
                  <Button asChild>
                    <a href="/tools">Explore Tools</a>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <AnimatePresence>
                  {items.map((item, index) => {
                    const Icon = mediaTypeIcons[item.media_type] || FileText;
                    const colorClass = mediaTypeColors[item.media_type] || "from-gray-500 to-gray-600";
                    
                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Card className="group overflow-hidden hover:shadow-lg transition-shadow">
                          <div 
                            className="relative aspect-square cursor-pointer"
                            onClick={() => setSelectedItem(item)}
                          >
                            {item.media_type === 'image' && item.file_url ? (
                              <img
                                src={item.file_url}
                                alt={item.title}
                                className="w-full h-full object-cover"
                              />
                            ) : item.thumbnail_url ? (
                              <img
                                src={item.thumbnail_url}
                                alt={item.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className={`w-full h-full bg-gradient-to-br ${colorClass} flex items-center justify-center`}>
                                <Icon className="w-12 h-12 text-white/80" />
                              </div>
                            )}
                            
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                              <Eye className="w-8 h-8 text-white" />
                            </div>
                          </div>
                          
                          <CardContent className="p-3">
                            <h3 className="font-medium text-sm truncate mb-1">{item.title}</h3>
                            <p className="text-xs text-muted-foreground mb-2">
                              {format(new Date(item.created_at), 'MMM d, yyyy')}
                            </p>
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 px-2 flex-1"
                                onClick={() => handleDownload(item)}
                              >
                                <Download className="w-3 h-3" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-7 px-2 text-destructive hover:text-destructive"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete item?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDelete(item.id)}>
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Preview Dialog */}
        <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>{selectedItem?.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {selectedItem?.media_type === 'image' && selectedItem.file_url && (
                <img
                  src={selectedItem.file_url}
                  alt={selectedItem.title}
                  className="w-full rounded-lg"
                />
              )}
              {selectedItem?.media_type === 'video' && selectedItem.file_url && (
                <video
                  src={selectedItem.file_url}
                  controls
                  className="w-full rounded-lg"
                />
              )}
              {selectedItem?.prompt && (
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm font-medium mb-1">Prompt:</p>
                  <p className="text-sm text-muted-foreground">{selectedItem.prompt}</p>
                </div>
              )}
              <div className="flex gap-2">
                <Button onClick={() => selectedItem && handleDownload(selectedItem)} className="flex-1">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
