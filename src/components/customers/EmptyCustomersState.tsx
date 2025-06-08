
import React from 'react';
import { Button } from '@/components/ui/button';
import { UserPlus, Sparkles, Coffee } from 'lucide-react';

interface EmptyCustomersStateProps {
  onCreateCustomer: () => void;
}

const EmptyCustomersState = ({ onCreateCustomer }: EmptyCustomersStateProps) => {
  return (
    <div className="relative">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-amber-25 to-yellow-50 rounded-2xl -m-4" />
      
      <div className="relative text-center py-16 px-8">
        {/* Animated bakery icon */}
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-orange-200 to-amber-200 rounded-full flex items-center justify-center text-4xl animate-bounce shadow-lg">
              🏪
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-300 to-amber-300 rounded-full flex items-center justify-center animate-pulse">
              <Sparkles className="w-4 h-4 text-amber-700" />
            </div>
          </div>
        </div>
        
        <div className="space-y-4 max-w-md mx-auto">
          <h3 className="text-2xl font-bold text-gray-800 flex items-center justify-center space-x-2">
            <Coffee className="w-6 h-6 text-amber-600" />
            <span>Ingen kunder ennå</span>
          </h3>
          
          <p className="text-gray-600 leading-relaxed">
            Velkommen til din moderne kundeadministrasjon! 🎉
            <br />
            La oss starte reisen med å legge til din første kunde.
          </p>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-orange-100 space-y-3">
            <div className="text-sm text-gray-700 space-y-2">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                <span>📺 Automatisk display-konfigurasjon</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                <span>⚡ Moderne brukeropplevelse</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                <span>🎯 Skreddersydde løsninger</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8">
          <Button 
            onClick={onCreateCustomer}
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 px-8 py-3 text-lg"
          >
            <UserPlus className="mr-3 h-5 w-5" />
            Opprett din første kunde
          </Button>
        </div>
        
        <div className="mt-6 text-xs text-gray-500 flex items-center justify-center space-x-2">
          <Sparkles className="w-3 h-3" />
          <span>Kraftig og enkelt å bruke</span>
        </div>
      </div>
    </div>
  );
};

export default EmptyCustomersState;
