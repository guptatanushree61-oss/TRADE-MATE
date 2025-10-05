import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarLayout } from '@/components/SidebarLayout';
import { useLanguage } from '@/hooks/useLanguage';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  Package, 
  Users, 
  CreditCard, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  Clock,
  Target,
  Star,
  Plus,
  ShoppingCart,
  FileText
} from 'lucide-react';
import AssistantWidget from '@/components/AssistantWidget';

const Index = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const quickActions = [
    {
      title: t('inventory.addProduct'),
      description: 'Add new products to your inventory',
      icon: Package,
      path: '/inventory',
      color: 'bg-blue-500'
    },
    {
      title: t('customers.addCustomer'),
      description: 'Register new customers',
      icon: Users,
      path: '/customers',
      color: 'bg-green-500'
    },
    {
      title: t('payments.addTransaction'),
      description: 'Record new transactions',
      icon: CreditCard,
      path: '/payments',
      color: 'bg-purple-500'
    },
    {
      title: t('nav.reports'),
      description: 'View business reports',
      icon: FileText,
      path: '/reports',
      color: 'bg-orange-500'
    }
  ];

  const todayStats = [
    { label: t('dashboard.todaySales'), value: '₹12,450', change: '+12%', icon: TrendingUp, trend: 'up' },
    { label: t('dashboard.totalCustomers'), value: '248', change: '+5', icon: Users, trend: 'up' },
    { label: t('home.inventory.totalProducts'), value: '156', change: '-2', icon: Package, trend: 'down' },
    { label: t('payments.title'), value: '24', change: '+8', icon: CreditCard, trend: 'up' }
  ];

  const recentActivity = [
    { action: 'New order received', time: '5 min ago', status: 'success' },
    { action: 'Low stock alert for Rice', time: '10 min ago', status: 'warning' },
    { action: 'Payment received ₹2,500', time: '15 min ago', status: 'success' },
    { action: 'New customer registered', time: '1 hour ago', status: 'info' },
    { action: 'Inventory updated', time: '2 hours ago', status: 'success' }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertCircle className="h-4 w-4 text-orange-500" />;
      case 'info': return <Clock className="h-4 w-4 text-blue-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <>
    <SidebarLayout pageTitle={t('home.welcome')}>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-primary rounded-2xl p-8 text-white">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-bold mb-2">{t('home.welcome')}</h1>
            <p className="text-white/90 text-lg">{t('home.subtitle')}</p>
            <div className="flex gap-3 mt-6">
              <Button 
                variant="secondary" 
                className="bg-white text-primary hover:bg-white/90"
                onClick={() => navigate('/dashboard')}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                {t('nav.dashboard')}
              </Button>
              <Button 
                variant="secondary" 
                className="bg-white text-primary hover:bg-white/90"
                onClick={() => navigate('/inventory')}
              >
                <Package className="h-4 w-4 mr-2" />
                {t('nav.inventory')}
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              {t('home.quickActions')}
            </CardTitle>
            <CardDescription>Get started with these common tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action) => (
                <Card 
                  key={action.path}
                  className="cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-105"
                  onClick={() => navigate(action.path)}
                >
                  <CardContent className="p-4">
                    <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center mb-3`}>
                      <action.icon className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="font-semibold mb-1">{action.title}</h3>
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Today's Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>{t('home.todayStats')}</CardTitle>
              <CardDescription>Your business performance today</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {todayStats.map((stat) => (
                <div key={stat.label} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <stat.icon className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </div>
                  </div>
                  <Badge variant={stat.trend === 'up' ? 'default' : 'secondary'}>
                    {stat.change}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>{t('home.recentActivity')}</CardTitle>
              <CardDescription>Latest updates from your business</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50">
                    {getStatusIcon(activity.status)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Business Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Target className="h-4 w-4" />
                {t('home.salesTarget')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>₹45,000 / ₹60,000</span>
                  <span>75%</span>
                </div>
                <Progress value={75} className="h-2" />
                <p className="text-xs text-muted-foreground">15 days remaining</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Package className="h-4 w-4" />
                {t('home.inventory.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{t('home.inventory.totalProducts')}</span>
                  <span className="font-medium">156</span>
                </div>
                <div className="flex justify-between text-sm text-orange-600">
                  <span>{t('home.inventory.lowStock')}</span>
                  <span className="font-medium">5</span>
                </div>
                <div className="flex justify-between text-sm text-red-600">
                  <span>{t('home.inventory.outOfStock')}</span>
                  <span className="font-medium">2</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Star className="h-4 w-4" />
                {t('home.customerSatisfaction')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">4.8</div>
                <div className="flex justify-center gap-1 my-1">
                  {[1,2,3,4,5].map((star) => (
                    <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">Based on 124 reviews</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Start Guide */}
        <Card>
          <CardHeader>
            <CardTitle>{t('home.quickStart.title')}</CardTitle>
            <CardDescription>New to TradeMate? Follow these steps to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { step: 1, title: t('home.quickStart.step1'), completed: true },
                { step: 2, title: t('home.quickStart.step2'), completed: true },
                { step: 3, title: t('home.quickStart.step3'), completed: false },
                { step: 4, title: t('home.quickStart.step4'), completed: false }
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    item.completed ? 'bg-green-500 text-white' : 'bg-muted text-muted-foreground'
                  }`}>
                    {item.completed ? <CheckCircle className="h-4 w-4" /> : item.step}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{item.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <AssistantWidget />
      </div>
    </SidebarLayout>
    </>
  );
};

export default Index;
