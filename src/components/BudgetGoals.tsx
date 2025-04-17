
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { sampleBudgetGoals, categoryColors } from '@/lib/data';
import { Home, Car, UtensilsCrossed, Lightbulb, Heart, Music, ShoppingBag, User, GraduationCap, Plane, MoreHorizontal } from 'lucide-react';

const BudgetGoals: React.FC = () => {
  // Map of category to icon component
  const iconMap = {
    housing: Home,
    transportation: Car,
    food: UtensilsCrossed,
    utilities: Lightbulb,
    healthcare: Heart,
    entertainment: Music,
    shopping: ShoppingBag,
    personal: User,
    education: GraduationCap,
    travel: Plane,
    other: MoreHorizontal,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Budget Goals</h2>
        <p className="text-muted-foreground">Track your spending against your budget targets.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sampleBudgetGoals.map((goal) => {
          const percentage = Math.round((goal.spent / goal.amount) * 100);
          const IconComponent = iconMap[goal.category];
          const progressColor = percentage > 90 ? 'bg-red-500' : percentage > 75 ? 'bg-yellow-500' : 'bg-green-500';
          
          return (
            <Card key={goal.id} className="card-hover">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${categoryColors[goal.category]}20` }}
                    >
                      <IconComponent size={16} style={{ color: categoryColors[goal.category] }} />
                    </div>
                    <CardTitle className="text-lg capitalize">{goal.category}</CardTitle>
                  </div>
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100">
                    {goal.period}
                  </span>
                </div>
                <CardDescription>Budget progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>${goal.spent} spent</span>
                    <span className="font-medium">${goal.amount} budget</span>
                  </div>
                  <Progress value={percentage} className={`h-2 ${progressColor}`} />
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>{percentage}% used</span>
                    <span>${goal.amount - goal.spent} remaining</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default BudgetGoals;
