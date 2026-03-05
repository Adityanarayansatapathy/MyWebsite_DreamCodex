import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { Checkbox } from '../ui/checkbox';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import {
  Plus,
  Search,
  Save,
  Eye,
  Edit,
  Trash2,
  Copy,
  Download,
  Upload,
  Settings,
  Palette,
  Layout,
  Type,
  ListChecks,
  Calendar,
  Phone,
  Mail,
  Hash,
  FileText,
  Image,
  MapPin,
  Star,
  ToggleLeft,
  RadioIcon as Radio,
  Square,
  Circle,
  Grip,
  Move,
  X,
  ChevronUp,
  ChevronDown,
  Code,
  Smartphone,
  Monitor,
  Tablet,
  Zap,
  FormInput,
  Share,
  BarChart3,
  Target,
  Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// Form field types
interface FormField {
  id: string;
  type: 'text' | 'email' | 'tel' | 'number' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'date' | 'file' | 'rating';
  label: string;
  placeholder?: string;
  required: boolean;
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    min?: number;
    max?: number;
  };
  options?: string[];
  description?: string;
  defaultValue?: string;
  width: 'full' | 'half' | 'third';
}

interface FormSchema {
  id: string;
  title: string;
  description: string;
  fields: FormField[];
  settings: {
    theme: 'light' | 'dark' | 'branded';
    submitText: string;
    redirectUrl?: string;
    emailNotifications: boolean;
    allowMultipleSubmissions: boolean;
  };
  createdAt: string;
  updatedAt: string;
  submissions: number;
  isActive: boolean;
}

// Available field types for drag & drop
const fieldTypes = [
  { type: 'text', label: 'Text Input', icon: Type, description: 'Single line text input' },
  { type: 'email', label: 'Email', icon: Mail, description: 'Email address input' },
  { type: 'tel', label: 'Phone', icon: Phone, description: 'Phone number input' },
  { type: 'number', label: 'Number', icon: Hash, description: 'Numeric input' },
  { type: 'textarea', label: 'Text Area', icon: FileText, description: 'Multi-line text input' },
  { type: 'select', label: 'Dropdown', icon: ListChecks, description: 'Select from options' },
  { type: 'radio', label: 'Radio Group', icon: Radio, description: 'Single choice from options' },
  { type: 'checkbox', label: 'Checkboxes', icon: Square, description: 'Multiple choice options' },
  { type: 'date', label: 'Date Picker', icon: Calendar, description: 'Date selection' },
  { type: 'file', label: 'File Upload', icon: Upload, description: 'File attachment' },
  { type: 'rating', label: 'Rating', icon: Star, description: 'Star rating input' }
];

// Mock forms data
const mockForms: FormSchema[] = [
  {
    id: '1',
    title: 'Lead Capture Form',
    description: 'Capture leads from website visitors',
    fields: [
      {
        id: 'name',
        type: 'text',
        label: 'Full Name',
        placeholder: 'Enter your full name',
        required: true,
        width: 'full'
      },
      {
        id: 'email',
        type: 'email',
        label: 'Email Address',
        placeholder: 'your@email.com',
        required: true,
        width: 'half'
      },
      {
        id: 'phone',
        type: 'tel',
        label: 'Phone Number',
        placeholder: '+1 (555) 000-0000',
        required: false,
        width: 'half'
      },
      {
        id: 'company',
        type: 'text',
        label: 'Company Name',
        placeholder: 'Your company',
        required: true,
        width: 'full'
      },
      {
        id: 'interest',
        type: 'select',
        label: 'Area of Interest',
        required: true,
        options: ['Web Development', 'Mobile Apps', 'Consulting', 'Other'],
        width: 'full'
      }
    ],
    settings: {
      theme: 'branded',
      submitText: 'Get Started',
      emailNotifications: true,
      allowMultipleSubmissions: false
    },
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-16T14:20:00Z',
    submissions: 47,
    isActive: true
  },
  {
    id: '2',
    title: 'Contact Us Form',
    description: 'General contact form for inquiries',
    fields: [
      {
        id: 'name',
        type: 'text',
        label: 'Name',
        required: true,
        width: 'half'
      },
      {
        id: 'email',
        type: 'email',
        label: 'Email',
        required: true,
        width: 'half'
      },
      {
        id: 'subject',
        type: 'text',
        label: 'Subject',
        required: true,
        width: 'full'
      },
      {
        id: 'message',
        type: 'textarea',
        label: 'Message',
        required: true,
        width: 'full'
      }
    ],
    settings: {
      theme: 'light',
      submitText: 'Send Message',
      emailNotifications: true,
      allowMultipleSubmissions: true
    },
    createdAt: '2024-01-10T09:15:00Z',
    updatedAt: '2024-01-14T11:30:00Z',
    submissions: 23,
    isActive: true
  }
];

