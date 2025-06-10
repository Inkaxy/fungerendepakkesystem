import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, ArrowLeft, Loader2, User } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/authStore';
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const {
    signIn,
    signUp,
    user,
    isAuthenticating
  } = useAuthStore();
  const navigate = useNavigate();

  // Demo credentials
  const demoCredentials = {
    email: 'demobakeri@gmail.com',
    password: 'Demo123'
  };
  const handleDemoLogin = () => {
    setEmail(demoCredentials.email);
    setPassword(demoCredentials.password);
    setActiveTab('login');
  };
  const handleDemoLoginAndSubmit = async () => {
    const {
      error
    } = await signIn(demoCredentials.email, demoCredentials.password);
    if (error) {
      toast.error(`Demo innlogging feilet: ${error.message}`);
    } else {
      toast.success('Demo innlogging vellykket!');
      navigate('/dashboard');
    }
  };

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const {
      error
    } = await signIn(email, password);
    if (error) {
      toast.error(`Innlogging feilet: ${error.message}`);
    } else {
      toast.success('Innlogging vellykket!');
      navigate('/dashboard');
    }
  };
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const {
      error
    } = await signUp(email, password, name);
    if (error) {
      toast.error(`Registrering feilet: ${error.message}`);
    } else {
      toast.success('Registrering vellykket! Du kan nå logge inn.');
      setActiveTab('login');
      // Clear form
      setEmail('');
      setPassword('');
      setName('');
    }
  };
  return <div className="min-h-screen flex items-center justify-center p-4 gradient-bread-subtle">
      <div className="w-full max-w-md">
        {/* Back to home link */}
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center text-bakery-brown hover:text-bakery-orange transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Tilbake til forsiden
          </Link>
        </div>

        <Card className="border-0 shadow-xl">
          <CardHeader className="space-y-2 text-center pb-6">
            <div className="flex justify-center mb-4">
              <img src="/lovable-uploads/3406f920-0e02-4d94-ae46-754d24d13db4.png" alt="Loaf & Load" className="h-11w-auto" />
            </div>
            
            <CardDescription>Administrer ditt bakeri med vårt moderne pakkesystem</CardDescription>
          </CardHeader>

          <CardContent>
            {/* Demo Login Section */}
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="text-sm font-semibold text-blue-800 mb-2 flex items-center">
                <User className="h-4 w-4 mr-2" />
                Demo Innlogging
              </h3>
              <p className="text-xs text-blue-600 mb-3">
                Test systemet med forhåndsopprettede demo-legitimasjon
              </p>
              <div className="flex gap-2">
                <Button onClick={handleDemoLogin} variant="outline" size="sm" className="flex-1 text-xs border-blue-300 text-blue-700 hover:bg-blue-100">
                  Fyll inn demo-data
                </Button>
                <Button onClick={handleDemoLoginAndSubmit} size="sm" className="flex-1 text-xs bg-blue-600 hover:bg-blue-700 text-white" disabled={isAuthenticating}>
                  {isAuthenticating ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Logg inn som demo'}
                </Button>
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Logg Inn</TabsTrigger>
                <TabsTrigger value="register">Registrer</TabsTrigger>
              </TabsList>

              {/* Login Tab */}
              <TabsContent value="login" className="space-y-4">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-bakery-brown font-medium">
                      E-postadresse
                    </Label>
                    <Input id="email" type="email" placeholder="din@email.no" value={email} onChange={e => setEmail(e.target.value)} className="border-gray-300 focus:border-bakery-orange focus:ring-bakery-orange" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-bakery-brown font-medium">
                      Passord
                    </Label>
                    <div className="relative">
                      <Input id="password" type={showPassword ? "text" : "password"} placeholder="Ditt passord" value={password} onChange={e => setPassword(e.target.value)} className="border-gray-300 focus:border-bakery-orange focus:ring-bakery-orange pr-10" required />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-bakery-orange">
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <Button type="submit" className="w-full bg-bakery-orange hover:bg-bakery-orange-light text-white py-3 font-semibold" disabled={isAuthenticating}>
                    {isAuthenticating ? <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Logger inn...
                      </> : 'Logg inn'}
                  </Button>
                </form>
              </TabsContent>

              {/* Register Tab */}
              <TabsContent value="register" className="space-y-4">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reg-name" className="text-bakery-brown font-medium">
                      Navn
                    </Label>
                    <Input id="reg-name" type="text" placeholder="Ditt navn" value={name} onChange={e => setName(e.target.value)} className="border-gray-300 focus:border-bakery-orange focus:ring-bakery-orange" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reg-email" className="text-bakery-brown font-medium">
                      E-postadresse
                    </Label>
                    <Input id="reg-email" type="email" placeholder="din@email.no" value={email} onChange={e => setEmail(e.target.value)} className="border-gray-300 focus:border-bakery-orange focus:ring-bakery-orange" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reg-password" className="text-bakery-brown font-medium">
                      Passord
                    </Label>
                    <div className="relative">
                      <Input id="reg-password" type={showPassword ? "text" : "password"} placeholder="Minimum 6 tegn" value={password} onChange={e => setPassword(e.target.value)} className="border-gray-300 focus:border-bakery-orange focus:ring-bakery-orange pr-10" required minLength={6} />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-bakery-orange">
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <Button type="submit" className="w-full bg-bakery-orange hover:bg-bakery-orange-light text-white py-3 font-semibold" disabled={isAuthenticating}>
                    {isAuthenticating ? <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Registrerer...
                      </> : 'Opprett konto'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center text-sm text-gray-500">
              <p>
                Ved å registrere deg godtar du våre vilkår og betingelser
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>;
};
export default Login;