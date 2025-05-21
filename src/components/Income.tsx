
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { getUserSettings } from '@/lib/settings';
import { Briefcase, PlusCircle, DollarSign, Trash2, Loader2, Wallet } from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface IncomeStream {
  id: string;
  source: string;
  amount: number;
  frequency: string;
  created_at: string;
}

const Income: React.FC = () => {
  const [incomeStreams, setIncomeStreams] = useState<IncomeStream[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [isAddingIncome, setIsAddingIncome] = useState(false);
  const [newIncomeSource, setNewIncomeSource] = useState('');
  const [newIncomeAmount, setNewIncomeAmount] = useState('');
  const [newIncomeFrequency, setNewIncomeFrequency] = useState('monthly');
  const [currencySymbol, setCurrencySymbol] = useState('€');
  const [totalMonthly, setTotalMonthly] = useState(0);
  const [totalAnnual, setTotalAnnual] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        fetchIncomeStreams(user.id);
        const settings = await getUserSettings(user.id);
        if (settings) {
          const symbol = settings.currency === 'EUR' ? '€' : 
                        settings.currency === 'USD' ? '$' : 
                        settings.currency === 'GBP' ? '£' : '$';
          setCurrencySymbol(symbol);
        }
      } else {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    // Calculate totals
    let monthly = 0;
    let annual = 0;

    incomeStreams.forEach(stream => {
      const amount = parseFloat(stream.amount as any);
      if (stream.frequency === 'monthly') {
        monthly += amount;
        annual += amount * 12;
      } else if (stream.frequency === 'annual') {
        annual += amount;
        monthly += amount / 12;
      } else if (stream.frequency === 'weekly') {
        monthly += amount * 4.33; // Average weeks in a month
        annual += amount * 52;
      } else if (stream.frequency === 'daily') {
        monthly += amount * 30.42; // Average days in a month
        annual += amount * 365;
      }
    });

    setTotalMonthly(monthly);
    setTotalAnnual(annual);
  }, [incomeStreams]);

  const fetchIncomeStreams = async (userId: string) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('income_streams')
        .select('*')
        .eq('user_id', userId);
        
      if (error) throw error;
      
      setIncomeStreams(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch income streams: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddIncome = async () => {
    if (!userId) {
      toast({
        title: "Error",
        description: "You must be logged in to add income streams.",
        variant: "destructive",
      });
      return;
    }

    if (!newIncomeSource || !newIncomeAmount) {
      toast({
        title: "Error",
        description: "Please enter both source and amount.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('income_streams')
        .insert({
          user_id: userId,
          source: newIncomeSource,
          amount: parseFloat(newIncomeAmount),
          frequency: newIncomeFrequency
        });
        
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Income stream added successfully.",
      });
      
      // Reset form and refetch income streams
      setNewIncomeSource('');
      setNewIncomeAmount('');
      setNewIncomeFrequency('monthly');
      setIsAddingIncome(false);
      
      if (userId) {
        fetchIncomeStreams(userId);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to add income stream: " + error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteIncome = async (id: string) => {
    try {
      const { error } = await supabase
        .from('income_streams')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Income stream deleted successfully.",
      });
      
      // Update the local state
      setIncomeStreams(incomeStreams.filter(stream => stream.id !== id));
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete income stream: " + error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Income</h2>
          <p className="text-muted-foreground">Track your income sources and plan your budget.</p>
        </div>
        <Sheet open={isAddingIncome} onOpenChange={setIsAddingIncome}>
          <SheetTrigger asChild>
            <Button className="flex items-center gap-2">
              <PlusCircle size={16} />
              <span>Add Income</span>
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Add Income Stream</SheetTitle>
              <SheetDescription>
                Add a new source of income to track your finances
              </SheetDescription>
            </SheetHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="source">Source</Label>
                <Input
                  id="source"
                  value={newIncomeSource}
                  onChange={e => setNewIncomeSource(e.target.value)}
                  placeholder="e.g. Salary, Freelance, Investments"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount ({currencySymbol})</Label>
                <Input
                  id="amount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={newIncomeAmount}
                  onChange={e => setNewIncomeAmount(e.target.value)}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="frequency">Frequency</Label>
                <Select 
                  value={newIncomeFrequency} 
                  onValueChange={setNewIncomeFrequency}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="annual">Annual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full mt-4" onClick={handleAddIncome}>
                Save Income
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Income Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <Wallet size={16} className="text-blue-600" />
              </div>
              <CardTitle className="text-lg">Monthly Income</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{currencySymbol}{totalMonthly.toFixed(2)}</div>
            <p className="text-sm text-gray-500 mt-1">Combined monthly income from all sources</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <DollarSign size={16} className="text-green-600" />
              </div>
              <CardTitle className="text-lg">Annual Income</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{currencySymbol}{totalAnnual.toFixed(2)}</div>
            <p className="text-sm text-gray-500 mt-1">Projected annual income from all sources</p>
          </CardContent>
        </Card>
      </div>

      {loading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map(i => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {incomeStreams.length > 0 ? (
            <>
              <h3 className="text-xl font-semibold">Income Sources</h3>
              <div className="grid gap-4">
                {incomeStreams.map(stream => (
                  <Card key={stream.id} className="card-hover">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <Briefcase size={16} className="text-blue-600" />
                          </div>
                          <CardTitle className="text-lg">{stream.source}</CardTitle>
                        </div>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Trash2 size={16} className="text-gray-500 hover:text-red-500" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Delete Income Stream</DialogTitle>
                              <DialogDescription>
                                Are you sure you want to delete this income stream? This action cannot be undone.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="flex justify-end gap-2 mt-4">
                              <Button variant="outline">Cancel</Button>
                              <Button 
                                variant="destructive" 
                                onClick={() => handleDeleteIncome(stream.id)}
                              >
                                Delete
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-2xl font-bold">{currencySymbol}{parseFloat(stream.amount as any).toFixed(2)}</div>
                          <div className="text-sm text-gray-500 capitalize">{stream.frequency}</div>
                        </div>
                        <div className="text-right">
                          {stream.frequency === 'monthly' ? (
                            <div className="text-sm text-gray-500">{currencySymbol}{(parseFloat(stream.amount as any) * 12).toFixed(2)} / year</div>
                          ) : stream.frequency === 'annual' ? (
                            <div className="text-sm text-gray-500">{currencySymbol}{(parseFloat(stream.amount as any) / 12).toFixed(2)} / month</div>
                          ) : stream.frequency === 'weekly' ? (
                            <div className="text-sm text-gray-500">{currencySymbol}{(parseFloat(stream.amount as any) * 4.33).toFixed(2)} / month</div>
                          ) : (
                            <div className="text-sm text-gray-500">{currencySymbol}{(parseFloat(stream.amount as any) * 30).toFixed(2)} / month</div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-10">
              <div className="mx-auto w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <Wallet size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">No income sources yet</h3>
              <p className="text-gray-500 mb-4">Add your income sources to get a complete view of your finances.</p>
              <Button onClick={() => setIsAddingIncome(true)}>
                <PlusCircle size={16} className="mr-2" />
                Add Your First Income Source
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Income;
