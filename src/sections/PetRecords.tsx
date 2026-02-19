import { useState, useMemo } from 'react';
import {
  Search, Plus, Filter, Eye, Heart, Edit, Trash2,
  Syringe, Calendar, AlertTriangle, ChevronRight, PawPrint,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  pets as mockPets, getOwnerById, getVaccinationsByPetId,
  getSpeciesEmoji, getAppointmentsByOwnerId,
} from '@/data/mockData';
import type { Pet } from '@/types';

export default function PetRecords() {
  const [pets] = useState<Pet[]>(mockPets);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [speciesFilter, setSpeciesFilter] = useState<string>('all');

  const filteredPets = useMemo(() => {
    return pets.filter((pet) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        pet.name.toLowerCase().includes(q) ||
        pet.breed.toLowerCase().includes(q) ||
        pet.species.toLowerCase().includes(q);
      const matchesSpecies = speciesFilter === 'all' || pet.species === speciesFilter;
      return matchesSearch && matchesSpecies;
    });
  }, [pets, searchQuery, speciesFilter]);

  const speciesList = useMemo(() => [...new Set(pets.map(p => p.species))], [pets]);

  const activePets = pets.filter(p => p.status === 'active').length;
  const withConditions = pets.filter(p => p.conditions.length > 0).length;
  const avgAge = pets.length > 0 ? (pets.reduce((a, p) => a + p.age, 0) / pets.length).toFixed(1) : '0';

  const PetCard = ({ pet }: { pet: Pet }) => {
    const owner = getOwnerById(pet.ownerId);
    return (
      <Card className="hover:shadow-lg transition-all cursor-pointer group" onClick={() => setSelectedPet(pet)}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="text-3xl">{getSpeciesEmoji(pet.species)}</div>
              <div>
                <h3 className="font-semibold">{pet.name}</h3>
                <p className="text-sm text-muted-foreground">{pet.breed}</p>
              </div>
            </div>
            <Badge variant={pet.status === 'active' ? 'default' : pet.status === 'deceased' ? 'destructive' : 'secondary'}>
              {pet.status}
            </Badge>
          </div>

          <div className="grid grid-cols-3 gap-2 text-sm mb-3">
            <div className="text-center p-2 rounded bg-muted">
              <p className="text-xs text-muted-foreground">Age</p>
              <p className="font-medium">{pet.age} yrs</p>
            </div>
            <div className="text-center p-2 rounded bg-muted">
              <p className="text-xs text-muted-foreground">Weight</p>
              <p className="font-medium">{pet.weight} lbs</p>
            </div>
            <div className="text-center p-2 rounded bg-muted">
              <p className="text-xs text-muted-foreground">Sex</p>
              <p className="font-medium capitalize">{pet.sex}</p>
            </div>
          </div>

          {pet.conditions.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {pet.conditions.map((c) => (
                <Badge key={c} variant="destructive" className="text-xs">
                  <AlertTriangle className="h-3 w-3 mr-1" />{c}
                </Badge>
              ))}
            </div>
          )}

          {pet.allergies.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {pet.allergies.map((a) => (
                <Badge key={a} variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200">⚠ {a}</Badge>
              ))}
            </div>
          )}

          {owner && (
            <div className="flex items-center gap-2 pt-2 border-t mt-2 text-sm text-muted-foreground">
              <PawPrint className="h-3 w-3" />
              <span>Owner: {owner.firstName} {owner.lastName}</span>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const PetDetailModal = () => {
    if (!selectedPet) return null;
    const owner = getOwnerById(selectedPet.ownerId);
    const vaccinations = getVaccinationsByPetId(selectedPet.id);

    return (
      <Dialog open={!!selectedPet} onOpenChange={() => setSelectedPet(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="text-3xl">{getSpeciesEmoji(selectedPet.species)}</div>
              <div>
                <span>{selectedPet.name}</span>
                <Badge className="ml-2" variant={selectedPet.status === 'active' ? 'default' : 'secondary'}>
                  {selectedPet.status}
                </Badge>
              </div>
            </DialogTitle>
            <DialogDescription>
              {selectedPet.breed} • {selectedPet.species} • {selectedPet.color}
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="overview" className="mt-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="medical">Medical</TabsTrigger>
              <TabsTrigger value="vaccinations">Vaccinations ({vaccinations.length})</TabsTrigger>
            </TabsList>

            <ScrollArea className="h-[400px] mt-4">
              <TabsContent value="overview" className="space-y-4 m-0">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1"><Label className="text-muted-foreground">Name</Label><p className="font-medium">{selectedPet.name}</p></div>
                  <div className="space-y-1"><Label className="text-muted-foreground">Species</Label><p className="font-medium capitalize">{selectedPet.species}</p></div>
                  <div className="space-y-1"><Label className="text-muted-foreground">Breed</Label><p className="font-medium">{selectedPet.breed}</p></div>
                  <div className="space-y-1"><Label className="text-muted-foreground">Color</Label><p className="font-medium">{selectedPet.color}</p></div>
                  <div className="space-y-1"><Label className="text-muted-foreground">Age</Label><p className="font-medium">{selectedPet.age} years</p></div>
                  <div className="space-y-1"><Label className="text-muted-foreground">Weight</Label><p className="font-medium">{selectedPet.weight} lbs</p></div>
                  <div className="space-y-1"><Label className="text-muted-foreground">Sex</Label><p className="font-medium capitalize">{selectedPet.sex}</p></div>
                  <div className="space-y-1"><Label className="text-muted-foreground">Microchip</Label><p className="font-medium">{selectedPet.microchipId || '—'}</p></div>
                </div>
                {owner && (
                  <div className="p-3 rounded-lg bg-muted mt-4">
                    <Label className="text-muted-foreground">Owner</Label>
                    <p className="font-medium">{owner.firstName} {owner.lastName}</p>
                    <p className="text-sm text-muted-foreground">{owner.phone} • {owner.email}</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="medical" className="space-y-4 m-0">
                <div className="space-y-3">
                  <div>
                    <Label className="text-muted-foreground">Conditions</Label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedPet.conditions.length > 0
                        ? selectedPet.conditions.map(c => <Badge key={c} variant="destructive">{c}</Badge>)
                        : <p className="text-sm text-muted-foreground">No known conditions</p>
                      }
                    </div>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Allergies</Label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedPet.allergies.length > 0
                        ? selectedPet.allergies.map(a => <Badge key={a} variant="outline" className="bg-orange-50 text-orange-700">{a}</Badge>)
                        : <p className="text-sm text-muted-foreground">No known allergies</p>
                      }
                    </div>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Medications</Label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedPet.medications.length > 0
                        ? selectedPet.medications.map(m => <Badge key={m} variant="secondary">{m}</Badge>)
                        : <p className="text-sm text-muted-foreground">No current medications</p>
                      }
                    </div>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Diet Notes</Label>
                    <p className="text-sm bg-muted p-3 rounded-lg mt-1">{selectedPet.dietNotes || 'No diet notes'}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Last Vet Visit</Label>
                    <p className="text-sm">{selectedPet.lastVisit ? new Date(selectedPet.lastVisit).toLocaleDateString() : '—'}</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="vaccinations" className="space-y-3 m-0">
                {vaccinations.length === 0 && (
                  <p className="text-muted-foreground text-center py-4">No vaccination records.</p>
                )}
                {vaccinations.map((v) => (
                  <Card key={v.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                            <Syringe className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium">{v.vaccineName}</p>
                            <p className="text-sm text-muted-foreground">
                              Administered: {new Date(v.dateAdministered).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant={v.status === 'current' ? 'default' : v.status === 'due' ? 'destructive' : 'secondary'}>
                            {v.status}
                          </Badge>
                          {v.nextDueDate && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Next: {new Date(v.nextDueDate).toLocaleDateString()}
                            </p>
                          )}
                        </div>
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
          <h1 className="text-2xl font-bold tracking-tight">Pet Records</h1>
          <p className="text-muted-foreground">
            Manage patient records and medical history
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Pet
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
              <Heart className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{activePets}</p>
              <p className="text-xs text-muted-foreground">Active Pets</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{withConditions}</p>
              <p className="text-xs text-muted-foreground">With Conditions</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <PawPrint className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{speciesList.length}</p>
              <p className="text-xs text-muted-foreground">Species Types</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{avgAge}</p>
              <p className="text-xs text-muted-foreground">Avg Age (yrs)</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filters */}
      <div className="flex gap-4 flex-col sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search pets by name, breed, or species..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={speciesFilter} onValueChange={setSpeciesFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Species" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Species</SelectItem>
            {speciesList.map((s) => (
              <SelectItem key={s} value={s}>{getSpeciesEmoji(s)} {s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Pet Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredPets.map((pet) => (
          <PetCard key={pet.id} pet={pet} />
        ))}
        {filteredPets.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            <PawPrint className="mx-auto h-12 w-12 mb-4 opacity-30" />
            <p>No pets found matching your search.</p>
          </div>
        )}
      </div>

      <PetDetailModal />
    </div>
  );
}
