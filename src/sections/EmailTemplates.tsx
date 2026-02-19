import { useState } from 'react';
import {
  Mail, Search, Copy, Check, Send, Plus,
  Eye, Edit, ChevronRight, Sparkles,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { emailTemplates as mockTemplates } from '@/data/mockData';
import type { EmailTemplate } from '@/types';

const TEMPLATE_CATEGORIES = [
  { key: 'all', label: 'All Templates' },
  { key: 'appointment_confirmation', label: 'Confirmation' },
  { key: 'appointment_reminder', label: 'Reminder' },
  { key: 'post_visit_summary', label: 'Post-Visit' },
  { key: 'vaccination_due', label: 'Vaccination' },
  { key: 'missed_call_followup', label: 'Missed Call' },
  { key: 'no_show_followup', label: 'No Show' },
  { key: 'welcome_new_client', label: 'Welcome' },
  { key: 'emergency_followup', label: 'Emergency' },
];

export default function EmailTemplates() {
  const [templates] = useState<EmailTemplate[]>(mockTemplates);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  const filteredTemplates = templates.filter((t) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      t.name.toLowerCase().includes(q) ||
      t.subject.toLowerCase().includes(q) ||
      t.body.toLowerCase().includes(q);
    const matchesCategory = categoryFilter === 'all' || t.type === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleCopy = (template: EmailTemplate) => {
    navigator.clipboard.writeText(template.body);
    setCopiedId(template.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'appointment_confirmation': return 'bg-green-100 text-green-700';
      case 'appointment_reminder': return 'bg-blue-100 text-blue-700';
      case 'post_visit_summary': return 'bg-purple-100 text-purple-700';
      case 'vaccination_due': return 'bg-yellow-100 text-yellow-700';
      case 'missed_call_followup': return 'bg-orange-100 text-orange-700';
      case 'no_show_followup': return 'bg-red-100 text-red-700';
      case 'welcome_new_client': return 'bg-pink-100 text-pink-700';
      case 'emergency_followup': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const fillPreview = (body: string) => {
    return body
      .replace(/\{ownerName\}/g, 'Sarah Johnson')
      .replace(/\{petName\}/g, 'Bella')
      .replace(/\{vetName\}/g, 'Dr. Sarah Kim')
      .replace(/\{appointmentDate\}/g, 'December 20, 2024')
      .replace(/\{appointmentTime\}/g, '2:00 PM')
      .replace(/\{appointmentType\}/g, 'Wellness Exam')
      .replace(/\{clinicName\}/g, 'Paw & Care Veterinary')
      .replace(/\{clinicPhone\}/g, '(555) 123-4567')
      .replace(/\{clinicAddress\}/g, '456 Pet Health Lane')
      .replace(/\{careInstructions\}/g, 'Continue current diet, monitor water intake, apply prescribed ear drops twice daily.')
      .replace(/\{vaccineName\}/g, 'Rabies Booster')
      .replace(/\{dueDate\}/g, 'January 15, 2025')
      .replace(/\{summary\}/g, 'Wellness exam completed. Bella is in good health with mild dental tartar noted.')
      .replace(/\{nextSteps\}/g, 'Schedule a dental cleaning appointment within the next 3 months.');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Email Templates</h1>
          <p className="text-muted-foreground">
            Automated vet clinic email templates ({templates.length} templates)
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Template
        </Button>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        {TEMPLATE_CATEGORIES.map((cat) => (
          <Button
            key={cat.key}
            variant={categoryFilter === cat.key ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCategoryFilter(cat.key)}
          >
            {cat.label}
          </Button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search templates by name, subject, or content..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Template Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="hover:shadow-md transition-all group">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <Badge className={`text-xs ${getTypeColor(template.type)}`}>
                  {template.type.replace(/_/g, ' ')}
                </Badge>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={(e) => { e.stopPropagation(); handleCopy(template); }}
                  >
                    {copiedId === template.id ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => { setSelectedTemplate(template); setPreviewMode(true); }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardTitle className="text-base mt-2">{template.name}</CardTitle>
              <CardDescription className="text-xs">Subject: {template.subject}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-3">{template.body}</p>
              <div className="flex items-center justify-between mt-3 pt-3 border-t">
                <div className="flex flex-wrap gap-1">
                  {template.variables.slice(0, 3).map((v) => (
                    <Badge key={v} variant="outline" className="text-xs font-mono">{`{${v}}`}</Badge>
                  ))}
                  {template.variables.length > 3 && (
                    <Badge variant="outline" className="text-xs">+{template.variables.length - 3}</Badge>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs"
                  onClick={() => { setSelectedTemplate(template); setPreviewMode(false); }}
                >
                  Edit <ChevronRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {filteredTemplates.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            <Mail className="mx-auto h-12 w-12 mb-4 opacity-30" />
            <p>No templates found matching your search.</p>
          </div>
        )}
      </div>

      {/* Template Detail / Edit Dialog */}
      {selectedTemplate && (
        <Dialog open={!!selectedTemplate} onOpenChange={() => setSelectedTemplate(null)}>
          <DialogContent className="max-w-2xl max-h-[85vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                {selectedTemplate.name}
              </DialogTitle>
              <DialogDescription>
                <Badge className={`text-xs ${getTypeColor(selectedTemplate.type)}`}>
                  {selectedTemplate.type.replace(/_/g, ' ')}
                </Badge>
              </DialogDescription>
            </DialogHeader>

            <Tabs defaultValue={previewMode ? 'preview' : 'edit'} className="mt-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="edit">Edit</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="variables">Variables</TabsTrigger>
              </TabsList>

              <ScrollArea className="h-[400px] mt-4">
                <TabsContent value="edit" className="space-y-4 m-0">
                  <div className="space-y-2">
                    <Label>Template Name</Label>
                    <Input defaultValue={selectedTemplate.name} />
                  </div>
                  <div className="space-y-2">
                    <Label>Subject Line</Label>
                    <Input defaultValue={selectedTemplate.subject} />
                  </div>
                  <div className="space-y-2">
                    <Label>Body</Label>
                    <Textarea
                      defaultValue={selectedTemplate.body}
                      rows={12}
                      className="font-mono text-sm"
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => setSelectedTemplate(null)}>Cancel</Button>
                    <Button>Save Changes</Button>
                  </div>
                </TabsContent>

                <TabsContent value="preview" className="m-0">
                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-primary/10 p-4">
                      <p className="text-xs text-muted-foreground">Subject:</p>
                      <p className="font-medium">{fillPreview(selectedTemplate.subject)}</p>
                    </div>
                    <div className="p-4 text-sm whitespace-pre-wrap">
                      {fillPreview(selectedTemplate.body)}
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end mt-4">
                    <Button variant="outline" onClick={() => handleCopy(selectedTemplate)}>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy
                    </Button>
                    <Button>
                      <Send className="mr-2 h-4 w-4" />
                      Send Test
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="variables" className="m-0">
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      These variables are automatically replaced with real data when the email is sent.
                    </p>
                    {selectedTemplate.variables.map((v) => (
                      <div key={v} className="flex items-center justify-between p-3 rounded-lg border">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="font-mono">{`{${v}}`}</Badge>
                          <span className="text-sm text-muted-foreground capitalize">
                            {v.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {fillPreview(`{${v}}`)}
                        </span>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </ScrollArea>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
