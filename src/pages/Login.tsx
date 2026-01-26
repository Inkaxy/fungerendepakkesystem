import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, ArrowLeft, Loader2, User, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/authStore';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const { signIn, signUp, user, isAuthenticating } = useAuthStore();
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
    const { error } = await signIn(demoCredentials.email, demoCredentials.password);
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
    const { error } = await signIn(email, password);
    if (error) {
      toast.error(`Innlogging feilet: ${error.message}`);
    } else {
      toast.success('Innlogging vellykket!');
      navigate('/dashboard');
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await signUp(email, password, name);
    if (error) {
      toast.error(`Registrering feilet: ${error.message}`);
    } else {
      toast.success('Registrering vellykket! Du kan nå logge inn.');
      setActiveTab('login');
      setEmail('');
      setPassword('');
      setName('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 gradient-warm">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-bakery-honey/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-bakery-wheat/30 rounded-full blur-2xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Back to home link */}
        <div className="mb-6">
          <Link 
            to="/" 
            className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Tilbake til forsiden
          </Link>
        </div>

        <Card className="border-0 shadow-bakery-xl bg-card/95 backdrop-blur-sm">
          <CardHeader className="space-y-2 text-center pb-6">
            <div className="flex justify-center mb-4">
              <img 
                src="/lovable-uploads/3406f920-0e02-4d94-ae46-754d24d13db4.png" 
                alt="Loaf & Load" 
                className="h-16 w-auto" 
              />
            </div>
            <CardDescription className="text-base">
              Administrer ditt bakeri med vårt moderne pakkesystem
            </CardDescription>
          </CardHeader>

          <CardContent>
            {/* Demo Login Section */}
            <div className="mb-6 p-4 rounded-xl bg-gradient-to-br from-primary/10 to-bakery-wheat/50 border border-primary/20">
              <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center">
                <Sparkles className="h-4 w-4 mr-2 text-primary" />
                Prøv Demo
              </h3>
              <p className="text-xs text-muted-foreground mb-3">
                Test systemet med forhåndsopprettede demo-legitimasjon
              </p>
              <div className="flex gap-2">
                <Button 
                  onClick={handleDemoLogin} 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 text-xs border-primary/30 hover:bg-primary/10"
                >
                  <User className="h-3 w-3 mr-1" />
                  Fyll inn demo-data
                </Button>
                <Button 
                  onClick={handleDemoLoginAndSubmit} 
                  size="sm" 
                  className="flex-1 text-xs" 
                  disabled={isAuthenticating}
                >
                  {isAuthenticating ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    'Logg inn som demo'
                  )}
                </Button>
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Logg Inn</TabsTrigger>
                <TabsTrigger value="register">Registrer</TabsTrigger>
              </TabsList>

              {/* Login Tab */}
              <TabsContent value="login" className="space-y-4">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-foreground font-medium">
                      E-postadresse
                    </Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="din@email.no" 
                      value={email} 
                      onChange={e => setEmail(e.target.value)} 
                      className="border-border focus:border-primary focus:ring-primary" 
                      required 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-foreground font-medium">
                      Passord
                    </Label>
                    <div className="relative">
                      <Input 
                        id="password" 
                        type={showPassword ? "text" : "password"} 
                        placeholder="Ditt passord" 
                        value={password} 
                        onChange={e => setPassword(e.target.value)} 
                        className="border-border focus:border-primary focus:ring-primary pr-10" 
                        required 
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)} 
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full py-3 font-semibold hover-lift" 
                    disabled={isAuthenticating}
                  >
                    {isAuthenticating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Logger inn...
                      </>
                    ) : (
                      'Logg inn'
                    )}
                  </Button>
                </form>
              </TabsContent>

              {/* Register Tab */}
              <TabsContent value="register" className="space-y-4">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reg-name" className="text-foreground font-medium">
                      Navn
                    </Label>
                    <Input 
                      id="reg-name" 
                      type="text" 
                      placeholder="Ditt navn" 
                      value={name} 
                      onChange={e => setName(e.target.value)} 
                      className="border-border focus:border-primary focus:ring-primary" 
                      required 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reg-email" className="text-foreground font-medium">
                      E-postadresse
                    </Label>
                    <Input 
                      id="reg-email" 
                      type="email" 
                      placeholder="din@email.no" 
                      value={email} 
                      onChange={e => setEmail(e.target.value)} 
                      className="border-border focus:border-primary focus:ring-primary" 
                      required 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reg-password" className="text-foreground font-medium">
                      Passord
                    </Label>
                    <div className="relative">
                      <Input 
                        id="reg-password" 
                        type={showPassword ? "text" : "password"} 
                        placeholder="Minimum 6 tegn" 
                        value={password} 
                        onChange={e => setPassword(e.target.value)} 
                        className="border-border focus:border-primary focus:ring-primary pr-10" 
                        required 
                        minLength={6} 
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)} 
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full py-3 font-semibold hover-lift" 
                    disabled={isAuthenticating}
                  >
                    {isAuthenticating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Registrerer...
                      </>
                    ) : (
                      'Opprett konto'
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              <p>
                Ved å registrere deg godtar du våre vilkår og betingelser
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
