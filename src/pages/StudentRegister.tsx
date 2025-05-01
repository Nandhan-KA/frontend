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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { toast } from '../components/ui/use-toast';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  password: z.string().min(6, {
    message: 'Password must be at least 6 characters.',
  }),
  confirmPassword: z.string(),
  phone: z.string().min(10, {
    message: 'Please enter a valid phone number.',
  }),
  college: z.string().min(2, {
    message: 'College name is required.',
  }),
  department: z.string().min(2, {
    message: 'Department is required.',
  }),
  year: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function StudentRegister() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      college: '',
      department: '',
      year: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      const { confirmPassword, ...registerData } = values;
      
      const response = await publicApi.post(
        '/api/students/register',
        registerData
      );

      if (response.data.token) {
        localStorage.setItem('studentToken', `Bearer ${response.data.token}`);
        localStorage.setItem('studentInfo', JSON.stringify(response.data.student));
        
        toast({
          title: 'Registration Successful',
          description: 'You have been registered successfully!',
        });
        
        navigate('/student/dashboard');
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Registration Failed',
        description: error.response?.data?.message || 'Something went wrong',
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
              Student Registration
            </CardTitle>
            <CardDescription className="text-gray-300">
              Register to participate in TechShethra events
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-200">Full Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="John Doe" 
                          {...field} 
                          className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                        />
                      </FormControl>
                      <FormMessage className="text-amber-500" />
                    </FormItem>
                  )}
                />
                
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
                
                <div className="grid grid-cols-2 gap-4">
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
                  
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-200">Confirm Password</FormLabel>
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
                </div>
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-200">Phone Number</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="+91 9876543210" 
                          {...field} 
                          className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                        />
                      </FormControl>
                      <FormMessage className="text-amber-500" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="college"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-200">College Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Your College" 
                          {...field} 
                          className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                        />
                      </FormControl>
                      <FormMessage className="text-amber-500" />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-200">Department</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="CSE, ECE, etc." 
                            {...field} 
                            className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                          />
                        </FormControl>
                        <FormMessage className="text-amber-500" />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="year"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-200">Year of Study</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-white/5 border-white/10 text-white">
                              <SelectValue placeholder="Select Year" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-[#1c1c20] border-white/10 text-white">
                            <SelectItem value="1">1st Year</SelectItem>
                            <SelectItem value="2">2nd Year</SelectItem>
                            <SelectItem value="3">3rd Year</SelectItem>
                            <SelectItem value="4">4th Year</SelectItem>
                            <SelectItem value="5">5th Year</SelectItem>
                            <SelectItem value="Others">Others</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-amber-500" />
                      </FormItem>
                    )}
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-bold py-3 rounded-full hover:shadow-[0_0_15px_rgba(245,158,11,0.5)] transition-all duration-300"
                  disabled={isLoading}
                >
                  {isLoading ? 'Registering...' : 'Register'}
                </Button>
                
                <div className="text-center mt-4">
                  Already have an account?{' '}
                  <Link to="/student/login" className="text-amber-400 hover:text-amber-300 font-medium">
                    Login
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