import React from 'react';
import { SidebarLayout } from '@/components/SidebarLayout';
import { useLanguage } from '@/hooks/useLanguage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, Users, Package, AlertTriangle, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { t } = useLanguage();

  // Mock data - replace with real data in production
  const stats = {
    todaySales: 15420,
    totalCustomers: 127,
    lowStockItems: 8,
    totalProducts: 45,
  };

  const recentTransactions = [
    { id: 1, customer: 'राज पटेल', amount: 1250, method: 'UPI', time: '2 hours ago' },
    { id: 2, customer: 'Priya Singh', amount: 850, method: 'Cash', time: '3 hours ago' },
    { id: 3, customer: 'अमित शर्मा', amount: 2100, method: 'UPI', time: '5 hours ago' },
  ];

  const lowStockProducts = [
    { name: 'Rice (1kg)', stock: 5, minStock: 20 },
    { name: 'Oil (1L)', stock: 3, minStock: 15 },
    { name: 'Sugar (1kg)', stock: 2, minStock: 10 },
  ];

  return (
    <SidebarLayout showBackButton pageTitle={t('dashboard.title')}>
      <div className="space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {t('dashboard.welcome')}
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening with your business today
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('dashboard.todaySales')}</CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">₹{stats.todaySales.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+12% from yesterday</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-secondary/5 to-secondary/10 border-secondary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('dashboard.totalCustomers')}</CardTitle>
              <Users className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary">{stats.totalCustomers}</div>
              <p className="text-xs text-muted-foreground">+3 new this week</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">{stats.totalProducts}</div>
              <p className="text-xs text-muted-foreground">Active in inventory</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-warning/5 to-warning/10 border-warning/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('dashboard.lowStock')}</CardTitle>
              <AlertTriangle className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">{stats.lowStockItems}</div>
              <p className="text-xs text-muted-foreground">Need attention</p>
            </CardContent>
          </Card>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Transactions */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{t('dashboard.recentTransactions')}</CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link to="/payments">View All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium">{transaction.customer}</p>
                      <p className="text-sm text-muted-foreground">{transaction.time}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-success">₹{transaction.amount}</p>
                      <p className="text-xs text-muted-foreground">{transaction.method}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Low Stock Alert */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-warning">{t('dashboard.lowStock')}</CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link to="/inventory">Manage Stock</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {lowStockProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-warning/5 border border-warning/20">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">Min: {product.minStock} units</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-warning">{product.stock} units</p>
                      <Button variant="outline" size="sm" className="mt-1">
                        <Plus className="h-3 w-3 mr-1" />
                        Restock
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" size="lg" className="h-auto p-6 justify-start" asChild>
              <Link to="/inventory" className="flex flex-col items-start gap-2">
                <Package className="h-6 w-6 text-primary" />
                <div>
                  <div className="font-semibold">{t('inventory.addProduct')}</div>
                  <div className="text-sm text-muted-foreground">Add new items to inventory</div>
                </div>
              </Link>
            </Button>

            <Button variant="outline" size="lg" className="h-auto p-6 justify-start" asChild>
              <Link to="/customers" className="flex flex-col items-start gap-2">
                <Users className="h-6 w-6 text-secondary" />
                <div>
                  <div className="font-semibold">{t('customers.addCustomer')}</div>
                  <div className="text-sm text-muted-foreground">Register new customer</div>
                </div>
              </Link>
            </Button>

            <Button variant="outline" size="lg" className="h-auto p-6 justify-start" asChild>
              <Link to="/payments" className="flex flex-col items-start gap-2">
                <TrendingUp className="h-6 w-6 text-accent" />
                <div>
                  <div className="font-semibold">{t('payments.addPayment')}</div>
                  <div className="text-sm text-muted-foreground">Record new transaction</div>
                </div>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
};