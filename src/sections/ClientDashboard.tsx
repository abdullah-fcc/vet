import { useState, useMemo } from 'react';
import {
  Users, Search, Plus, Phone, Mail, Calendar,
  ChevronRight, Filter, X, Eye, PawPrint, Clock,
  MessageSquare, ArrowRight, Star, MapPin,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  petOwners as mockOwners, getPetsByOwnerId, getCallsByOwnerId,
  getAppointmentsByOwnerId, getSpeciesEmoji, formatDuration,
  getTriageBadgeColor,
} from '@/data/mockData';
import type { PetOwner } from '@/types';

type OwnerStatus = PetOwner['status'];

const STATUS_COLUMNS: { title: string; status: OwnerStatus; color: string }[] = [
  { title: '🆕 New Client', status: 'New Client', color: 'bg-blue-500' },
  { title: '📞 Contacted', status: 'Contacted', color: 'bg-yellow-500' },
  { title: '📅 Appt Booked', status: 'Appointment Booked', color: 'bg-purple-500' },
  { title: '💚 Regular Client', status: 'Regular Client', color: 'bg-green-500' },
  { title: '💤 Churned', status: 'Churned', color: 'bg-gray-400' },
];

export default function ClientDashboard() {
  const [owners] = useState<PetOwner[]>(mockOwners);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOwner, setSelectedOwner] = useState<PetOwner | null>(null);
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');

  const filteredOwners = useMemo(() => {
    return owners.filter((o) => {
      const q = searchQuery.toLowerCase();
      return (
        o.firstName.toLowerCase().includes(q) ||
        o.lastName.toLowerCase().includes(q) ||
        o.email.toLowerCase().includes(q) ||
        o.phone.includes(q)
      );
    });
  }, [owners, searchQuery]);

  const ownersByStatus = useMemo(() => {
    const map: Record<OwnerStatus, PetOwner[]> = {
      'New Client': [],
      'Contacted': [],
      'Appointment Booked': [],
      'Regular Client': [],
      'Churned': [],
    };
    filteredOwners.forEach((o) => map[o.status].push(o));
    return map;
  }, [filteredOwners]);

  const OwnerCard = ({ owner }: { owner: PetOwner }) => {
    const pets = getPetsByOwnerId(owner.id);
    return (
      <div
        className="p-3 rounded-lg border bg-card hover:shadow-md transition-all cursor-pointer group"
        onClick={() => setSelectedOwner(owner)}
      >
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs bg-primary/10 text-primary">
                {owner.firstName[0]}{owner.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-sm">{owner.firstName} {owner.lastName}</p>
              <p className="text-xs text-muted-foreground">{owner.phone}</p>
            </div>
          </div>
          <Eye className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {pets.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {pets.map((pet) => (
              <Badge key={pet.id} variant="outline" className="text-xs">
                {getSpeciesEmoji(pet.species)} {pet.name}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Star className="h-3 w-3" />
            Score: {owner.engagementScore}/100
          </span>
          {owner.lastVisit && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {new Date(owner.lastVisit).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
    );
  };

  const OwnerDetailModal = () => {
    if (!selectedOwner) return null;
    const pets = getPetsByOwnerId(selectedOwner.id);
    const calls = getCallsByOwnerId(selectedOwner.id);
    const appointments = getAppointmentsByOwnerId(selectedOwner.id);

    return (
      <Dialog open={!!selectedOwner} onOpenChange={() => setSelectedOwner(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary/10 text-primary">
                  {selectedOwner.firstName[0]}{selectedOwner.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <span>{selectedOwner.firstName} {selectedOwner.lastName}</span>
                <Badge className="ml-2" variant="outline">{selectedOwner.status}</Badge>
              </div>
            </DialogTitle>
            <DialogDescription>
              Client since {new Date(selectedOwner.createdAt).toLocaleDateString()}
            </DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="details" className="mt-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="pets">Pets ({pets.length})</TabsTrigger>
              <TabsTrigger value="appointments">Appts ({appointments.length})</TabsTrigger>
              <TabsTrigger value="calls">Calls ({calls.length})</TabsTrigger>
            </TabsList>

            <ScrollArea className="h-[400px] mt-4">
              <TabsContent value="details" className="space-y-4 m-0">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-muted-foreground">Email</Label>
                    <p className="text-sm font-medium">{selectedOwner.email}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground">Phone</Label>
                    <p className="text-sm font-medium">{selectedOwner.phone}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground">Address</Label>
                    <p className="text-sm font-medium">{selectedOwner.address || '—'}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground">Emergency Contact</Label>
                    <p className="text-sm font-medium">{selectedOwner.emergencyContact || '—'}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground">Preferred Contact</Label>
                    <p className="text-sm font-medium capitalize">{selectedOwner.preferredContact}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground">Engagement Score</Label>
                    <p className="text-sm font-medium">{selectedOwner.engagementScore}/100</p>
                  </div>
                </div>
                {selectedOwner.notes && (
                  <div className="space-y-1">
                    <Label className="text-muted-foreground">Notes</Label>
                    <p className="text-sm bg-muted p-3 rounded-lg">{selectedOwner.notes}</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="pets" className="space-y-3 m-0">
                {pets.length === 0 && <p className="text-muted-foreground text-center py-4">No pets registered.</p>}
                {pets.map((pet) => (
                  <Card key={pet.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">{getSpeciesEmoji(pet.species)}</div>
                        <div className="flex-1">
                          <p className="font-medium">{pet.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {pet.breed} • {pet.age} yrs • {pet.weight} lbs • {pet.sex}
                          </p>
                          {pet.conditions.length > 0 && (
                            <div className="flex gap-1 mt-1">
                              {pet.conditions.map((c) => (
                                <Badge key={c} variant="destructive" className="text-xs">{c}</Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        <Badge variant={pet.status === 'active' ? 'default' : 'secondary'}>{pet.status}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="appointments" className="space-y-3 m-0">
                {appointments.length === 0 && <p className="text-muted-foreground text-center py-4">No appointments.</p>}
                {appointments.map((appt) => (
                  <Card key={appt.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{appt.petName} — {appt.type}</p>
                          <p className="text-sm text-muted-foreground">{appt.reason}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(appt.scheduledDate).toLocaleDateString()} at {appt.scheduledTime}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <Badge variant="outline">{appt.status}</Badge>
                          <Badge className={getTriageBadgeColor(appt.triageLevel)}>{appt.triageLevel}</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="calls" className="space-y-3 m-0">
                {calls.length === 0 && <p className="text-muted-foreground text-center py-4">No call records.</p>}
                {calls.map((call) => (
                  <Card key={call.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{call.ownerName}{call.petName ? ` (${call.petName})` : ''}</p>
                          <p className="text-sm text-muted-foreground line-clamp-2">{call.summary}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(call.startedAt).toLocaleString()} • {formatDuration(call.durationSeconds)}
                          </p>
                        </div>
                        <Badge variant="outline">{call.status}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Clients</h1>
          <p className="text-muted-foreground">
            Manage your pet owner relationships ({owners.length} total)
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant={viewMode === 'kanban' ? 'default' : 'outline'} size="sm" onClick={() => setViewMode('kanban')}>Kanban</Button>
          <Button variant={viewMode === 'list' ? 'default' : 'outline'} size="sm" onClick={() => setViewMode('list')}>List</Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Client
          </Button>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search clients by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {STATUS_COLUMNS.map((col) => (
            <div key={col.status} className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">{col.title}</h3>
                <Badge variant="secondary" className="text-xs">{ownersByStatus[col.status].length}</Badge>
              </div>
              <div className={`h-1 rounded-full ${col.color}`} />
              <div className="space-y-2">
                {ownersByStatus[col.status].map((owner) => (
                  <OwnerCard key={owner.id} owner={owner} />
                ))}
                {ownersByStatus[col.status].length === 0 && (
                  <p className="text-xs text-center text-muted-foreground py-4">No clients</p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {filteredOwners.map((owner) => {
                const pets = getPetsByOwnerId(owner.id);
                return (
                  <div
                    key={owner.id}
                    className="flex items-center justify-between p-4 hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => setSelectedOwner(owner)}
                  >
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {owner.firstName[0]}{owner.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{owner.firstName} {owner.lastName}</p>
                        <p className="text-sm text-muted-foreground">{owner.email} • {owner.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex gap-1 hidden md:flex">
                        {pets.map((pet) => (
                          <Badge key={pet.id} variant="outline" className="text-xs">
                            {getSpeciesEmoji(pet.species)} {pet.name}
                          </Badge>
                        ))}
                      </div>
                      <Badge variant="secondary">{owner.status}</Badge>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <OwnerDetailModal />
    </div>
  );
}
