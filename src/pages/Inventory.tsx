import React, { useState } from 'react';
import { SidebarLayout } from '@/components/SidebarLayout';
import { useLanguage } from '@/hooks/useLanguage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Package, AlertTriangle, Edit, Trash } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import inventoryIcon from '@/assets/inventory-icon.png';

interface Product {
  id: number;
  name: string;
  stock: number;
  price: number;
  minStock: number;
  category: string;
}

export const Inventory: React.FC = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  // Mock data - replace with real data in production
  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: 'Rice (1kg)', stock: 45, price: 80, minStock: 20, category: 'Grains' },
    { id: 2, name: 'Oil (1L)', stock: 12, price: 150, minStock: 15, category: 'Cooking' },
    { id: 3, name: 'Sugar (1kg)', stock: 8, price: 45, minStock: 10, category: 'Sweeteners' },
    { id: 4, name: 'Tea (250g)', stock: 25, price: 120, minStock: 10, category: 'Beverages' },
    { id: 5, name: 'Wheat Flour (1kg)', stock: 30, price: 35, minStock: 15, category: 'Grains' },
    { id: 6, name: 'Milk (1L)', stock: 2, price: 50, minStock: 5, category: 'Dairy' },
  ]);

  const [newProduct, setNewProduct] = useState({
    name: '',
    stock: '',
    price: '',
    minStock: '',
    category: '',
  });

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lowStockProducts = products.filter(product => product.stock <= product.minStock);

  const handleAddProduct = () => {
    if (newProduct.name && newProduct.stock && newProduct.price) {
      const product: Product = {
        id: Date.now(),
        name: newProduct.name,
        stock: parseInt(newProduct.stock),
        price: parseFloat(newProduct.price),
        minStock: parseInt(newProduct.minStock) || 5,
        category: newProduct.category || 'General',
      };
      setProducts([...products, product]);
      setNewProduct({ name: '', stock: '', price: '', minStock: '', category: '' });
      setIsAddDialogOpen(false);
    }
  };

  const getStockStatus = (product: Product) => {
    if (product.stock <= product.minStock) {
      return { status: 'low', color: 'destructive' };
    } else if (product.stock <= product.minStock * 1.5) {
      return { status: 'medium', color: 'warning' };
    }
    return { status: 'good', color: 'success' };
  };

  return (
    <SidebarLayout showBackButton pageTitle={t('inventory.title')}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <img src={inventoryIcon} alt="Inventory" className="w-10 h-10" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">{t('inventory.title')}</h1>
              <p className="text-muted-foreground">Manage your product inventory</p>
            </div>
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="default" className="gap-2">
                <Plus className="h-4 w-4" />
                {t('inventory.addProduct')}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{t('inventory.addProduct')}</DialogTitle>
                <DialogDescription>Add a new product to your inventory</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">{t('inventory.productName')}</Label>
                  <Input
                    id="name"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    placeholder="Enter product name"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="stock">{t('inventory.stock')}</Label>
                    <Input
                      id="stock"
                      type="number"
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="price">{t('inventory.price')} (₹)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="minStock">Min Stock</Label>
                    <Input
                      id="minStock"
                      type="number"
                      value={newProduct.minStock}
                      onChange={(e) => setNewProduct({ ...newProduct, minStock: e.target.value })}
                      placeholder="5"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                      placeholder="General"
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  {t('common.cancel')}
                </Button>
                <Button onClick={handleAddProduct}>
                  {t('common.save')}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Products</p>
                  <p className="text-2xl font-bold">{products.length}</p>
                </div>
                <Package className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t('dashboard.lowStock')}</p>
                  <p className="text-2xl font-bold text-warning">{lowStockProducts.length}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-warning" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Value</p>
                  <p className="text-2xl font-bold text-success">
                    ₹{products.reduce((sum, p) => sum + (p.stock * p.price), 0).toLocaleString()}
                  </p>
                </div>
                <div className="text-success">₹</div>
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

        {/* Products Table */}
        <Card>
          <CardHeader>
            <CardTitle>Products ({filteredProducts.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-medium">{t('inventory.productName')}</th>
                        <th className="hidden sm:table-cell text-left p-3 font-medium">Category</th>
                        <th className="text-left p-3 font-medium">{t('inventory.stock')}</th>
                        <th className="hidden md:table-cell text-left p-3 font-medium">{t('inventory.price')}</th>
                        <th className="hidden lg:table-cell text-left p-3 font-medium">Value</th>
                        <th className="hidden sm:table-cell text-left p-3 font-medium">Status</th>
                        <th className="text-left p-3 font-medium">{t('common.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => {
                    const stockStatus = getStockStatus(product);
                    return (
                      <tr key={product.id} className="border-b hover:bg-muted/50">
                        <td className="p-3 font-medium">{product.name}</td>
                        <td className="hidden sm:table-cell p-3 text-muted-foreground">{product.category}</td>
                        <td className="p-3">
                          <span className={`font-semibold ${
                            stockStatus.status === 'low' ? 'text-destructive' :
                            stockStatus.status === 'medium' ? 'text-warning' : 'text-success'
                          }`}>
                            {product.stock}
                          </span>
                          <span className="text-muted-foreground ml-1">units</span>
                        </td>
                        <td className="hidden md:table-cell p-3">₹{product.price}</td>
                        <td className="hidden lg:table-cell p-3 font-semibold">₹{(product.stock * product.price).toLocaleString()}</td>
                        <td className="hidden sm:table-cell p-3">
                          <Badge 
                            variant={stockStatus.color === 'success' ? 'default' : 'destructive'}
                            className={
                              stockStatus.color === 'warning' ? 'bg-warning text-warning-foreground' :
                              stockStatus.color === 'success' ? 'bg-success text-success-foreground' : ''
                            }
                          >
                            {stockStatus.status === 'low' ? 'Low Stock' :
                             stockStatus.status === 'medium' ? 'Medium' : 'Good'}
                          </Badge>
                        </td>
                        <td className="p-3">
                          <div className="flex flex-col sm:flex-row gap-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </SidebarLayout>
  );
};