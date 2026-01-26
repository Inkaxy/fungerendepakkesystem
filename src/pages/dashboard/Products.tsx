import React from 'react';
import { Package, Plus, Search, Filter, Trash2, Loader2, Edit, CheckCircle, Tag } from 'lucide-react';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useProducts, useCreateProduct, useDeleteProduct, useDeleteAllProducts, useUpdateProduct } from '@/hooks/useProducts';
import { useAuthStore } from '@/stores/authStore';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import EditProductDialog from '@/components/products/EditProductDialog';
import { Product } from '@/types/database';
import PageHeader from '@/components/shared/PageHeader';
import LoadingState from '@/components/shared/LoadingState';
import EmptyState from '@/components/shared/EmptyState';

const productSchema = z.object({
  name: z.string().min(1, 'Produktnavn er påkrevd'),
  category: z.string().min(1, 'Kategori er påkrevd'),
  price: z.number().min(0, 'Pris må være 0 eller høyere'),
  unit: z.string().min(1, 'Enhet er påkrevd'),
});

type ProductFormData = z.infer<typeof productSchema>;

const Products = () => {
  const { data: products, isLoading } = useProducts();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const deleteAllProducts = useDeleteAllProducts();
  const { profile } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      category: 'Ingen kategori',
      price: 0,
      unit: 'stk',
    },
  });

  const onSubmit = async (data: ProductFormData) => {
    if (!profile?.bakery_id) {
      toast.error('Du må tilhøre et bakeri for å opprette produkter');
      return;
    }

    try {
      await createProduct.mutateAsync({
        name: data.name,
        category: data.category,
        price: data.price,
        unit: data.unit,
        bakery_id: profile.bakery_id,
        is_active: true,
      });

      toast.success('Produkt opprettet');
      setIsCreateDialogOpen(false);
      form.reset();
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error('Feil ved opprettelse av produkt');
    }
  };

  const handleUpdateProduct = async (productData: Partial<Product> & { id: string }) => {
    await updateProduct.mutateAsync(productData);
  };

  const handleDeleteProduct = async (id: string) => {
    setDeletingProductId(id);
    try {
      await deleteProduct.mutateAsync(id);
    } finally {
      setDeletingProductId(null);
    }
  };

  const handleDeleteAllProducts = async () => {
    await deleteAllProducts.mutateAsync();
  };

  const filteredProducts = products?.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (product.product_number && product.product_number.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  }) || [];

  const categories = [...new Set(products?.map(p => p.category) || [])];
  const activeProducts = products?.filter(p => p.is_active) || [];

  if (isLoading) {
    return <LoadingState message="Laster produkter..." icon={Package} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        icon={Package}
        title="Produkter"
        subtitle="Administrer produkter for ditt bakeri"
        actions={
          <div className="flex gap-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" disabled={!products || products.length === 0}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Slett alle
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Er du sikker?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Dette vil slette alle produkter permanent. Denne handlingen kan ikke angres.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Avbryt</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleDeleteAllProducts}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Slett alle
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="hover-lift">
                  <Plus className="h-4 w-4 mr-2" />
                  Nytt Produkt
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Opprett nytt produkt</DialogTitle>
                  <DialogDescription>
                    Legg til et nytt produkt i produktkatalogen
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Produktnavn</FormLabel>
                          <FormControl>
                            <Input placeholder="F.eks. Rundstykker" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Kategori</FormLabel>
                          <FormControl>
                            <Input placeholder="F.eks. Brød" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pris (kr)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              step="0.01" 
                              placeholder="0.00" 
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="unit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Enhet</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Velg enhet" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="stk">Stykk</SelectItem>
                              <SelectItem value="kg">Kilogram</SelectItem>
                              <SelectItem value="g">Gram</SelectItem>
                              <SelectItem value="l">Liter</SelectItem>
                              <SelectItem value="dl">Desiliter</SelectItem>
                              <SelectItem value="pakke">Pakke</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-end space-x-2">
                      <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                        Avbryt
                      </Button>
                      <Button type="submit" disabled={createProduct.isPending}>
                        {createProduct.isPending ? 'Oppretter...' : 'Opprett'}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Totale produkter</p>
              <p className="text-2xl font-bold text-foreground">{products?.length || 0}</p>
            </div>
            <div className="stat-card-icon">
              <Package className="h-5 w-5 text-primary" />
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Aktive produkter</p>
              <p className="text-2xl font-bold text-foreground">{activeProducts.length}</p>
            </div>
            <div className="stat-card-icon">
              <CheckCircle className="h-5 w-5 text-primary" />
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Kategorier</p>
              <p className="text-2xl font-bold text-foreground">{categories.length}</p>
            </div>
            <div className="stat-card-icon">
              <Tag className="h-5 w-5 text-primary" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card className="card-warm">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Søk etter produkter eller varenummer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Alle kategorier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle kategorier</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category || 'uncategorized'}>
                    {category || 'Ukategorisert'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card className="card-warm">
        <CardHeader>
          <CardTitle>Produkt Oversikt</CardTitle>
          <CardDescription>
            Alle produkter i produktkatalogen
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredProducts.length === 0 ? (
            <EmptyState
              icon={Package}
              title="Ingen produkter funnet"
              description={
                searchTerm || categoryFilter !== 'all' 
                  ? 'Prøv å endre søkekriteriene dine'
                  : 'Kom i gang ved å legge til ditt første produkt'
              }
              action={
                !searchTerm && categoryFilter === 'all' 
                  ? { label: 'Legg til produkt', onClick: () => setIsCreateDialogOpen(true), icon: Plus }
                  : undefined
              }
            />
          ) : (
            <div className="rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Varenummer</TableHead>
                    <TableHead>Navn</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Pris</TableHead>
                    <TableHead>Enhet</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Opprettet</TableHead>
                    <TableHead className="text-right">Handlinger</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product, index) => (
                    <TableRow 
                      key={product.id} 
                      className={index % 2 === 0 ? 'bg-card' : 'bg-muted/30'}
                    >
                      <TableCell className="font-medium text-muted-foreground">
                        {product.product_number || '-'}
                      </TableCell>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-bakery-wheat/50">
                          {product.category || 'Ukategorisert'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {product.price ? `${product.price} kr` : 'Ikke satt'}
                      </TableCell>
                      <TableCell>{product.unit}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={product.is_active ? "default" : "secondary"}
                          className={product.is_active ? "bg-success/10 text-success border-success/20" : ""}
                        >
                          {product.is_active ? "Aktiv" : "Inaktiv"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(product.created_at).toLocaleDateString('nb-NO')}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setEditingProduct(product)}
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Rediger
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                disabled={deletingProductId === product.id}
                              >
                                {deletingProductId === product.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Trash2 className="w-4 h-4" />
                                )}
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Slett produkt</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Er du sikker på at du vil slette produktet "{product.name}"? 
                                  Denne handlingen kan ikke angres.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Avbryt</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleDeleteProduct(product.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Slett
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      {editingProduct && (
        <EditProductDialog 
          product={editingProduct}
          open={!!editingProduct}
          onOpenChange={() => setEditingProduct(null)}
          onSubmit={handleUpdateProduct}
          isLoading={updateProduct.isPending}
        />
      )}
    </div>
  );
};

export default Products;
