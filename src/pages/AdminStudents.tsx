import * as React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search,
  User,
  Mail,
  Phone,
  School,
  Trash2,
  UserCheck,
  Tag,
  AlertCircle,
  Eye
} from 'lucide-react';
import { adminApi } from '../services/api';

import AdminHeader from '../components/admin/AdminHeader';
import AdminSidebar from '../components/admin/AdminSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';

interface Student {
  _id: string;
  name: string;
  email: string;
  phone: string;
  college: string;
  department: string;
  year: string;
  registeredEvents: Array<{
    eventId: string;
    eventName: string;
    registrationDate: string;
    paymentStatus: string;
    teamName?: string;
    teamMembers?: string[];
  }>;
  verified: boolean;
}

const AdminStudents = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [filter, setFilter] = useState('all');
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        navigate('/admin');
        return;
      }
      
      const response = await adminApi.get('/api/students');
      
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch students. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const verifyStudent = async (studentId: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      
      await adminApi.put(`/api/students/${studentId}/verify`);
      
      toast({
        title: "Success",
        description: "Student verified successfully!",
      });
      
      fetchStudents();
    } catch (error) {
      console.error('Error verifying student:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to verify student. Please try again.",
      });
    }
  };

  const deleteStudent = async () => {
    if (!currentStudent) return;
    
    try {
      const token = localStorage.getItem('adminToken');
      
      await adminApi.delete(`/api/students/${currentStudent._id}`);
      
      toast({
        title: "Success",
        description: "Student deleted successfully!",
      });
      
      setIsDeleteDialogOpen(false);
      fetchStudents();
    } catch (error) {
      console.error('Error deleting student:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete student. Please try again.",
      });
    }
  };

  const openDetailsDialog = (student: Student) => {
    setCurrentStudent(student);
    setIsDetailsDialogOpen(true);
  };

  const openDeleteDialog = (student: Student) => {
    setCurrentStudent(student);
    setIsDeleteDialogOpen(true);
  };

  const filteredStudents = students.filter(student => {
    // First apply search filter
    const matchesSearch = 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.phone.includes(searchTerm) ||
      student.college.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Then apply category filter
    if (filter === 'all') return matchesSearch;
    if (filter === 'verified') return matchesSearch && student.verified;
    if (filter === 'unverified') return matchesSearch && !student.verified;
    if (filter === 'registered') return matchesSearch && student.registeredEvents.length > 0;
    
    return matchesSearch;
  });

  const getStatusBadge = (student: Student) => {
    if (!student.verified) {
      return <Badge className="bg-yellow-600"><AlertCircle size={14} className="mr-1" />Unverified</Badge>;
    }
    if (student.registeredEvents.length === 0) {
      return <Badge className="bg-gray-600"><UserCheck size={14} className="mr-1" />Verified</Badge>;
    }
    return <Badge className="bg-green-600"><Tag size={14} className="mr-1" />Registered</Badge>;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <AdminHeader />
      
      <div className="flex">
        <AdminSidebar />
        
        <main className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Student Management</h1>
          </div>
          
          <div className="mb-6 flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                type="text"
                placeholder="Search students..."
                className="pl-10 bg-gray-800 border-gray-700 text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="all">All Students</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="unverified">Unverified</SelectItem>
                <SelectItem value="registered">Registered for Events</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="p-4">Student</th>
                    <th className="p-4">Contact</th>
                    <th className="p-4">College</th>
                    <th className="p-4">Department</th>
                    <th className="p-4">Year</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Events</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student) => (
                      <tr key={student._id} className="hover:bg-gray-750">
                        <td className="p-4">
                          <div className="font-medium flex items-center">
                            <User size={18} className="mr-2 text-gray-400" />
                            {student.name}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="text-sm flex items-center mb-1">
                            <Mail size={14} className="mr-2 text-gray-400" />
                            {student.email}
                          </div>
                          <div className="text-sm flex items-center">
                            <Phone size={14} className="mr-2 text-gray-400" />
                            {student.phone}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center">
                            <School size={14} className="mr-2 text-gray-400" />
                            {student.college}
                          </div>
                        </td>
                        <td className="p-4">{student.department}</td>
                        <td className="p-4">{student.year}</td>
                        <td className="p-4">
                          {getStatusBadge(student)}
                        </td>
                        <td className="p-4">
                          {student.registeredEvents.length > 0 ? (
                            <Badge className="bg-blue-600">
                              {student.registeredEvents.length} Events
                            </Badge>
                          ) : (
                            <span className="text-gray-400">None</span>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-blue-500 text-blue-500 hover:bg-blue-950"
                              onClick={() => openDetailsDialog(student)}
                            >
                              <Eye size={14} />
                            </Button>
                            
                            {!student.verified && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-green-500 text-green-500 hover:bg-green-950"
                                onClick={() => verifyStudent(student._id)}
                              >
                                <UserCheck size={14} />
                              </Button>
                            )}
                            
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-red-500 text-red-500 hover:bg-red-950"
                              onClick={() => openDeleteDialog(student)}
                            >
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="p-4 text-center text-gray-400">
                        No students found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
      
      {/* Student Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="bg-gray-800 text-white border-gray-700 max-w-2xl">
          <DialogHeader>
            <DialogTitle>Student Details</DialogTitle>
            <DialogDescription className="text-gray-400">
              View complete student information and event registrations.
            </DialogDescription>
          </DialogHeader>
          
          {currentStudent && (
            <div className="py-4">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <h3 className="text-sm text-gray-400">Name</h3>
                  <p className="font-medium">{currentStudent.name}</p>
                </div>
                <div>
                  <h3 className="text-sm text-gray-400">Email</h3>
                  <p className="font-medium">{currentStudent.email}</p>
                </div>
                <div>
                  <h3 className="text-sm text-gray-400">Phone</h3>
                  <p className="font-medium">{currentStudent.phone}</p>
                </div>
                <div>
                  <h3 className="text-sm text-gray-400">Verification Status</h3>
                  <p className="font-medium">{currentStudent.verified ? 'Verified' : 'Unverified'}</p>
                </div>
                <div>
                  <h3 className="text-sm text-gray-400">College</h3>
                  <p className="font-medium">{currentStudent.college}</p>
                </div>
                <div>
                  <h3 className="text-sm text-gray-400">Department</h3>
                  <p className="font-medium">{currentStudent.department}</p>
                </div>
                <div>
                  <h3 className="text-sm text-gray-400">Year</h3>
                  <p className="font-medium">{currentStudent.year}</p>
                </div>
              </div>
              
              <h3 className="font-semibold text-lg mb-3">Event Registrations</h3>
              
              {currentStudent.registeredEvents.length > 0 ? (
                <div className="bg-gray-750 rounded-md overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-700">
                      <tr>
                        <th className="p-2 text-left">Event</th>
                        <th className="p-2 text-left">Registration Date</th>
                        <th className="p-2 text-left">Payment Status</th>
                        <th className="p-2 text-left">Team</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {currentStudent.registeredEvents.map((registration, index) => (
                        <tr key={index}>
                          <td className="p-2">{registration.eventName}</td>
                          <td className="p-2">{new Date(registration.registrationDate).toLocaleDateString()}</td>
                          <td className="p-2">
                            <Badge className={registration.paymentStatus === 'Paid' ? 'bg-green-600' : 'bg-yellow-600'}>
                              {registration.paymentStatus}
                            </Badge>
                          </td>
                          <td className="p-2">
                            {registration.teamName ? (
                              <div>
                                <div className="font-medium">{registration.teamName}</div>
                                <div className="text-xs text-gray-400">
                                  {registration.teamMembers?.length} members
                                </div>
                              </div>
                            ) : (
                              <span className="text-gray-400">Individual</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-400">No events registered.</p>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button 
              onClick={() => setIsDetailsDialogOpen(false)}
              className="bg-amber-600 hover:bg-amber-700"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Student Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-gray-800 text-white border-gray-700">
          <DialogHeader>
            <DialogTitle>Delete Student</DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you sure you want to delete this student? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {currentStudent && (
            <div className="py-4">
              <p className="font-medium">{currentStudent.name}</p>
              <p className="text-gray-400 mt-1">{currentStudent.email} | {currentStudent.phone}</p>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button 
              onClick={deleteStudent}
              variant="destructive"
            >
              Delete Student
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminStudents; 