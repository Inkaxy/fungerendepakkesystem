
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // TODO: Implement actual login when Supabase is connected
    setTimeout(() => {
      if (email && password) {
        toast.success('Innlogging vellykket!');
        navigate('/dashboard');
      } else {
        toast.error('Vennligst fyll ut alle feltene');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 gradient-bread-subtle">
      <div className="w-full max-w-md">
        {/* Back to home link */}
        <div className="mb-6">
          <Link 
            to="/"
            className="inline-flex items-center text-bakery-brown hover:text-bakery-orange transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Tilbake til forsiden
          </Link>
        </div>

        <Card className="border-0 shadow-xl">
          <CardHeader className="space-y-2 text-center pb-6">
            <div className="flex justify-center mb-4">
              <img 
                src="/lovable-uploads/3406f920-0e02-4d94-ae46-754d24d13db4.png" 
                alt="Loaf & Load"
                className="h-20 w-auto"
              />
            </div>
            <CardTitle className="text-2xl font-bold text-bakery-brown">
              Velkommen tilbake
            </CardTitle>
            <CardDescription>
              Logg inn for å administrere ditt bakeri
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-bakery-brown font-medium">
                  E-postadresse
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="din@email.no"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-gray-300 focus:border-bakery-orange focus:ring-bakery-orange"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-bakery-brown font-medium">
                  Passord
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Ditt passord"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-gray-300 focus:border-bakery-orange focus:ring-bakery-orange pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-bakery-orange"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 text-sm">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 text-bakery-orange border-gray-300 rounded focus:ring-bakery-orange"
                  />
                  <span className="text-gray-600">Husk meg</span>
                </label>
                <Link 
                  to="/forgot-password"
                  className="text-sm text-bakery-orange hover:text-bakery-orange-light"
                >
                  Glemt passord?
                </Link>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-bakery-orange hover:bg-bakery-orange-light text-white py-3 font-semibold"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Logger inn...</span>
                  </div>
                ) : (
                  'Logg inn'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Har du ikke en konto?{' '}
                <Link 
                  to="/contact"
                  className="text-bakery-orange hover:text-bakery-orange-light font-medium"
                >
                  Kontakt oss
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            For å få tilgang til systemet, vennligst kontakt din administrator
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
