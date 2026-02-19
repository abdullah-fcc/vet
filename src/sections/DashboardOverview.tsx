import { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Phone,
  Calendar,
  Mail,
  Heart,
  Clock,
  ArrowRight,
  AlertTriangle,
  Stethoscope,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  formatDuration, calls as mockCalls, petOwners as mockOwners,
  appointments as mockAppointments, getTodaysAppointments,
  getTriageBadgeColor, getSpeciesEmoji, getVetById,
} from '@/data/mockData';
import type { PetOwner, Call, Appointment } from '@/types';
import type { ViewType } from '@/App';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';

interface DashboardOverviewProps {
  onNavigate: (view: ViewType) => void;
}

const callVolumeData = [
  { day: 'Mon', calls: 15, bookings: 8 },
  { day: 'Tue', calls: 22, bookings: 12 },
  { day: 'Wed', calls: 18, bookings: 9 },
  { day: 'Thu', calls: 25, bookings: 14 },
  { day: 'Fri', calls: 20, bookings: 11 },
  { day: 'Sat', calls: 12, bookings: 6 },
  { day: 'Sun', calls: 8, bookings: 3 },
];

const appointmentTypeData = [
  { name: 'Wellness', value: 40, color: '#22c55e' },
  { name: 'Urgent', value: 25, color: '#f97316' },
  { name: 'Emergency', value: 10, color: '#ef4444' },
  { name: 'Dental', value: 15, color: '#3b82f6' },
  { name: 'Surgery', value: 10, color: '#8b5cf6' },
];

const triageFunnelData = [
  { stage: 'Info', count: 35 },
  { stage: 'Routine', count: 45 },
  { stage: 'Urgent', count: 25 },
  { stage: 'Emergency', count: 8 },
];