export const FormBuilder: React.FC = () => {
  const [forms, setForms] = useState<FormSchema[]>(mockForms);
  const [selectedForm, setSelectedForm] = useState<FormSchema | null>(null);
  const [isBuilderMode, setIsBuilderMode] = useState(false);
  const [selectedField, setSelectedField] = useState<FormField | null>(null);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [searchQuery, setSearchQuery] = useState('');

  // Current form being edited
  const [currentForm, setCurrentForm] = useState<FormSchema>({
    id: '',
    title: 'New Form',
    description: '',
    fields: [],
    settings: {
      theme: 'light',
      submitText: 'Submit',
      emailNotifications: true,
      allowMultipleSubmissions: false
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    submissions: 0,
    isActive: false
  });

  // Generate unique ID for new fields
  const generateFieldId = () => `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Add new field to form
  const addField = (fieldType: string) => {
    const newField: FormField = {
      id: generateFieldId(),
      type: fieldType as FormField['type'],
      label: `New ${fieldType.charAt(0).toUpperCase() + fieldType.slice(1)} Field`,
      required: false,
      width: 'full',
      ...(fieldType === 'select' || fieldType === 'radio' || fieldType === 'checkbox' ? 
        { options: ['Option 1', 'Option 2', 'Option 3'] } : {}
      )
    };

    setCurrentForm(prev => ({
      ...prev,
      fields: [...prev.fields, newField]
    }));
  };

  // Handle drag & drop reordering
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination } = result;

    if (source.droppableId === 'fieldTypes' && destination.droppableId === 'formFields') {
      // Adding new field from palette
      const fieldType = fieldTypes[source.index].type;
      addField(fieldType);
    } else if (source.droppableId === 'formFields' && destination.droppableId === 'formFields') {
      // Reordering existing fields
      const newFields = Array.from(currentForm.fields);
      const [reorderedField] = newFields.splice(source.index, 1);
      newFields.splice(destination.index, 0, reorderedField);

      setCurrentForm(prev => ({
        ...prev,
        fields: newFields
      }));
    }
  };

  // Update field properties
  const updateField = (fieldId: string, updates: Partial<FormField>) => {
    setCurrentForm(prev => ({
      ...prev,
      fields: prev.fields.map(field => 
        field.id === fieldId ? { ...field, ...updates } : field
      )
    }));
  };

  // Delete field
  const deleteField = (fieldId: string) => {
    setCurrentForm(prev => ({
      ...prev,
      fields: prev.fields.filter(field => field.id !== fieldId)
    }));
    setSelectedField(null);
  };

  // Save form
  const saveForm = () => {
    const updatedForm = {
      ...currentForm,
      id: currentForm.id || generateFieldId(),
      updatedAt: new Date().toISOString()
    };

    setForms(prev => {
      const existingIndex = prev.findIndex(form => form.id === updatedForm.id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = updatedForm;
        return updated;
      } else {
        return [...prev, updatedForm];
      }
    });

    setIsBuilderMode(false);
    setCurrentForm({
      id: '',
      title: 'New Form',
      description: '',
      fields: [],
      settings: {
        theme: 'light',
        submitText: 'Submit',
        emailNotifications: true,
        allowMultipleSubmissions: false
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      submissions: 0,
      isActive: false
    });
  };

  // Render form field
  const renderFormField = (field: FormField, isPreview = false, isBuilder = false) => {
    const fieldContent = () => {
      switch (field.type) {
        case 'text':
        case 'email':
        case 'tel':
        case 'number':
          return (
            <Input
              type={field.type}
              placeholder={field.placeholder}
              disabled={isPreview}
              className={`${field.width === 'half' ? 'w-1/2' : field.width === 'third' ? 'w-1/3' : 'w-full'}`}
            />
          );
        case 'textarea':
          return <Textarea placeholder={field.placeholder} disabled={isPreview} rows={4} />;
        case 'select':
          return (
            <Select disabled={isPreview}>
              <SelectTrigger>
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map(option => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        case 'radio':
          return (
            <RadioGroup disabled={isPreview}>
              {field.options?.map(option => (
                <div key={option} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`${field.id}-${option}`} />
                  <Label htmlFor={`${field.id}-${option}`}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
          );
        case 'checkbox':
          return (
            <div className="space-y-2">
              {field.options?.map(option => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox id={`${field.id}-${option}`} disabled={isPreview} />
                  <Label htmlFor={`${field.id}-${option}`}>{option}</Label>
                </div>
              ))}
            </div>
          );
        case 'date':
          return <Input type="date" disabled={isPreview} />;
        case 'file':
          return <Input type="file" disabled={isPreview} />;
        case 'rating':
          return (
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map(star => (
                <Star key={star} className="w-6 h-6 text-gray-300 hover:text-yellow-400 cursor-pointer" />
              ))}
            </div>
          );
        default:
          return <Input disabled={isPreview} />;
      }
    };

    return (
      <div className={`space-y-2 ${isBuilder ? 'group relative' : ''}`}>
        <div className="flex items-center justify-between">
          <Label className="flex items-center space-x-1">
            <span>{field.label}</span>
            {field.required && <span className="text-red-500">*</span>}
          </Label>
          {isBuilder && (
            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedField(field)}
              >
                <Settings className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteField(field.id)}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          )}
        </div>
        {fieldContent()}
        {field.description && (
          <p className="text-xs text-gray-600">{field.description}</p>
        )}
      </div>
    );
  };

  const FormsList = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Form Builder</h2>
          <p className="text-gray-600">Create and manage dynamic forms for lead capture</p>
        </div>
        <Button 
          onClick={() => setIsBuilderMode(true)}
          className="bg-gradient-to-r from-blue-500 to-purple-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Form
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search forms..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <FormInput className="w-5 h-5 text-blue-600" />
            <div>
              <div className="font-semibold">{forms.length}</div>
              <div className="text-sm text-gray-600">Total Forms</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-green-600" />
            <div>
              <div className="font-semibold">{forms.reduce((sum, form) => sum + form.submissions, 0)}</div>
              <div className="text-sm text-gray-600">Total Submissions</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-purple-600" />
            <div>
              <div className="font-semibold">{forms.filter(f => f.isActive).length}</div>
              <div className="text-sm text-gray-600">Active Forms</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Forms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {forms.map(form => (
          <motion.div
            key={form.id}
            whileHover={{ y: -4 }}
            className="group"
          >
            <Card className="h-full hover:shadow-lg transition-all duration-200">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{form.title}</CardTitle>
                    <p className="text-sm text-gray-600">{form.description}</p>
                  </div>
                  <Badge className={form.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                    {form.isActive ? 'Active' : 'Draft'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Fields:</span>
                    <span className="font-medium">{form.fields.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Submissions:</span>
                    <span className="font-medium">{form.submissions}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Updated:</span>
                    <span className="font-medium">
                      {new Date(form.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setCurrentForm(form);
                        setIsBuilderMode(true);
                      }}
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      <Eye className="w-3 h-3 mr-1" />
                      Preview
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share className="w-3 h-3 mr-1" />
                      Share
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const FormBuilderInterface = () => (
    <div className="h-full flex">
      {/* Left Sidebar - Field Palette */}
      <div className="w-80 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <div className="p-4 border-b">
          <h3 className="font-medium">Field Types</h3>
          <p className="text-sm text-gray-600">Drag fields to add them to your form</p>
        </div>
        
        <ScrollArea className="h-[calc(100vh-300px)]">
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="fieldTypes" isDropDisabled>
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps} className="p-4 space-y-2">
                  {fieldTypes.map((fieldType, index) => (
                    <Draggable key={fieldType.type} draggableId={fieldType.type} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`p-3 rounded-lg border cursor-move transition-all ${
                            snapshot.isDragging
                              ? 'shadow-lg bg-white transform rotate-2'
                              : 'bg-white hover:shadow-md'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <fieldType.icon className="w-5 h-5 text-blue-600" />
                            <div>
                              <div className="font-medium text-sm">{fieldType.label}</div>
                              <div className="text-xs text-gray-600">{fieldType.description}</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </ScrollArea>
      </div>

      {/* Center - Form Canvas */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => setIsBuilderMode(false)}>
              <X className="w-4 h-4 mr-2" />
              Close
            </Button>
            <div>
              <Input
                value={currentForm.title}
                onChange={(e) => setCurrentForm(prev => ({ ...prev, title: e.target.value }))}
                className="font-medium border-none text-lg p-0 h-auto"
                placeholder="Form Title"
              />
              <Input
                value={currentForm.description}
                onChange={(e) => setCurrentForm(prev => ({ ...prev, description: e.target.value }))}
                className="text-sm text-gray-600 border-none p-0 h-auto"
                placeholder="Form description"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 border rounded-lg p-1">
              <Button
                variant={previewMode === 'desktop' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setPreviewMode('desktop')}
              >
                <Monitor className="w-4 h-4" />
              </Button>
              <Button
                variant={previewMode === 'tablet' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setPreviewMode('tablet')}
              >
                <Tablet className="w-4 h-4" />
              </Button>
              <Button
                variant={previewMode === 'mobile' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setPreviewMode('mobile')}
              >
                <Smartphone className="w-4 h-4" />
              </Button>
            </div>
            <Button variant="outline">
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button onClick={saveForm}>
              <Save className="w-4 h-4 mr-2" />
              Save Form
            </Button>
          </div>
        </div>

        {/* Form Canvas */}
        <div className="flex-1 p-6">
          <div className={`max-w-full mx-auto transition-all duration-300 ${
            previewMode === 'mobile' ? 'max-w-sm' :
            previewMode === 'tablet' ? 'max-w-2xl' : 'max-w-4xl'
          }`}>
            <Card className="p-6">
              <div className="space-y-6">
                <div className="text-center border-b pb-4">
                  <h2 className="text-2xl font-bold">{currentForm.title}</h2>
                  {currentForm.description && (
                    <p className="text-gray-600 mt-2">{currentForm.description}</p>
                  )}
                </div>

                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="formFields">
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`space-y-6 min-h-[200px] rounded-lg transition-all ${
                          snapshot.isDraggingOver ? 'bg-blue-50 border-2 border-dashed border-blue-300' : ''
                        }`}
                      >
                        {currentForm.fields.length === 0 ? (
                          <div className="text-center py-12 text-gray-500">
                            <FormInput className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>Drag field types here to build your form</p>
                          </div>
                        ) : (
                          <AnimatePresence>
                            {currentForm.fields.map((field, index) => (
                              <Draggable key={field.id} draggableId={field.id} index={index}>
                                {(provided, snapshot) => (
                                  <motion.div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className={`transform transition-all ${
                                      snapshot.isDragging ? 'shadow-lg scale-105' : ''
                                    }`}
                                  >
                                    <div className="border rounded-lg p-4 bg-white relative group">
                                      <div 
                                        {...provided.dragHandleProps}
                                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-move"
                                      >
                                        <Grip className="w-4 h-4 text-gray-400" />
                                      </div>
                                      {renderFormField(field, false, true)}
                                    </div>
                                  </motion.div>
                                )}
                              </Draggable>
                            ))}
                          </AnimatePresence>
                        )}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>

                {currentForm.fields.length > 0 && (
                  <div className="text-center pt-4 border-t">
                    <Button className="bg-gradient-to-r from-blue-500 to-purple-600">
                      {currentForm.settings.submitText}
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Field Properties */}
      {selectedField && (
        <div className="w-80 border-l border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="p-4 border-b">
            <h3 className="font-medium">Field Properties</h3>
            <p className="text-sm text-gray-600">Configure the selected field</p>
          </div>
          
          <ScrollArea className="h-[calc(100vh-300px)] p-4">
            <div className="space-y-4">
              <div>
                <Label>Field Label</Label>
                <Input
                  value={selectedField.label}
                  onChange={(e) => updateField(selectedField.id, { label: e.target.value })}
                />
              </div>
              
              <div>
                <Label>Placeholder</Label>
                <Input
                  value={selectedField.placeholder || ''}
                  onChange={(e) => updateField(selectedField.id, { placeholder: e.target.value })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>Required Field</Label>
                <Switch
                  checked={selectedField.required}
                  onCheckedChange={(checked) => updateField(selectedField.id, { required: checked })}
                />
              </div>

              <div>
                <Label>Field Width</Label>
                <Select
                  value={selectedField.width}
                  onValueChange={(value) => updateField(selectedField.id, { width: value as FormField['width'] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full">Full Width</SelectItem>
                    <SelectItem value="half">Half Width</SelectItem>
                    <SelectItem value="third">Third Width</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {(selectedField.type === 'select' || selectedField.type === 'radio' || selectedField.type === 'checkbox') && (
                <div>
                  <Label>Options</Label>
                  <div className="space-y-2">
                    {selectedField.options?.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Input
                          value={option}
                          onChange={(e) => {
                            const newOptions = [...(selectedField.options || [])];
                            newOptions[index] = e.target.value;
                            updateField(selectedField.id, { options: newOptions });
                          }}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const newOptions = selectedField.options?.filter((_, i) => i !== index);
                            updateField(selectedField.id, { options: newOptions });
                          }}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newOptions = [...(selectedField.options || []), `Option ${(selectedField.options?.length || 0) + 1}`];
                        updateField(selectedField.id, { options: newOptions });
                      }}
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Add Option
                    </Button>
                  </div>
                </div>
              )}

              <div>
                <Label>Description</Label>
                <Textarea
                  value={selectedField.description || ''}
                  onChange={(e) => updateField(selectedField.id, { description: e.target.value })}
                  placeholder="Help text for this field"
                  rows={3}
                />
              </div>
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );

  return (
    <div className="h-full">
      {isBuilderMode ? <FormBuilderInterface /> : <FormsList />}
    </div>
  );
};