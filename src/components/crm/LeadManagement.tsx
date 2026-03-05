import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Progress } from '../ui/progress';
import { Separator } from '../ui/separator';
import {
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  Phone,
  Mail,
  Calendar,
  User,
  Building2,
  DollarSign,
  Star,
  Clock,
  MessageSquare,
  FileText,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Users,
  Target,
  Activity,
  Zap,
  Globe,
  MapPin,
  Tag,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// Lead interface with dynamic fields
interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  source: string;
  status: 'new' | 'qualified' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost';
  value: number;
  priority: 'low' | 'medium' | 'high';
  assignedTo: string;
  createdAt: string;
  lastActivity: string;
  tags: string[];
  customFields: Record<string, any>;
  notes: string;
  avatar?: string;
}

// Pipeline stages configuration
const pipelineStages = [
  { id: 'new', name: 'New Leads', color: 'bg-blue-500', count: 12 },
  { id: 'qualified', name: 'Qualified', color: 'bg-yellow-500', count: 8 },
  { id: 'proposal', name: 'Proposal', color: 'bg-purple-500', count: 5 },
  { id: 'negotiation', name: 'Negotiation', color: 'bg-orange-500', count: 3 },
  { id: 'closed-won', name: 'Closed Won', color: 'bg-green-500', count: 15 },
  { id: 'closed-lost', name: 'Closed Lost', color: 'bg-red-500', count: 7 }
];

// Mock leads data
const mockLeads: Lead[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah@techcorp.com',
    phone: '+1-555-0123',
    company: 'TechCorp Inc',
    position: 'CTO',
    source: 'Website',
    status: 'new',
    value: 25000,
    priority: 'high',
    assignedTo: 'John Doe',
    createdAt: '2024-01-15T10:30:00Z',
    lastActivity: '2024-01-15T14:20:00Z',
    tags: ['hot-lead', 'enterprise'],
    customFields: {
      industry: 'Technology',
      employees: '100-500',
      budget: '20k-50k',
      timeline: 'Q1 2024'
    },
    notes: 'Interested in our enterprise solution. Scheduled demo for next week.'
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael@startupxyz.com',
    phone: '+1-555-0124',
    company: 'StartupXYZ',
    position: 'Founder',
    source: 'LinkedIn',
    status: 'qualified',
    value: 15000,
    priority: 'medium',
    assignedTo: 'Jane Smith',
    createdAt: '2024-01-14T09:15:00Z',
    lastActivity: '2024-01-16T11:30:00Z',
    tags: ['startup', 'quick-decision'],
    customFields: {
      industry: 'E-commerce',
      employees: '10-50',
      budget: '10k-25k',
      timeline: 'Q2 2024'
    },
    notes: 'Very interested, waiting for final budget approval.'
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    email: 'emily@retailplus.com',
    phone: '+1-555-0125',
    company: 'RetailPlus',
    position: 'Operations Manager',
    source: 'Referral',
    status: 'proposal',
    value: 35000,
    priority: 'high',
    assignedTo: 'John Doe',
    createdAt: '2024-01-12T16:45:00Z',
    lastActivity: '2024-01-16T09:15:00Z',
    tags: ['referral', 'large-deal'],
    customFields: {
      industry: 'Retail',
      employees: '500+',
      budget: '30k+',
      timeline: 'Immediate'
    },
    notes: 'Proposal sent. Follow-up scheduled for Thursday.'
  }
];