export default function DashboardOverview({ onNavigate }: DashboardOverviewProps) {
  const [owners] = useState<PetOwner[]>(mockOwners);
  const [allCalls] = useState<Call[]>(mockCalls);
  const [todaysAppts] = useState<Appointment[]>(getTodaysAppointments());

  const totalClients = owners.length;
  const callsToday = allCalls.length;
  const appointmentsToday = todaysAppts.length;
  const avgCallDuration = allCalls.length > 0
    ? Math.round(allCalls.reduce((a, c) => a + c.durationSeconds, 0) / allCalls.length)
    : 0;
  const emergenciesToday = allCalls.filter(c => c.triageLevel === 'emergency').length;
  const emailsSent = allCalls.filter(c => c.followUpEmailSent).length;

  const stats = [
    { title: 'Total Clients', value: totalClients, change: '+12%', trend: 'up', icon: Users, description: 'Active pet owners' },
    { title: 'Calls Today', value: callsToday, change: '+5', trend: 'up', icon: Phone, description: `${allCalls.filter(c => c.status === 'completed').length} completed` },
    { title: 'Appointments Today', value: appointmentsToday, change: '+3', trend: 'up', icon: Calendar, description: 'Scheduled for today' },
    { title: 'Emergencies', value: emergenciesToday, change: '0', trend: 'up', icon: AlertTriangle, description: 'Handled today' },
    { title: 'Emails Sent', value: emailsSent, change: '+18%', trend: 'up', icon: Mail, description: 'Confirmations & reminders' },
    { title: 'Avg Call Duration', value: formatDuration(avgCallDuration), change: '+5%', trend: 'up', icon: Clock, description: 'Including triage' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening at Paw & Care Veterinary Clinic.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => onNavigate('voice')}>
            <Phone className="mr-2 h-4 w-4" />
            Test AI Voice
          </Button>
          <Button onClick={() => onNavigate('clients')}>
            View All Clients
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === 'up' ? TrendingUp : TrendingDown;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={stat.trend === 'up' ? 'default' : 'destructive'} className="text-xs">
                    <TrendIcon className="mr-1 h-3 w-3" />
                    {stat.change}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{stat.description}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Call Volume & Bookings</CardTitle>
            <CardDescription>Daily calls and appointment bookings this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={callVolumeData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="day" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip />
                  <Line type="monotone" dataKey="calls" stroke="#3b82f6" strokeWidth={2} name="Calls" />
                  <Line type="monotone" dataKey="bookings" stroke="#22c55e" strokeWidth={2} name="Bookings" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Appointment Types</CardTitle>
            <CardDescription>Breakdown by visit type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={appointmentTypeData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value">
                    {appointmentTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {appointmentTypeData.map((source) => (
                <div key={source.name} className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: source.color }} />
                  <span className="text-sm text-muted-foreground">{source.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Triage Funnel & Today's Schedule */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Triage Distribution</CardTitle>
            <CardDescription>Call classifications this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={triageFunnelData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis type="number" className="text-xs" />
                  <YAxis dataKey="stage" type="category" className="text-xs" width={80} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#22c55e" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Today's Schedule</CardTitle>
              <CardDescription>Appointments for today</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={() => onNavigate('appointments')}>
              View all <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todaysAppts.length === 0 && (
                <p className="text-center text-muted-foreground py-4">No appointments today.</p>
              )}
              {todaysAppts.map((appt) => {
                const vet = getVetById(appt.vetId);
                return (
                  <div key={appt.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{getSpeciesEmoji(appt.petName === 'Rocky' ? 'dog' : appt.petName === 'Whiskers' ? 'cat' : 'dog')}</div>
                      <div>
                        <p className="font-medium">{appt.petName} <span className="text-muted-foreground">({appt.ownerName})</span></p>
                        <p className="text-sm text-muted-foreground">{appt.reason}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right hidden sm:block">
                        <p className="font-medium">{appt.scheduledTime}</p>
                        <p className="text-xs text-muted-foreground">{vet ? `Dr. ${vet.lastName}` : 'TBD'}</p>
                      </div>
                      <Badge className={getTriageBadgeColor(appt.triageLevel)}>
                        {appt.triageLevel}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Calls & System Status */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Calls</CardTitle>
              <CardDescription>Latest AI-handled conversations</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={() => onNavigate('calls')}>
              View all <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {allCalls.slice(0, 5).map((call) => (
                <div key={call.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                      call.status === 'completed' ? 'bg-green-100' :
                      call.status === 'emergency' ? 'bg-red-100' :
                      call.status === 'transferred' ? 'bg-blue-100' : 'bg-yellow-100'
                    }`}>
                      <Phone className={`h-4 w-4 ${
                        call.status === 'completed' ? 'text-green-600' :
                        call.status === 'emergency' ? 'text-red-600' :
                        call.status === 'transferred' ? 'text-blue-600' : 'text-yellow-600'
                      }`} />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{call.ownerName}{call.petName ? ` (${call.petName})` : ''}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDuration(call.durationSeconds)} • {new Date(call.startedAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">{call.status}</Badge>
                    {call.followUpEmailSent && <Mail className="h-4 w-4 text-green-500" />}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI System Status</CardTitle>
            <CardDescription>Real-time clinic assistant performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 border border-green-200">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center">
                    <Stethoscope className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">Luna — Voice Assistant</p>
                    <p className="text-sm text-muted-foreground">Online and answering calls</p>
                  </div>
                </div>
                <Badge className="bg-green-500">Active</Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg border">
                  <p className="text-sm text-muted-foreground">Avg. Call Duration</p>
                  <p className="text-xl font-bold">{formatDuration(avgCallDuration)}</p>
                </div>
                <div className="p-3 rounded-lg border">
                  <p className="text-sm text-muted-foreground">Triage Accuracy</p>
                  <p className="text-xl font-bold">94%</p>
                </div>
                <div className="p-3 rounded-lg border">
                  <p className="text-sm text-muted-foreground">Booking Rate</p>
                  <p className="text-xl font-bold">87%</p>
                </div>
                <div className="p-3 rounded-lg border">
                  <p className="text-sm text-muted-foreground">Emergency Handoff</p>
                  <p className="text-xl font-bold">&lt;10s</p>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-muted">
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Clinic Hours</span>
                </div>
                <p className="text-sm text-muted-foreground">Mon-Fri: 8AM-7PM • Sat: 9AM-5PM • Sun: 10AM-3PM</p>
                <p className="text-sm text-green-600 mt-1">🤖 Luna available 24/7 — including emergency triage</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
