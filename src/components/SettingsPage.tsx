
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Settings, Save, Loader2, Moon, Sun, Palette } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { getUserSettings, updateUserSettings, CURRENCY_SYMBOLS } from '@/lib/settings';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/components/ThemeProvider';

const SettingsPage: React.FC = () => {
  const [selectedCurrency, setSelectedCurrency] = useState('EUR');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        const settings = await getUserSettings(user.id);
        if (settings) {
          setSelectedCurrency(settings.currency);
        }
        setLoading(false);
      } else {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleSaveSettings = async () => {
    if (!userId) {
      toast({
        title: "Error",
        description: "You must be logged in to update settings.",
        variant: "destructive",
      });
      return;
    }

    try {
      setSaving(true);
      const updated = await updateUserSettings(userId, {
        currency: selectedCurrency
      });
      
      if (updated) {
        toast({
          title: "Success",
          description: "Settings updated successfully.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update settings: " + error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold tracking-tight truncate">Settings</h2>
        <p className="text-muted-foreground">Manage your account settings and preferences.</p>
      </div>

      {/* Appearance Settings */}
      <Card className="card-hover">
        <CardHeader className="border-b pb-3">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-accent" />
            <CardTitle>Appearance</CardTitle>
          </div>
          <CardDescription>Customize the look and feel of the application</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Theme</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                  variant={theme === 'light' ? "default" : "outline"}
                  className={`flex justify-between items-center h-auto py-4 px-6`}
                  onClick={() => setTheme('light')}
                >
                  <div className="flex items-center gap-3">
                    <Sun className="h-5 w-5" />
                    <div className="text-left">
                      <h4 className="text-sm font-medium">Light</h4>
                      <p className="text-xs text-muted-foreground">Light mode interface</p>
                    </div>
                  </div>
                  {theme === 'light' && <div className="h-2 w-2 rounded-full bg-primary-foreground"></div>}
                </Button>
                
                <Button 
                  variant={theme === 'dark' ? "default" : "outline"}
                  className={`flex justify-between items-center h-auto py-4 px-6`}
                  onClick={() => setTheme('dark')}
                >
                  <div className="flex items-center gap-3">
                    <Moon className="h-5 w-5" />
                    <div className="text-left">
                      <h4 className="text-sm font-medium">Dark</h4>
                      <p className="text-xs text-muted-foreground">Dark mode interface</p>
                    </div>
                  </div>
                  {theme === 'dark' && <div className="h-2 w-2 rounded-full bg-primary-foreground"></div>}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Currency Settings */}
      <Card className="card-hover">
        <CardHeader className="border-b pb-3">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-accent" />
            <CardTitle>Currency Settings</CardTitle>
          </div>
          <CardDescription>Choose the currency to use across the application.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <RadioGroup 
            value={selectedCurrency} 
            onValueChange={setSelectedCurrency} 
            className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="EUR" id="eur" />
              <Label htmlFor="eur" className="flex items-center">
                <span className="text-lg font-medium mr-2">€</span>
                <span>Euro (EUR)</span>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="USD" id="usd" />
              <Label htmlFor="usd" className="flex items-center">
                <span className="text-lg font-medium mr-2">$</span>
                <span>US Dollar (USD)</span>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="GBP" id="gbp" />
              <Label htmlFor="gbp" className="flex items-center">
                <span className="text-lg font-medium mr-2">£</span>
                <span>British Pound (GBP)</span>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="JPY" id="jpy" />
              <Label htmlFor="jpy" className="flex items-center">
                <span className="text-lg font-medium mr-2">¥</span>
                <span>Japanese Yen (JPY)</span>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="CAD" id="cad" />
              <Label htmlFor="cad" className="flex items-center">
                <span className="text-lg font-medium mr-2">C$</span>
                <span>Canadian Dollar (CAD)</span>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="AUD" id="aud" />
              <Label htmlFor="aud" className="flex items-center">
                <span className="text-lg font-medium mr-2">A$</span>
                <span>Australian Dollar (AUD)</span>
              </Label>
            </div>
          </RadioGroup>

          <Separator className="my-6" />

          <div className="flex justify-end">
            <Button onClick={handleSaveSettings} disabled={saving} className="relative overflow-hidden group">
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Settings
                  <span className="absolute inset-0 w-full translate-x-[-100%] bg-white/10 transition-transform duration-300 group-hover:translate-x-[100%]"></span>
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
