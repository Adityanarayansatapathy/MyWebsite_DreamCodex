import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Button } from '../ui/button';
import {
  TrendingUp,
  Users,
  Target,
  DollarSign,
  ArrowUp,
  ArrowDown,
  Activity,
  Clock,
  Zap,
  Plus,
  Filter,
  Download,
  Eye,
  MessageSquare,
  Phone,
  Mail,
  Calendar,
  MoreHorizontal,
  Star,
  CheckCircle
} from 'lucide-react';
import { motion } from 'motion/react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DashboardStats, User as UserType } from '../../types';

interface DashboardOverviewProps {
  user: UserType;
  stats: DashboardStats | null;
}

// Mock data for charts
const revenueData = [
  { month: 'Jan', revenue: 4200, leads: 24, deals: 8 },
  { month: 'Feb', revenue: 5100, leads: 31, deals: 12 },
  { month: 'Mar', revenue: 4800, leads: 28, deals: 10 },
  { month: 'Apr', revenue: 6200, leads: 42, deals: 15 },
  { month: 'May', revenue: 7100, leads: 38, deals: 18 },
  { month: 'Jun', revenue: 8300, leads: 45, deals: 22 }
];

const leadSourceData = [
  { name: 'Website', value: 35, color: '#3B82F6' },
  { name: 'Social Media', value: 25, color: '#10B981' },
  { name: 'Email', value: 20, color: '#F59E0B' },
  { name: 'Referral', value: 15, color: '#8B5CF6' },
  { name: 'Others', value: 5, color: '#EF4444' }
];

