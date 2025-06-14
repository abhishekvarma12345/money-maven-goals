
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Settings, Save, Loader2, Moon, Sun, Palette } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { getUserSettings, updateUserSettings } from '@/lib/settings';
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

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
  };

  const handleCurrencySelect = (currency: string) => {
    setSelectedCurrency(currency);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-6 w-full">
        <h2 className="text-3xl font-bold tracking-tight mb-1 break-words text-foreground">Settings</h2>
        <p className="text-muted-foreground">Manage your account settings and preferences.</p>
      </div>

      {/* Appearance Settings */}
      <Card>
        <CardHeader className="border-b pb-3">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-primary" />
            <CardTitle>Appearance</CardTitle>
          </div>
          <CardDescription>Customize the look and feel of the application</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Theme</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button 
                  className={`relative overflow-hidden rounded-md transition-all duration-200 hover:scale-105 ${
                    theme === 'light' ? 'theme-card-selected' : 'border border-border'
                  }`}
                  onClick={() => handleThemeChange('light')}
                >
                  <div className="flex items-center gap-3 bg-white p-4">
                    <Sun className="h-5 w-5 text-yellow-500" />
                    <div className="text-left">
                      <h4 className="text-sm font-medium text-gray-900">Light</h4>
                      <p className="text-xs text-gray-600">Light mode interface</p>
                    </div>
                    {theme === 'light' && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-primary"></div>
                    )}
                  </div>
                </button>
                
                <button 
                  className={`relative overflow-hidden rounded-md transition-all duration-200 hover:scale-105 ${
                    theme === 'dark' ? 'theme-card-selected' : 'border border-border'
                  }`}
                  onClick={() => handleThemeChange('dark')}
                >
                  <div className="flex items-center gap-3 bg-gray-900 p-4">
                    <Moon className="h-5 w-5 text-indigo-400" />
                    <div className="text-left">
                      <h4 className="text-sm font-medium text-gray-100">Dark</h4>
                      <p className="text-xs text-gray-400">Dark mode interface</p>
                    </div>
                    {theme === 'dark' && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-primary"></div>
                    )}
                  </div>
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Currency Settings */}
      <Card>
        <CardHeader className="border-b pb-3">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" />
            <CardTitle>Currency Settings</CardTitle>
          </div>
          <CardDescription>Choose the currency to use across the application.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries({
              "EUR": { symbol: "€", name: "Euro (EUR)" },
              "USD": { symbol: "$", name: "US Dollar (USD)" },
              "GBP": { symbol: "£", name: "British Pound (GBP)" },
              "JPY": { symbol: "¥", name: "Japanese Yen (JPY)" },
              "CAD": { symbol: "C$", name: "Canadian Dollar (CAD)" },
              "AUD": { symbol: "A$", name: "Australian Dollar (AUD)" }
            }).map(([code, { symbol, name }]) => (
              <button 
                key={code} 
                className={`flex items-center space-x-2 p-3 rounded-md border transition-all duration-200 hover:scale-105 ${
                  selectedCurrency === code ? 'currency-card-selected' : 'border-border'
                }`}
                onClick={() => handleCurrencySelect(code)}
              >
                <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${
                  selectedCurrency === code ? 'border-primary bg-primary' : 'border-muted-foreground'
                }`}>
                  {selectedCurrency === code && (
                    <div className="h-2 w-2 rounded-full bg-primary-foreground"></div>
                  )}
                </div>
                <div className="flex items-center w-full">
                  <span className="text-lg font-medium mr-2">{symbol}</span>
                  <span>{name}</span>
                </div>
              </button>
            ))}
          </div>

          <Separator className="my-6" />

          <div className="flex justify-end">
            <Button 
              onClick={handleSaveSettings} 
              disabled={saving} 
              className="transition-all duration-200 hover:scale-105"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Settings
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