export const LeadManagement: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>(mockLeads);
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  // Filter leads based on search and filters
  useEffect(() => {
    let filtered = leads;

    if (searchQuery) {
      filtered = filtered.filter(lead => 
        lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.company.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(lead => lead.status === statusFilter);
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter(lead => lead.priority === priorityFilter);
    }

    setFilteredLeads(filtered);
  }, [leads, searchQuery, statusFilter, priorityFilter]);

  // Drag and drop handler for Kanban
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    
    if (source.droppableId !== destination.droppableId) {
      const updatedLeads = leads.map(lead => {
        if (lead.id === draggableId) {
          return { ...lead, status: destination.droppableId as Lead['status'] };
        }
        return lead;
      });
      setLeads(updatedLeads);
    }
  };

  const getLeadsByStatus = (status: string) => {
    return filteredLeads.filter(lead => lead.status === status);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    const stage = pipelineStages.find(s => s.id === status);
    return stage?.color || 'bg-gray-500';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const LeadCard = ({ lead }: { lead: Lead }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -2 }}
      className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-md transition-all duration-200"
      onClick={() => setSelectedLead(lead)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <Avatar className="w-10 h-10">
            {lead.avatar ? (
              <AvatarImage src={lead.avatar} alt={lead.name} />
            ) : (
              <AvatarFallback>{lead.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            )}
          </Avatar>
          <div>
            <h4 className="font-medium text-sm">{lead.name}</h4>
            <p className="text-xs text-gray-600">{lead.company}</p>
          </div>
        </div>
        <Badge className={`text-xs ${getPriorityColor(lead.priority)}`}>
          {lead.priority}
        </Badge>
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex items-center text-xs text-gray-600">
          <DollarSign className="w-3 h-3 mr-1" />
          ${lead.value.toLocaleString()}
        </div>
        <div className="flex items-center text-xs text-gray-600">
          <User className="w-3 h-3 mr-1" />
          {lead.assignedTo}
        </div>
      </div>

      <div className="flex flex-wrap gap-1 mb-3">
        {lead.tags.slice(0, 2).map(tag => (
          <Badge key={tag} variant="outline" className="text-xs">
            {tag}
          </Badge>
        ))}
        {lead.tags.length > 2 && (
          <Badge variant="outline" className="text-xs">
            +{lead.tags.length - 2}
          </Badge>
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>{formatDate(lead.lastActivity)}</span>
        <div className="flex items-center space-x-1">
          <Phone className="w-3 h-3" />
          <Mail className="w-3 h-3" />
          <MessageSquare className="w-3 h-3" />
        </div>
      </div>
    </motion.div>
  );

  const TableView = () => (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>All Leads</CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Upload className="w-4 h-4 mr-2" />
              Import
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3 font-medium">Lead</th>
                <th className="text-left p-3 font-medium">Company</th>
                <th className="text-left p-3 font-medium">Status</th>
                <th className="text-left p-3 font-medium">Value</th>
                <th className="text-left p-3 font-medium">Priority</th>
                <th className="text-left p-3 font-medium">Assigned</th>
                <th className="text-left p-3 font-medium">Last Activity</th>
                <th className="text-left p-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map(lead => (
                <motion.tr
                  key={lead.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                  onClick={() => setSelectedLead(lead)}
                >
                  <td className="p-3">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback>{lead.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{lead.name}</div>
                        <div className="text-sm text-gray-600">{lead.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3">{lead.company}</td>
                  <td className="p-3">
                    <Badge className={`${getStatusColor(lead.status)} text-white`}>
                      {pipelineStages.find(s => s.id === lead.status)?.name}
                    </Badge>
                  </td>
                  <td className="p-3">${lead.value.toLocaleString()}</td>
                  <td className="p-3">
                    <Badge className={getPriorityColor(lead.priority)}>
                      {lead.priority}
                    </Badge>
                  </td>
                  <td className="p-3">{lead.assignedTo}</td>
                  <td className="p-3">{formatDate(lead.lastActivity)}</td>
                  <td className="p-3">
                    <div className="flex items-center space-x-1">
                      <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); }}>
                        <Eye className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); }}>
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); }}>
                        <MoreHorizontal className="w-3 h-3" />
                      </Button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );

  const KanbanView = () => (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex space-x-6 overflow-x-auto pb-4">
        {pipelineStages.map(stage => (
          <div key={stage.id} className="min-w-[300px]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${stage.color}`}></div>
                <h3 className="font-medium">{stage.name}</h3>
                <Badge variant="outline">{getLeadsByStatus(stage.id).length}</Badge>
              </div>
              <Button variant="ghost" size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            
            <Droppable droppableId={stage.id}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`space-y-3 min-h-[200px] p-2 rounded-lg transition-all ${
                    snapshot.isDraggingOver ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                >
                  <AnimatePresence>
                    {getLeadsByStatus(stage.id).map((lead, index) => (
                      <Draggable key={lead.id} draggableId={lead.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`transform transition-all ${
                              snapshot.isDragging ? 'rotate-2 scale-105 shadow-lg' : ''
                            }`}
                          >
                            <LeadCard lead={lead} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                  </AnimatePresence>
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Lead Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage and track your sales leads through the pipeline</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" onClick={() => setViewMode(viewMode === 'table' ? 'kanban' : 'table')}>
            {viewMode === 'table' ? 'Kanban' : 'Table'} View
          </Button>
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600">
                <Plus className="w-4 h-4 mr-2" />
                Add Lead
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Lead</DialogTitle>
                <DialogDescription>Add a new lead to your pipeline</DialogDescription>
              </DialogHeader>
              {/* Create lead form would go here */}
              <div className="text-center py-8">
                <p className="text-gray-500">Lead creation form would be implemented here</p>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search leads by name, email, or company..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {pipelineStages.map(stage => (
                  <SelectItem key={stage.id} value={stage.id}>{stage.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-blue-600" />
            <div>
              <div className="font-semibold">{leads.length}</div>
              <div className="text-sm text-gray-600">Total Leads</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-green-600" />
            <div>
              <div className="font-semibold">{leads.filter(l => l.status === 'qualified').length}</div>
              <div className="text-sm text-gray-600">Qualified</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-purple-600" />
            <div>
              <div className="font-semibold">${leads.reduce((sum, lead) => sum + lead.value, 0).toLocaleString()}</div>
              <div className="text-sm text-gray-600">Pipeline Value</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-orange-600" />
            <div>
              <div className="font-semibold">24.8%</div>
              <div className="text-sm text-gray-600">Conversion Rate</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content */}
      {viewMode === 'table' ? <TableView /> : <KanbanView />}

      {/* Lead Detail Modal */}
      <Dialog open={!!selectedLead} onOpenChange={() => setSelectedLead(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          {selectedLead && (
            <div className="space-y-6">
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-16 h-16">
                      <AvatarFallback className="text-lg">
                        {selectedLead.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <DialogTitle className="text-xl">{selectedLead.name}</DialogTitle>
                      <DialogDescription>{selectedLead.position} at {selectedLead.company}</DialogDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getPriorityColor(selectedLead.priority)}>
                      {selectedLead.priority}
                    </Badge>
                    <Badge className={`${getStatusColor(selectedLead.status)} text-white`}>
                      {pipelineStages.find(s => s.id === selectedLead.status)?.name}
                    </Badge>
                  </div>
                </div>
              </DialogHeader>

              <div className="grid lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <h4 className="font-medium mb-3">Contact Information</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">{selectedLead.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">{selectedLead.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Building2 className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">{selectedLead.company}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <h4 className="font-medium mb-3">Lead Details</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Source:</span>
                        <Badge variant="outline">{selectedLead.source}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Value:</span>
                        <span className="text-sm font-medium">${selectedLead.value.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Assigned:</span>
                        <span className="text-sm">{selectedLead.assignedTo}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <h4 className="font-medium mb-3">Custom Fields</h4>
                    <div className="space-y-2">
                      {Object.entries(selectedLead.customFields).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-sm text-gray-600 capitalize">{key}:</span>
                          <span className="text-sm">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <h4 className="font-medium mb-3">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedLead.tags.map(tag => (
                        <Badge key={tag} variant="outline">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h4 className="font-medium mb-3">Notes</h4>
                <p className="text-sm text-gray-700 dark:text-gray-300">{selectedLead.notes}</p>
              </div>

              <div className="flex justify-end space-x-3">
                <Button variant="outline">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
                <Button variant="outline">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Meeting
                </Button>
                <Button>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Lead
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};