const conversionData = [
  { stage: 'Leads', value: 245, color: '#3B82F6' },
  { stage: 'Qualified', value: 180, color: '#10B981' },
  { stage: 'Proposals', value: 85, color: '#F59E0B' },
  { stage: 'Negotiations', value: 45, color: '#8B5CF6' },
  { stage: 'Closed Won', value: 28, color: '#10B981' }
];

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ user, stats }) => {
  const [timeRange, setTimeRange] = useState('30d');
  const [isLoading, setIsLoading] = useState(false);

  // Real-time mock data
  const realtimeData = {
    totalLeads: 245,
    activeDeals: 12,
    revenue: 45231,
    conversionRate: 24.8,
    todayLeads: 8,
    weeklyGrowth: 12.5,
    avgDealSize: 3850,
    pipelineValue: 125000,
    recentActivities: [
      {
        id: 1,
        type: 'lead',
        title: 'New lead: Sarah Johnson',
        description: 'Technology startup interested in our services',
        time: '2 minutes ago',
        avatar: null,
        priority: 'high'
      },
      {
        id: 2,
        type: 'deal',
        title: 'Deal closed: ABC Corp',
        description: 'Contract worth $15,000 signed',
        time: '1 hour ago',
        avatar: null,
        priority: 'success'
      },
      {
        id: 3,
        type: 'meeting',
        title: 'Meeting scheduled',
        description: 'Follow-up call with potential client',
        time: '3 hours ago',
        avatar: null,
        priority: 'medium'
      },
      {
        id: 4,
        type: 'email',
        title: 'Email sent to 25 prospects',
        description: 'Monthly newsletter campaign completed',
        time: '5 hours ago',
        avatar: null,
        priority: 'low'
      }
    ],
    upcomingTasks: [
      { id: 1, title: 'Call John Doe', dueDate: 'Today 2:00 PM', priority: 'high' },
      { id: 2, title: 'Send proposal to XYZ Inc', dueDate: 'Tomorrow 10:00 AM', priority: 'medium' },
      { id: 3, title: 'Follow up with warm leads', dueDate: 'Wed 9:00 AM', priority: 'low' }
    ]
  };

  const StatCard = ({ title, value, change, icon: Icon, color, bgColor, textColor }) => (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={`${bgColor} border-0 shadow-lg hover:shadow-xl transition-all duration-300`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className={`text-sm font-medium ${textColor}`}>{title}</CardTitle>
          <div className={`p-2 ${color} rounded-lg`}>
            <Icon className="h-4 w-4 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <div className={`text-3xl font-bold ${textColor}`}>{value}</div>
          <div className="flex items-center mt-1">
            {change > 0 ? (
              <ArrowUp className="w-3 h-3 text-green-600 mr-1" />
            ) : (
              <ArrowDown className="w-3 h-3 text-red-600 mr-1" />
            )}
            <p className={`text-xs ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {Math.abs(change)}% from last month
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Header with Quick Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
          <p className="text-gray-600 dark:text-gray-400">Monitor your business performance and key metrics</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button size="sm" className="bg-gradient-to-r from-blue-500 to-purple-600">
            <Plus className="w-4 h-4 mr-2" />
            Add Lead
          </Button>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Leads"
          value={realtimeData.totalLeads.toLocaleString()}
          change={12.5}
          icon={Users}
          color="bg-blue-500"
          bgColor="bg-gradient-to-br from-blue-50 to-blue-100"
          textColor="text-blue-900"
        />
        <StatCard
          title="Active Deals"
          value={realtimeData.activeDeals}
          change={8.2}
          icon={Target}
          color="bg-green-500"
          bgColor="bg-gradient-to-br from-green-50 to-green-100"
          textColor="text-green-900"
        />
        <StatCard
          title="Revenue"
          value={`$${realtimeData.revenue.toLocaleString()}`}
          change={25.1}
          icon={DollarSign}
          color="bg-purple-500"
          bgColor="bg-gradient-to-br from-purple-50 to-purple-100"
          textColor="text-purple-900"
        />
        <StatCard
          title="Conversion Rate"
          value={`${realtimeData.conversionRate}%`}
          change={2.1}
          icon={TrendingUp}
          color="bg-orange-500"
          bgColor="bg-gradient-to-br from-orange-50 to-orange-100"
          textColor="text-orange-900"
        />
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Revenue Trends */}
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <span>Revenue Trends</span>
              </CardTitle>
              <Badge variant="outline">Last 6 months</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [`$${value}`, name]}
                  labelStyle={{ color: '#374151' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  dot={{ fill: '#3B82F6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Lead Sources */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-green-600" />
              <span>Lead Sources</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={leadSourceData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {leadSourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Activity and Pipeline */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-blue-600" />
                <span>Recent Activity</span>
                <Badge className="bg-blue-100 text-blue-700">Live</Badge>
              </CardTitle>
              <Button variant="ghost" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {realtimeData.recentActivities.map((activity) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    activity.priority === 'high' ? 'bg-red-100' :
                    activity.priority === 'success' ? 'bg-green-100' :
                    activity.priority === 'medium' ? 'bg-yellow-100' : 'bg-gray-100'
                  }`}>
                    {activity.type === 'lead' && <Users className="w-4 h-4 text-blue-600" />}
                    {activity.type === 'deal' && <Target className="w-4 h-4 text-green-600" />}
                    {activity.type === 'meeting' && <Calendar className="w-4 h-4 text-purple-600" />}
                    {activity.type === 'email' && <Mail className="w-4 h-4 text-orange-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.title}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{activity.description}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">{activity.time}</span>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-3 h-3" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pipeline & Tasks */}
        <div className="space-y-6">
          {/* Pipeline Value */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-purple-600" />
                <span>Pipeline</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  ${realtimeData.pipelineValue.toLocaleString()}
                </div>
                <p className="text-sm text-gray-600">Total Pipeline Value</p>
              </div>
              <div className="space-y-3">
                {conversionData.map((stage, index) => (
                  <div key={stage.stage} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{stage.stage}</span>
                      <span className="text-sm text-gray-600">{stage.value}</span>
                    </div>
                    <Progress 
                      value={(stage.value / conversionData[0].value) * 100} 
                      className="h-2" 
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Tasks */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-orange-600" />
                <span>Tasks</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {realtimeData.upcomingTasks.map((task) => (
                  <div key={task.id} className="flex items-center space-x-3 p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-800">
                    <div className={`w-2 h-2 rounded-full ${
                      task.priority === 'high' ? 'bg-red-500' :
                      task.priority === 'medium' ? 'bg-yellow-500' : 'bg-gray-400'
                    }`}></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{task.title}</p>
                      <p className="text-xs text-gray-600">{task.dueDate}</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <CheckCircle className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{realtimeData.todayLeads}</div>
          <p className="text-sm text-gray-600">Today's Leads</p>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{realtimeData.weeklyGrowth}%</div>
          <p className="text-sm text-gray-600">Weekly Growth</p>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">${realtimeData.avgDealSize}</div>
          <p className="text-sm text-gray-600">Avg Deal Size</p>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">{user.businessCategory}</div>
          <p className="text-sm text-gray-600">Industry</p>
        </Card>
      </div>
    </div>
  );
};