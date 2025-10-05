import React, { useState } from 'react';
import { SidebarLayout } from '@/components/SidebarLayout';
import { useLanguage } from '@/hooks/useLanguage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, CreditCard, Smartphone, Banknote, Calendar, Filter, Edit, Trash2 } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import paymentsIcon from '@/assets/payments-icon.png';

interface Payment {
  id: number;
  customer: string;
  amount: number;
  method: 'cash' | 'upi' | 'card' | 'bank_transfer';
  date: string;
  time: string;
  status: 'completed' | 'pending' | 'failed';
  reference?: string;
}

export const Payments: React.FC = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMethod, setFilterMethod] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deletePaymentId, setDeletePaymentId] = useState<number | null>(null);
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
  
  const [payments, setPayments] = useState<Payment[]>([
    { 
      id: 1, 
      customer: 'राज पटेल', 
      amount: 1250, 
      method: 'upi', 
      date: '2024-01-22',
      time: '14:30',
      status: 'completed',
      reference: 'UPI12345678'
    },
    { 
      id: 2, 
      customer: 'Priya Singh', 
      amount: 850, 
      method: 'cash', 
      date: '2024-01-22',
      time: '13:15',
      status: 'completed'
    },
    { 
      id: 3, 
      customer: 'अमित शर्मा', 
      amount: 2100, 
      method: 'upi', 
      date: '2024-01-22',
      time: '12:45',
      status: 'completed',
      reference: 'UPI87654321'
    },
    { 
      id: 4, 
      customer: 'Neha Gupta', 
      amount: 450, 
      method: 'card', 
      date: '2024-01-21',
      time: '16:20',
      status: 'completed',
      reference: '****1234'
    },
    { 
      id: 5, 
      customer: 'सुरेश कुमार', 
      amount: 750, 
      method: 'upi', 
      date: '2024-01-21',
      time: '11:30',
      status: 'pending',
      reference: 'UPI11223344'
    },
  ]);

  const [newPayment, setNewPayment] = useState({
    customer: '',
    amount: '',
    method: 'cash' as Payment['method'],
    reference: '',
  });

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.reference?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterMethod === 'all' || payment.method === filterMethod;
    
    return matchesSearch && matchesFilter;
  });

  const handleAddPayment = () => {
    if (newPayment.customer && newPayment.amount) {
      const payment: Payment = {
        id: Date.now(),
        customer: newPayment.customer,
        amount: parseFloat(newPayment.amount),
        method: newPayment.method,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
        status: 'completed',
        reference: newPayment.reference || undefined,
      };
      setPayments([payment, ...payments]);
      setNewPayment({ customer: '', amount: '', method: 'cash', reference: '' });
      setIsAddDialogOpen(false);
    }
  };

  const handleEditPayment = () => {
    if (editingPayment) {
      setPayments(payments.map(p => 
        p.id === editingPayment.id ? editingPayment : p
      ));
      setIsEditDialogOpen(false);
      setEditingPayment(null);
    }
  };

  const handleDeletePayment = () => {
    if (deletePaymentId !== null) {
      setPayments(payments.filter(p => p.id !== deletePaymentId));
      setDeletePaymentId(null);
    }
  };

  const openEditDialog = (payment: Payment) => {
    setEditingPayment({ ...payment });
    setIsEditDialogOpen(true);
  };

  const getMethodIcon = (method: Payment['method']) => {
    switch (method) {
      case 'cash': return <Banknote className="h-4 w-4" />;
      case 'upi': return <Smartphone className="h-4 w-4" />;
      case 'card': return <CreditCard className="h-4 w-4" />;
      case 'bank_transfer': return <CreditCard className="h-4 w-4" />;
      default: return <Banknote className="h-4 w-4" />;
    }
  };

  const getMethodColor = (method: Payment['method']) => {
    switch (method) {
      case 'cash': return 'bg-success text-success-foreground';
      case 'upi': return 'bg-primary text-primary-foreground';
      case 'card': return 'bg-accent text-accent-foreground';
      case 'bank_transfer': return 'bg-secondary text-secondary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusColor = (status: Payment['status']) => {
    switch (status) {
      case 'completed': return 'bg-success text-success-foreground';
      case 'pending': return 'bg-warning text-warning-foreground';
      case 'failed': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const todayTotal = payments
    .filter(p => p.date === new Date().toISOString().split('T')[0] && p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const cashTotal = payments
    .filter(p => p.method === 'cash' && p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const digitalTotal = payments
    .filter(p => p.method !== 'cash' && p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <SidebarLayout showBackButton pageTitle={t('payments.title')}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <img src={paymentsIcon} alt="Payments" className="w-10 h-10" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">{t('payments.title')}</h1>
              <p className="text-muted-foreground">Track all your business transactions</p>
            </div>
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="default" className="gap-2">
                <Plus className="h-4 w-4" />
                {t('payments.addPayment')}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{t('payments.addPayment')}</DialogTitle>
                <DialogDescription>Record a new payment transaction</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="paymentCustomer">{t('customers.name')}</Label>
                  <Input
                    id="paymentCustomer"
                    value={newPayment.customer}
                    onChange={(e) => setNewPayment({ ...newPayment, customer: e.target.value })}
                    placeholder="Enter customer name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="paymentAmount">{t('payments.amount')} (₹)</Label>
                  <Input
                    id="paymentAmount"
                    type="number"
                    value={newPayment.amount}
                    onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="paymentMethod">{t('payments.method')}</Label>
                  <Select value={newPayment.method} onValueChange={(value) => setNewPayment({ ...newPayment, method: value as Payment['method'] })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">{t('payments.cash')}</SelectItem>
                      <SelectItem value="upi">UPI</SelectItem>
                      <SelectItem value="card">Card</SelectItem>
                      <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {newPayment.method !== 'cash' && (
                  <div className="grid gap-2">
                    <Label htmlFor="paymentReference">Reference ID (Optional)</Label>
                    <Input
                      id="paymentReference"
                      value={newPayment.reference}
                      onChange={(e) => setNewPayment({ ...newPayment, reference: e.target.value })}
                      placeholder="Transaction reference"
                    />
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  {t('common.cancel')}
                </Button>
                <Button onClick={handleAddPayment}>
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
              <DialogTitle>{t('common.edit')} Payment</DialogTitle>
              <DialogDescription>Update payment information</DialogDescription>
            </DialogHeader>
            {editingPayment && (
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="editCustomer">{t('customers.name')}</Label>
                  <Input
                    id="editCustomer"
                    value={editingPayment.customer}
                    onChange={(e) => setEditingPayment({ ...editingPayment, customer: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="editAmount">{t('payments.amount')} (₹)</Label>
                  <Input
                    id="editAmount"
                    type="number"
                    value={editingPayment.amount}
                    onChange={(e) => setEditingPayment({ ...editingPayment, amount: parseFloat(e.target.value) })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="editMethod">{t('payments.method')}</Label>
                  <Select value={editingPayment.method} onValueChange={(value) => setEditingPayment({ ...editingPayment, method: value as Payment['method'] })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">{t('payments.cash')}</SelectItem>
                      <SelectItem value="upi">UPI</SelectItem>
                      <SelectItem value="card">Card</SelectItem>
                      <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {editingPayment.method !== 'cash' && (
                  <div className="grid gap-2">
                    <Label htmlFor="editReference">Reference ID</Label>
                    <Input
                      id="editReference"
                      value={editingPayment.reference || ''}
                      onChange={(e) => setEditingPayment({ ...editingPayment, reference: e.target.value })}
                    />
                  </div>
                )}
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                {t('common.cancel')}
              </Button>
              <Button onClick={handleEditPayment}>
                {t('common.update')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <AlertDialog open={deletePaymentId !== null} onOpenChange={() => setDeletePaymentId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the payment record.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeletePayment} className="bg-destructive text-destructive-foreground">
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
                  <p className="text-sm text-muted-foreground">Today's Total</p>
                  <p className="text-2xl font-bold text-primary">₹{todayTotal.toLocaleString()}</p>
                </div>
                <Calendar className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t('payments.cash')} Total</p>
                  <p className="text-2xl font-bold text-success">₹{cashTotal.toLocaleString()}</p>
                </div>
                <Banknote className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t('payments.digital')} Total</p>
                  <p className="text-2xl font-bold text-accent">₹{digitalTotal.toLocaleString()}</p>
                </div>
                <Smartphone className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Transactions</p>
                  <p className="text-2xl font-bold">{payments.length}</p>
                </div>
                <CreditCard className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={t('common.search')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={filterMethod} onValueChange={setFilterMethod}>
            <SelectTrigger className="w-full sm:w-48">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Methods</SelectItem>
              <SelectItem value="cash">{t('payments.cash')}</SelectItem>
              <SelectItem value="upi">UPI</SelectItem>
              <SelectItem value="card">Card</SelectItem>
              <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Payments List */}
        <Card>
          <CardHeader>
            <CardTitle>Transactions ({filteredPayments.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredPayments.map((payment) => (
                <div key={payment.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors gap-3">
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className={`p-2 rounded-lg ${getMethodColor(payment.method)}`}>
                      {getMethodIcon(payment.method)}
                    </div>
                    <div>
                      <p className="font-semibold">{payment.customer}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{payment.date}</span>
                        <span>•</span>
                        <span>{payment.time}</span>
                        {payment.reference && (
                          <>
                            <span>•</span>
                            <span>{payment.reference}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between">
                    <div className="text-right">
                      <p className="text-xl font-bold text-success">₹{payment.amount.toLocaleString()}</p>
                      <Badge className={getStatusColor(payment.status)}>
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </Badge>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => openEditDialog(payment)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setDeletePaymentId(payment.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </SidebarLayout>
  );
};
