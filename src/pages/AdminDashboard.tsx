import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { SEO } from "@/components/SEO";
import { InteractiveLogo } from "@/components/InteractiveLogo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft, RefreshCw, ShieldAlert, Users, MessageSquare, 
  FileText, Image, Presentation, BarChart3, Settings, 
  Mail, TrendingUp, Activity, Database, Bell, Shield,
  Mic, Calendar, Clock
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const ADMIN_EMAIL = "maheerkhan3a@gmail.com";

interface Stats {
  totalMessages: number;
  unreadMessages: number;
  totalUsers: number;
  totalDocuments: number;
  totalImages: number;
  totalPresentations: number;
  totalChats: number;
  totalVoiceovers: number;
  totalSpreadsheets: number;
  todayUsage: {
    documents: number;
    images: number;
    presentations: number;
    chats: number;
  };
}

interface RecentMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  status: string;
  created_at: string;
}

interface RecentUser {
  id: string;
  full_name: string | null;
  email: string | null;
  created_at: string;
}

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [stats, setStats] = useState<Stats>({
    totalMessages: 0,
    unreadMessages: 0,
    totalUsers: 0,
    totalDocuments: 0,
    totalImages: 0,
    totalPresentations: 0,
    totalChats: 0,
    totalVoiceovers: 0,
    totalSpreadsheets: 0,
    todayUsage: { documents: 0, images: 0, presentations: 0, chats: 0 }
  });
  const [recentMessages, setRecentMessages] = useState<RecentMessage[]>([]);
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Admin settings state
  const [settings, setSettings] = useState({
    maintenanceMode: false,
    emailNotifications: true,
    newUserNotifications: true,
    usageLimitAlerts: true,
  });

  const isAdmin = user?.email === ADMIN_EMAIL;

  const fetchStats = async () => {
    setLoading(true);
    try {
      // Fetch message stats
      const { data: messagesData } = await supabase
        .from("contact_messages")
        .select("id, status");
      
      const totalMessages = messagesData?.length || 0;
      const unreadMessages = messagesData?.filter(m => m.status === "unread").length || 0;

      // Fetch user stats
      const { data: usersData } = await supabase
        .from("profiles")
        .select("id");
      
      const totalUsers = usersData?.length || 0;

      // Fetch usage stats
      const { data: usageData } = await supabase
        .from("usage_tracking")
        .select("*");
      
      let totalDocuments = 0, totalImages = 0, totalPresentations = 0, totalChats = 0, totalVoiceovers = 0, totalSpreadsheets = 0;
      let todayDocs = 0, todayImages = 0, todayPresentations = 0, todayChats = 0;
      const today = new Date().toISOString().split('T')[0];
      
      usageData?.forEach(u => {
        totalDocuments += u.documents_generated || 0;
        totalImages += u.images_generated || 0;
        totalPresentations += u.presentations_generated || 0;
        totalChats += u.chat_messages || 0;
        totalVoiceovers += u.voiceovers_generated || 0;
        totalSpreadsheets += u.spreadsheets_generated || 0;
        
        if (u.date === today) {
          todayDocs += u.documents_generated || 0;
          todayImages += u.images_generated || 0;
          todayPresentations += u.presentations_generated || 0;
          todayChats += u.chat_messages || 0;
        }
      });

      // Fetch recent messages
      const { data: recentMsgs } = await supabase
        .from("contact_messages")
        .select("id, name, email, subject, status, created_at")
        .order("created_at", { ascending: false })
        .limit(5);

      // Fetch recent users
      const { data: recentUsrs } = await supabase
        .from("profiles")
        .select("id, full_name, email, created_at")
        .order("created_at", { ascending: false })
        .limit(5);

      setStats({
        totalMessages,
        unreadMessages,
        totalUsers,
        totalDocuments,
        totalImages,
        totalPresentations,
        totalChats,
        totalVoiceovers,
        totalSpreadsheets,
        todayUsage: {
          documents: todayDocs,
          images: todayImages,
          presentations: todayPresentations,
          chats: todayChats
        }
      });
      setRecentMessages((recentMsgs as RecentMessage[]) || []);
      setRecentUsers((recentUsrs as RecentUser[]) || []);
    } catch (error) {
      console.error("Error fetching stats:", error);
      toast.error("Failed to load statistics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchStats();
    }
  }, [isAdmin]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center p-8">
          <ShieldAlert className="h-16 w-16 mx-auto text-destructive mb-4" />
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-6">
            You don't have permission to access this page.
          </p>
          <Link to="/">
            <Button>Go to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const statCards = [
    { 
      title: "Total Messages", 
      value: stats.totalMessages, 
      icon: MessageSquare, 
      color: "text-blue-500",
      badge: stats.unreadMessages > 0 ? `${stats.unreadMessages} unread` : null
    },
    { title: "Total Users", value: stats.totalUsers, icon: Users, color: "text-green-500" },
    { title: "Documents Generated", value: stats.totalDocuments, icon: FileText, color: "text-purple-500" },
    { title: "Images Generated", value: stats.totalImages, icon: Image, color: "text-orange-500" },
    { title: "Presentations", value: stats.totalPresentations, icon: Presentation, color: "text-pink-500" },
    { title: "Chat Messages", value: stats.totalChats, icon: BarChart3, color: "text-cyan-500" },
    { title: "Voiceovers", value: stats.totalVoiceovers, icon: Mic, color: "text-yellow-500" },
    { title: "Spreadsheets", value: stats.totalSpreadsheets, icon: Database, color: "text-emerald-500" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Admin Dashboard | MyDocMaker"
        description="Admin dashboard for managing MyDocMaker"
      />

      {/* Header */}
      <header className="border-b border-border/50 bg-background/95 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/">
              <InteractiveLogo size="md" />
            </Link>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="gap-1">
                <Shield className="h-3 w-3" />
                Admin
              </Badge>
              <Link to="/dashboard">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <Activity className="h-8 w-8 text-primary" />
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground mt-1">
                Overview and management of MyDocMaker
              </p>
            </div>
            <Button onClick={fetchStats} variant="outline" className="gap-2" disabled={loading}>
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
              <TabsTrigger value="overview" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="messages" className="gap-2">
                <Mail className="h-4 w-4" />
                Messages
              </TabsTrigger>
              <TabsTrigger value="users" className="gap-2">
                <Users className="h-4 w-4" />
                Users
              </TabsTrigger>
              <TabsTrigger value="settings" className="gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {statCards.map((stat, index) => (
                  <motion.div
                    key={stat.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <stat.icon className={`h-8 w-8 ${stat.color}`} />
                          {stat.badge && (
                            <Badge variant="destructive" className="text-xs">
                              {stat.badge}
                            </Badge>
                          )}
                        </div>
                        <div className="mt-3">
                          <p className="text-2xl font-bold">{stat.value.toLocaleString()}</p>
                          <p className="text-sm text-muted-foreground">{stat.title}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Today's Usage */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Today's Activity
                  </CardTitle>
                  <CardDescription>Usage statistics for today</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-muted/30 rounded-lg p-4 text-center">
                      <p className="text-3xl font-bold text-primary">{stats.todayUsage.documents}</p>
                      <p className="text-sm text-muted-foreground">Documents</p>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-4 text-center">
                      <p className="text-3xl font-bold text-primary">{stats.todayUsage.images}</p>
                      <p className="text-sm text-muted-foreground">Images</p>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-4 text-center">
                      <p className="text-3xl font-bold text-primary">{stats.todayUsage.presentations}</p>
                      <p className="text-sm text-muted-foreground">Presentations</p>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-4 text-center">
                      <p className="text-3xl font-bold text-primary">{stats.todayUsage.chats}</p>
                      <p className="text-sm text-muted-foreground">Chats</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-3">
                  <Link to="/admin/messages">
                    <Button variant="outline" className="gap-2">
                      <MessageSquare className="h-4 w-4" />
                      View Messages
                      {stats.unreadMessages > 0 && (
                        <Badge variant="destructive" className="ml-1">{stats.unreadMessages}</Badge>
                      )}
                    </Button>
                  </Link>
                  <Link to="/status">
                    <Button variant="outline" className="gap-2">
                      <Activity className="h-4 w-4" />
                      System Status
                    </Button>
                  </Link>
                  <Link to="/feedback">
                    <Button variant="outline" className="gap-2">
                      <Mail className="h-4 w-4" />
                      View Feedback
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Messages Tab */}
            <TabsContent value="messages" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Recent Messages</CardTitle>
                      <CardDescription>Latest contact form submissions</CardDescription>
                    </div>
                    <Link to="/admin/messages">
                      <Button size="sm">View All</Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  {recentMessages.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Mail className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>No messages yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {recentMessages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex items-center justify-between p-4 rounded-lg border ${
                            msg.status === "unread" ? "bg-primary/5 border-primary/30" : "bg-muted/30"
                          }`}
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-medium truncate">{msg.name}</span>
                              {msg.status === "unread" && (
                                <Badge variant="default" className="text-xs">New</Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground truncate">{msg.subject}</p>
                          </div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(msg.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>User Statistics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Users className="h-8 w-8 text-primary" />
                        <div>
                          <p className="font-medium">Total Users</p>
                          <p className="text-sm text-muted-foreground">Registered accounts</p>
                        </div>
                      </div>
                      <p className="text-3xl font-bold">{stats.totalUsers}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Users</CardTitle>
                    <CardDescription>Recently registered users</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {recentUsers.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p>No users yet</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {recentUsers.map((usr) => (
                          <div key={usr.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                            <div>
                              <p className="font-medium">{usr.full_name || "No name"}</p>
                              <p className="text-sm text-muted-foreground">{usr.email || "No email"}</p>
                            </div>
                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(usr.created_at).toLocaleDateString()}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notification Settings
                  </CardTitle>
                  <CardDescription>Manage admin notification preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive email notifications for contact form submissions
                      </p>
                    </div>
                    <Switch
                      checked={settings.emailNotifications}
                      onCheckedChange={(checked) => 
                        setSettings(s => ({ ...s, emailNotifications: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>New User Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified when new users sign up
                      </p>
                    </div>
                    <Switch
                      checked={settings.newUserNotifications}
                      onCheckedChange={(checked) => 
                        setSettings(s => ({ ...s, newUserNotifications: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Usage Limit Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Alert when users approach usage limits
                      </p>
                    </div>
                    <Switch
                      checked={settings.usageLimitAlerts}
                      onCheckedChange={(checked) => 
                        setSettings(s => ({ ...s, usageLimitAlerts: checked }))
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    System Settings
                  </CardTitle>
                  <CardDescription>Manage system-wide settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-destructive">Maintenance Mode</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable maintenance mode to prevent user access
                      </p>
                    </div>
                    <Switch
                      checked={settings.maintenanceMode}
                      onCheckedChange={(checked) => {
                        setSettings(s => ({ ...s, maintenanceMode: checked }));
                        toast.success(checked ? "Maintenance mode enabled" : "Maintenance mode disabled");
                      }}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Admin Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4">
                    <div>
                      <Label className="text-muted-foreground">Admin Email</Label>
                      <Input value={ADMIN_EMAIL} disabled className="mt-1" />
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Last Login</Label>
                      <Input value={new Date().toLocaleString()} disabled className="mt-1" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </div>
  );
}