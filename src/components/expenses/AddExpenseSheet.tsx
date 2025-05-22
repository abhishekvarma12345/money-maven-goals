
import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import ExpenseForm from '@/components/ExpenseForm';

interface AddExpenseSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddExpenseSheet: React.FC<AddExpenseSheetProps> = ({ open, onOpenChange }) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>New Expense</SheetTitle>
          <SheetDescription>
            Add a new expense to your budget tracker
          </SheetDescription>
        </SheetHeader>
        <div className="mt-4">
          <ExpenseForm onSuccess={() => onOpenChange(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AddExpenseSheet;
