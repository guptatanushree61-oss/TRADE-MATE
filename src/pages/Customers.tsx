import React, { useState } from 'react';
import { SidebarLayout } from '@/components/SidebarLayout';
import { useLanguage } from '@/hooks/useLanguage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Users, Phone, Mail, Calendar, Edit, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import customersIcon from '@/assets/customers-icon.png';

interface Customer {
  id: number;
  name: string;
  phone: string;
  email: string;
  visits: number;
  totalSpent: number;
  lastVisit: string;
  type: 'regular' | 'vip' | 'new';
}

export const Customers: React.FC = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deleteCustomerId, setDeleteCustomerId] = useState<number | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  
  const [customers, setCustomers] = useState<Customer[]>([
    { 
      id: 1, 
      name: 'राज पटेल', 
      phone: '+91 98765 43210', 
      email: 'raj.patel@email.com',
      visits: 25, 
      totalSpent: 45000, 
      lastVisit: '2024-01-20',
      type: 'vip'
    },
    { 
      id: 2, 
      name: 'Priya Singh', 
      phone: '+91 87654 32109', 
      email: 'priya.singh@email.com',
      visits: 12, 
      totalSpent: 18500, 
      lastVisit: '2024-01-18',
      type: 'regular'
    },
    { 
      id: 3, 
      name: 'अमित शर्मा', 
      phone: '+91 76543 21098', 
      email: 'amit.sharma@email.com',
      visits: 35, 
      totalSpent: 67000, 
      lastVisit: '2024-01-22',
      type: 'vip'
    },
    { 
      id: 4, 
      name: 'Neha Gupta', 
      phone: '+91 65432 10987', 
      email: 'neha.gupta@email.com',
      visits: 3, 
      totalSpent: 2400, 
      lastVisit: '2024-01-15',
      type: 'new'
    },
    { 
      id: 5, 
      name: 'सुरेश कुमार', 
      phone: '+91 54321 09876', 
      email: 'suresh.kumar@email.com',
      visits: 18, 
      totalSpent: 28000, 
      lastVisit: '2024-01-21',
      type: 'regular'
    },
  ]);

  const [newCustomer, setNewCustomer] = useState({
    name: '',
    phone: '',
    email: '',
  });

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCustomer = () => {
    if (newCustomer.name && newCustomer.phone) {
      const customer: Customer = {
        id: Date.now(),
        name: newCustomer.name,
        phone: newCustomer.phone,
        email: newCustomer.email,
        visits: 0,
        totalSpent: 0,
        lastVisit: new Date().toISOString().split('T')[0],
        type: 'new',
      };
      setCustomers([...customers, customer]);
      setNewCustomer({ name: '', phone: '', email: '' });
      setIsAddDialogOpen(false);
    }
  };

  const handleEditCustomer = () => {
    if (editingCustomer) {
      setCustomers(customers.map(c => 
        c.id === editingCustomer.id ? editingCustomer : c
      ));
      setIsEditDialogOpen(false);
      setEditingCustomer(null);
    }
  };

  const handleDeleteCustomer = () => {
    if (deleteCustomerId !== null) {
      setCustomers(customers.filter(c => c.id !== deleteCustomerId));
      setDeleteCustomerId(null);
    }
  };

  const openEditDialog = (customer: Customer) => {
    setEditingCustomer({ ...customer });
    setIsEditDialogOpen(true);
  };

  const getCustomerTypeColor = (type: Customer['type']) => {
    switch (type) {
      case 'vip': return 'bg-accent text-accent-foreground';
      case 'regular': return 'bg-primary text-primary-foreground';
      case 'new': return 'bg-secondary text-secondary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getCustomerTypeLabel = (type: Customer['type']) => {
    switch (type) {
      case 'vip': return 'VIP';
      case 'regular': return 'Regular';
      case 'new': return 'New';
      default: return 'Unknown';
    }
  };

  return (
    <SidebarLayout showBackButton pageTitle={t('customers.title')}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <img src={customersIcon} alt="Customers" className="w-10 h-10" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">{t('customers.title')}</h1>
              <p className="text-muted-foreground">Build relationships with your customers</p>
            </div>
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="default" className="gap-2">
                <Plus className="h-4 w-4" />
                {t('customers.addCustomer')}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{t('customers.addCustomer')}</DialogTitle>
                <DialogDescription>Add a new customer to your database</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="customerName">{t('customers.name')}</Label>
                  <Input
                    id="customerName"
                    value={newCustomer.name}
                    onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                    placeholder="Enter customer name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="customerPhone">{t('customers.phone')}</Label>
                  <Input
                    id="customerPhone"
                    value={newCustomer.phone}
                    onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="customerEmail">{t('customers.email')} (Optional)</Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    value={newCustomer.email}
                    onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                    placeholder="customer@email.com"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  {t('common.cancel')}
                </Button>
                <Button onClick={handleAddCustomer}>
                  {t('common.save')}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{t('common.edit')} Customer</DialogTitle>
              <DialogDescription>Update customer information</DialogDescription>
            </DialogHeader>
            {editingCustomer && (
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="editName">{t('customers.name')}</Label>
                  <Input
                    id="editName"
                    value={editingCustomer.name}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, name: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="editPhone">{t('customers.phone')}</Label>
                  <Input
                    id="editPhone"
                    value={editingCustomer.phone}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, phone: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="editEmail">{t('customers.email')}</Label>
                  <Input
                    id="editEmail"
                    type="email"
                    value={editingCustomer.email}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, email: e.target.value })}
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                {t('common.cancel')}
              </Button>
              <Button onClick={handleEditCustomer}>
                {t('common.update')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <AlertDialog open={deleteCustomerId !== null} onOpenChange={() => setDeleteCustomerId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the customer and all associated data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteCustomer} className="bg-destructive text-destructive-foreground">
                {t('common.delete')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Customers</p>
                  <p className="text-2xl font-bold">{customers.length}</p>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">VIP Customers</p>
                  <p className="text-2xl font-bold text-accent">{customers.filter(c => c.type === 'vip').length}</p>
                </div>
                <div className="text-accent">⭐</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">New This Month</p>
                  <p className="text-2xl font-bold text-secondary">{customers.filter(c => c.type === 'new').length}</p>
                </div>
                <div className="text-secondary">📈</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg. Visits</p>
                  <p className="text-2xl font-bold text-success">
                    {Math.round(customers.reduce((sum, c) => sum + c.visits, 0) / customers.length)}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder={t('common.search')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Customers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCustomers.map((customer) => (
            <Card key={customer.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{customer.name}</CardTitle>
                    <Badge className={`mt-1 ${getCustomerTypeColor(customer.type)}`}>
                      {getCustomerTypeLabel(customer.type)}
                    </Badge>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => openEditDialog(customer)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setDeleteCustomerId(customer.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{customer.phone}</span>
                  </div>
                  
                  {customer.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="truncate">{customer.email}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Last visit: {new Date(customer.lastVisit).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="pt-2 border-t">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-primary">{customer.visits}</p>
                        <p className="text-xs text-muted-foreground">{t('customers.visits')}</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-success">₹{customer.totalSpent.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Total Spent</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </SidebarLayout>
  );
};
