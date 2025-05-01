import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { publicApi } from '../services/api';

import { Button } from '../components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../components/ui/form';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { toast } from '../components/ui/use-toast';

const formSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  password: z.string().min(1, {
    message: 'Password is required.',
  }),
});

export default function StudentLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      
      const response = await publicApi.post(
        '/api/students/login',
        values
      );

      console.log('Login response:', response.data);

      if (response.data.token) {
        // Store the token with Bearer prefix
        localStorage.setItem('studentToken', `Bearer ${response.data.token}`);
        
        // Store student info - make sure we have all the needed fields
        const studentInfo = {
          id: response.data.student.id,
          name: response.data.student.name,
          email: response.data.student.email,
          // Add other fields if available
          college: response.data.student.college || '',
          phone: response.data.student.phone || '',
        };
        
        localStorage.setItem('studentInfo', JSON.stringify(studentInfo));
        
        toast({
          title: 'Login Successful',
          description: 'Welcome back!',
        });
        
        // Add a small delay to ensure token is properly stored
        setTimeout(() => {
          navigate('/student/dashboard?tab=events');
        }, 300);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: error.response?.data?.message || 'Invalid credentials',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0e0e10] text-white flex flex-col">
      <div className="container mx-auto px-4 py-8">
        <Link to="/" className="flex items-center mb-12 transition-transform duration-300 hover:scale-105 w-fit">
          <span className="text-2xl md:text-3xl font-orbitron font-bold">
            <span className="text-white">TECH</span>
            <span className="bg-gradient-to-r from-white to-amber-500 bg-clip-text text-transparent">SHETHRA</span>
          </span>
        </Link>
      </div>
      
      <div className="flex-1 flex justify-center items-center px-4 pb-12">
        <Card className="w-full max-w-md bg-black/50 backdrop-blur-md border border-white/10">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-orbitron bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
              Student Login
            </CardTitle>
            <CardDescription className="text-gray-300">
              Login to register for TechShethra events
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-200">Email</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="you@example.com" 
                          {...field} 
                          type="email" 
                          className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                        />
                      </FormControl>
                      <FormMessage className="text-amber-500" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-200">Password</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="password" 
                          className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                        />
                      </FormControl>
                      <FormMessage className="text-amber-500" />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-bold py-3 rounded-full hover:shadow-[0_0_15px_rgba(245,158,11,0.5)] transition-all duration-300"
                  disabled={isLoading}
                >
                  {isLoading ? 'Logging in...' : 'Login'}
                </Button>
                
                <div className="text-center mt-4">
                  Don't have an account?{' '}
                  <Link to="/student/register" className="text-amber-400 hover:text-amber-300 font-medium">
                    Register
                  </Link>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 