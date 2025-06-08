
import React from 'react';
import { Button } from '@/components/ui/button';
import { UserPlus, Trash2, Sparkles } from 'lucide-react';
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

interface CustomersHeaderProps {
  customersCount: number;
  onCreateCustomer: () => void;
  onDeleteAllCustomers: () => void;
}

const CustomersHeader = ({ customersCount, onCreateCustomer, onDeleteAllCustomers }: CustomersHeaderProps) => {
  return (
    <div className="relative">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-100 via-amber-50 to-yellow-100 rounded-2xl -m-2" />
      
      <div className="relative bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-orange-200 shadow-sm">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-amber-500 rounded-xl flex items-center justify-center text-white text-2xl shadow-lg">
                🏪
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                  Kundeadministrasjon
                </h1>
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <p className="text-gray-600 font-medium">
                    Moderne display-løsninger for optimal kundeopplevelse
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 mt-3">
              <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                📊 {customersCount} kunder totalt
              </div>
              <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                ✨ Neste generasjon bakeri-tech
              </div>
            </div>
          </div>
          
          <div className="flex gap-3">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="outline" 
                  disabled={customersCount === 0}
                  className="bg-white/70 hover:bg-red-50 border-red-200 text-red-600 hover:text-red-700 shadow-sm"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Slett alle
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="border-2 border-red-100">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-red-800 flex items-center space-x-2">
                    <span className="text-2xl">⚠️</span>
                    <span>Er du sikker?</span>
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-gray-600 space-y-2">
                    <p>Dette vil slette <strong>alle {customersCount} kunder</strong> permanent.</p>
                    <p className="text-red-600 font-medium">🚨 Denne handlingen kan ikke angres!</p>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="hover:bg-gray-50">Avbryt</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={onDeleteAllCustomers}
                    className="bg-red-500 text-white hover:bg-red-600"
                  >
                    Slett alle kunder
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            
            <Button 
              onClick={onCreateCustomer}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Ny Kunde
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomersHeader;
