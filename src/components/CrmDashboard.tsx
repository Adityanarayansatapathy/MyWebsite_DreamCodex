import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { 
  LogOut, 
  User, 
  Building2, 
  Mail, 
  Phone, 
  Calendar,
  TrendingUp,
  Users,
  Target,
  DollarSign,
  BarChart3,
  PieChart,
  Activity,
  Settings,
  Crown,
  Rocket,
  CheckCircle,
  ArrowUp,
  Clock,
  MessageSquare,
  FileText,
  Plus,
  Search,
  Bell,
  Menu,
  Home,
  UserPlus,
  FileSpreadsheet,
  FormInput,
  GitBranch,
  Zap,
  Shield,
  Star,
  Globe,
  Layers,
  Filter,
  Download,
  Upload,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../services/api';
import { DashboardStats, User as UserType } from '../types';
import { toast } from 'sonner@2.0.3';
import { motion, AnimatePresence } from 'motion/react';

// Import new components
import { LeadManagement } from './crm/LeadManagement';
import { FormBuilder } from './crm/FormBuilder';
import { DashboardOverview } from './crm/DashboardOverview';
import { CrmSettings } from './crm/CrmSettings';
import { CrmReports } from './crm/CrmReports';

type ActiveModule = 'dashboard' | 'leads' | 'forms' | 'reports' | 'settings' | 'profile';

const sidebarItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home, color: 'text-blue-600' },
  { id: 'leads', label: 'Lead Management', icon: UserPlus, color: 'text-green-600' },
  { id: 'forms', label: 'Form Builder', icon: FormInput, color: 'text-purple-600' },
  { id: 'reports', label: 'Reports', icon: BarChart3, color: 'text-orange-600' },
  { id: 'settings', label: 'Settings', icon: Settings, color: 'text-gray-600' },
  { id: 'profile', label: 'Profile', icon: User, color: 'text-indigo-600' }
];

export const CrmDashboard: React.FC = () => {
  const { user, logout, token } = useAuth();
  const [activeModule, setActiveModule] = useState<ActiveModule>('dashboard');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<UserType | null>(user);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashboardStats, userProfile] = await Promise.all([
          authApi.getDashboardStats(token),
          authApi.getCurrentUser(token)
        ]);
        
        setStats(dashboardStats);
        if (userProfile) {
          setCurrentUser(userProfile);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (!currentUser) return null;

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Rocket className="w-6 h-6 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-400 rounded-full flex items-center justify-center">
              <Crown className="w-2 h-2 text-white" />
            </div>
          </div>
          {!sidebarCollapsed && (
            <div>
              <h1 className="font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Business CRM
              </h1>
              <p className="text-xs text-gray-600">Enterprise Edition</p>
            </div>
          )}
        </div>
      </div>

      {/* Search */}
      {!sidebarCollapsed && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search CRM..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-50 border-gray-200 focus:bg-white"
            />
          </div>
        </div>
      )}

      {/* Navigation */}
      <ScrollArea className="flex-1 p-4">
        <nav className="space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeModule === item.id;
            
            return (
              <motion.button
                key={item.id}
                onClick={() => setActiveModule(item.id as ActiveModule)}
                className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 group ${
                  isActive 
                    ? 'bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 shadow-sm' 
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : item.color}`} />
                {!sidebarCollapsed && (
                  <span className={`font-medium ${isActive ? 'text-blue-900' : 'text-gray-700 dark:text-gray-300'}`}>
                    {item.label}
                  </span>
                )}
                {isActive && !sidebarCollapsed && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="ml-auto w-2 h-2 bg-blue-600 rounded-full"
                  />
                )}
              </motion.button>
            );
          })}
        </nav>
      </ScrollArea>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <Avatar className="ring-2 ring-blue-500/20">
            {currentUser.profileImageUrl ? (
              <AvatarImage src={currentUser.profileImageUrl} alt={currentUser.name} />
            ) : (
              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                {getInitials(currentUser.name)}
              </AvatarFallback>
            )}
          </Avatar>
          {!sidebarCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {currentUser.name}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                {currentUser.businessCategory}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderMainContent = () => {
    switch (activeModule) {
      case 'dashboard':
        return <DashboardOverview user={currentUser} stats={stats} />;
      case 'leads':
        return <LeadManagement />;
      case 'forms':
        return <FormBuilder />;
      case 'reports':
        return <CrmReports />;
      case 'settings':
        return <CrmSettings />;
      case 'profile':
        return <ProfileContent />;
      default:
        return <DashboardOverview user={currentUser} stats={stats} />;
    }
  };

  const ProfileContent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile Settings</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your account information and preferences</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <Avatar className="w-24 h-24 ring-4 ring-blue-500/20">
                  {currentUser.profileImageUrl ? (
                    <AvatarImage src={currentUser.profileImageUrl} alt={currentUser.name} />
                  ) : (
                    <AvatarFallback className="text-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                      {getInitials(currentUser.name)}
                    </AvatarFallback>
                  )}
                </Avatar>
                <Button size="sm" className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0">
                  <Edit className="w-3 h-3" />
                </Button>
              </div>
              <div>
                <h3 className="text-xl font-semibold">{currentUser.name}</h3>
                <p className="text-gray-600">{currentUser.email}</p>
                <Badge className="mt-2">{currentUser.businessCategory}</Badge>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-sm text-gray-600">{currentUser.email}</p>
                    </div>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium">Phone</p>
                      <p className="text-sm text-gray-600">{currentUser.phoneNumber}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <div className="flex items-center space-x-3">
                    <Building2 className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="text-sm font-medium">Business</p>
                      <p className="text-sm text-gray-600">{currentUser.businessCategory}</p>
                    </div>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-orange-600" />
                    <div>
                      <p className="text-sm font-medium">Member Since</p>
                      <p className="text-sm text-gray-600">
                        {new Date(currentUser.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <FileText className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <MessageSquare className="w-4 h-4 mr-2" />
              Contact Support
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Settings className="w-4 h-4 mr-2" />
              Account Settings
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Star className="w-4 h-4 mr-2" />
              Upgrade Plan
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading CRM Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Desktop Sidebar */}
      <motion.aside
        animate={{
          width: sidebarCollapsed ? 80 : 280
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="hidden lg:flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-sm"
      >
        <SidebarContent />
      </motion.aside>

      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden fixed top-4 left-4 z-50">
            <Menu className="w-5 h-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-80">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="hidden lg:flex"
              >
                <Menu className="w-5 h-5" />
              </Button>
              <div className="ml-12 lg:ml-0">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  {sidebarItems.find(item => item.id === activeModule)?.label || 'Dashboard'}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Welcome back, {currentUser.name}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                Live
              </Badge>
              <Button variant="ghost" size="icon">
                <Bell className="w-5 h-5" />
              </Button>
              <Button variant="outline" onClick={logout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeModule}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderMainContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};