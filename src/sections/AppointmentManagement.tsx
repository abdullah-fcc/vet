import { useState, useMemo } from 'react';
import {
  Calendar, Clock, Plus, Search, Filter, AlertTriangle,
  CheckCircle, XCircle, ArrowRight, Stethoscope, User,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  appointments as mockAppointments, vets as mockVets,
  getVetById, getSpeciesEmoji, getTriageBadgeColor,
  getAppointmentStatusColor, getTodaysAppointments,
} from '@/data/mockData';
import type { Appointment, AppointmentType, TriageLevel } from '@/types';

export default function AppointmentManagement() {
  const [appointments] = useState<Appointment[]>(mockAppointments);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null);
  const [showNewAppt, setShowNewAppt] = useState(false);

  const todaysAppts = useMemo(() => getTodaysAppointments(), []);

  const filteredAppointments = useMemo(() => {
    return appointments.filter((appt) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        appt.petName.toLowerCase().includes(q) ||
        appt.ownerName.toLowerCase().includes(q) ||
        (appt.reason || '').toLowerCase().includes(q);
      const matchesType = typeFilter === 'all' || appt.type === typeFilter;
      const matchesStatus = statusFilter === 'all' || appt.status === statusFilter;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [appointments, searchQuery, typeFilter, statusFilter]);

  const confirmedCount = appointments.filter(a => a.status === 'confirmed').length;
  const pendingCount = appointments.filter(a => a.status === 'pending').length;
  const completedCount = appointments.filter(a => a.status === 'completed').length;
  const emergencyCount = appointments.filter(a => a.triageLevel === 'emergency' || a.triageLevel === 'urgent').length;

  const AppointmentCard = ({ appt }: { appt: Appointment }) => {
    const vet = getVetById(appt.vetId);
    return (
      <div
        className="flex items-center justify-between p-4 rounded-lg border hover:shadow-md transition-all cursor-pointer"
        onClick={() => setSelectedAppt(appt)}
      >
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center justify-center w-14 h-14 rounded-lg bg-primary/10">
            <span className="text-xs text-muted-foreground">
              {new Date(appt.scheduledDate).toLocaleDateString('en-US', { month: 'short' })}
            </span>
            <span className="text-lg font-bold text-primary">
              {new Date(appt.scheduledDate).getDate()}
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-medium">{appt.petName}</p>
              <span className="text-muted-foreground text-sm">({appt.ownerName})</span>
            </div>
            <p className="text-sm text-muted-foreground">{appt.reason}</p>
            <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{appt.scheduledTime}</span>
              <span className="flex items-center gap-1"><Stethoscope className="h-3 w-3" />{vet ? `Dr. ${vet.lastName}` : 'TBD'}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Badge className={getAppointmentStatusColor(appt.status)}>{appt.status}</Badge>
          <Badge className={getTriageBadgeColor(appt.triageLevel)} variant="outline">{appt.triageLevel}</Badge>
          <Badge variant="secondary" className="text-xs">{appt.type}</Badge>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Appointments</h1>
          <p className="text-muted-foreground">
            Schedule and manage veterinary appointments
          </p>
        </div>
        <Button onClick={() => setShowNewAppt(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Appointment
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{confirmedCount}</p>
              <p className="text-xs text-muted-foreground">Confirmed</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-yellow-100 flex items-center justify-center">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{pendingCount}</p>
              <p className="text-xs text-muted-foreground">Pending</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{completedCount}</p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{emergencyCount}</p>
              <p className="text-xs text-muted-foreground">Urgent / Emergency</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's schedule */}
      {todaysAppts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Today's Schedule
            </CardTitle>
            <CardDescription>{todaysAppts.length} appointment{todaysAppts.length > 1 ? 's' : ''} today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {todaysAppts.map((appt) => {
                const vet = getVetById(appt.vetId);
                return (
                  <div
                    key={appt.id}
                    className="p-3 rounded-lg border bg-primary/5 hover:bg-primary/10 cursor-pointer transition-colors"
                    onClick={() => setSelectedAppt(appt)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-primary">{appt.scheduledTime}</span>
                      <Badge className={getTriageBadgeColor(appt.triageLevel)} variant="outline">{appt.triageLevel}</Badge>
                    </div>
                    <p className="font-medium">{appt.petName}</p>
                    <p className="text-sm text-muted-foreground">{appt.ownerName} — {appt.type}</p>
                    <p className="text-xs text-muted-foreground mt-1">{vet ? `Dr. ${vet.firstName} ${vet.lastName}` : 'Unassigned'}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search & Filters */}
      <div className="flex gap-4 flex-col sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by pet name, owner, or reason..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="wellness">Wellness</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
            <SelectItem value="emergency">Emergency</SelectItem>
            <SelectItem value="dental">Dental</SelectItem>
            <SelectItem value="surgery">Surgery</SelectItem>
            <SelectItem value="grooming">Grooming</SelectItem>
            <SelectItem value="follow_up">Follow-Up</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="checked_in">Checked In</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
            <SelectItem value="no_show">No Show</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Appointment List */}
      <div className="space-y-3">
        {filteredAppointments.map((appt) => (
          <AppointmentCard key={appt.id} appt={appt} />
        ))}
        {filteredAppointments.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Calendar className="mx-auto h-12 w-12 mb-4 opacity-30" />
            <p>No appointments found matching your filters.</p>
          </div>
        )}
      </div>

      {/* Appointment Detail Modal */}
      {selectedAppt && (
        <Dialog open={!!selectedAppt} onOpenChange={() => setSelectedAppt(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Appointment Details</DialogTitle>
              <DialogDescription>
                {new Date(selectedAppt.scheduledDate).toLocaleDateString()} at {selectedAppt.scheduledTime}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Pet</Label>
                  <p className="font-medium">{selectedAppt.petName}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Owner</Label>
                  <p className="font-medium">{selectedAppt.ownerName}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Type</Label>
                  <Badge variant="secondary">{selectedAppt.type}</Badge>
                </div>
                <div>
                  <Label className="text-muted-foreground">Triage Level</Label>
                  <Badge className={getTriageBadgeColor(selectedAppt.triageLevel)}>{selectedAppt.triageLevel}</Badge>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <Badge className={getAppointmentStatusColor(selectedAppt.status)}>{selectedAppt.status}</Badge>
                </div>
                <div>
                  <Label className="text-muted-foreground">Vet</Label>
                  <p className="font-medium">{(() => { const v = getVetById(selectedAppt.vetId); return v ? `Dr. ${v.firstName} ${v.lastName}` : 'Unassigned'; })()}</p>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Reason</Label>
                <p className="text-sm bg-muted p-3 rounded-lg">{selectedAppt.reason}</p>
              </div>
              {selectedAppt.symptoms && selectedAppt.symptoms.length > 0 && (
                <div>
                  <Label className="text-muted-foreground">Symptoms</Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedAppt.symptoms.map(s => <Badge key={s} variant="outline">{s}</Badge>)}
                  </div>
                </div>
              )}
              {selectedAppt.notes && (
                <div>
                  <Label className="text-muted-foreground">Notes</Label>
                  <p className="text-sm bg-muted p-3 rounded-lg">{selectedAppt.notes}</p>
                </div>
              )}
              <div className="flex gap-2 justify-end pt-2">
                <Button variant="outline" onClick={() => setSelectedAppt(null)}>Close</Button>
                <Button>Edit Appointment</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* New Appointment Dialog */}
      <Dialog open={showNewAppt} onOpenChange={setShowNewAppt}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Schedule New Appointment</DialogTitle>
            <DialogDescription>Fill in appointment details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Pet Name</Label>
                <Input placeholder="Enter pet name" />
              </div>
              <div className="space-y-2">
                <Label>Owner Name</Label>
                <Input placeholder="Enter owner name" />
              </div>
              <div className="space-y-2">
                <Label>Date</Label>
                <Input type="date" />
              </div>
              <div className="space-y-2">
                <Label>Time</Label>
                <Input type="time" />
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="wellness">Wellness</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                    <SelectItem value="dental">Dental</SelectItem>
                    <SelectItem value="surgery">Surgery</SelectItem>
                    <SelectItem value="grooming">Grooming</SelectItem>
                    <SelectItem value="follow_up">Follow-Up</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Veterinarian</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select vet" /></SelectTrigger>
                  <SelectContent>
                    {mockVets.map((v) => (
                      <SelectItem key={v.id} value={v.id}>Dr. {v.firstName} {v.lastName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Reason / Symptoms</Label>
              <Textarea placeholder="Describe the reason for the visit..." />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowNewAppt(false)}>Cancel</Button>
              <Button onClick={() => setShowNewAppt(false)}>Schedule Appointment</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
