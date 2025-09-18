'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]); // ✅ new
  const [messageData, setMessageData] = useState({ subject: '', content: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/admin/login');
      return;
    }
    const userObj = JSON.parse(userData);
    setUser(userObj);

    if (userObj.role !== 'admin') {
      router.push('/admin/login');
      return;
    }

    fetchStudents();
  }, [router]);

  const fetchStudents = async () => {
    try {
      const response = await api.get('/admin/students');
      setStudents(response.data.data.students);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ handle selection
  const toggleStudentSelection = (id) => {
    setSelectedStudents((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedStudents.length === students.length) {
      setSelectedStudents([]); // unselect all
    } else {
      setSelectedStudents(students.map((s) => s._id)); // select all
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    setIsSending(true);

    try {
      await api.post('/admin/broadcast', {
        ...messageData,
        recipients: selectedStudents, // ✅ send selected IDs
      });

      alert(
        selectedStudents.length > 0
          ? `Message sent to ${selectedStudents.length} student(s)!`
          : 'Message sent to all students!'
      );

      setMessageData({ subject: '', content: '' });
      setSelectedStudents([]);
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/admin/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">Loading...</div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-6">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span>Welcome, {user?.name}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-4 sm:px-0">
          {/* Student List */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-4">
              Students ({students.length})
            </h2>
            <button
              onClick={handleSelectAll}
              className="mb-3 px-3 py-1 bg-gray-200 rounded"
            >
              {selectedStudents.length === students.length
                ? 'Unselect All'
                : 'Select All'}
            </button>
            <div className="overflow-y-auto max-h-96">
              {students.length === 0 ? (
                <p className="text-gray-500">No students registered yet.</p>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {students.map((student) => (
                    <li key={student._id} className="py-4 flex items-center space-x-4">
                      <input
                        type="checkbox"
                        checked={selectedStudents.includes(student._id)}
                        onChange={() => toggleStudentSelection(student._id)}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {student.name}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {student.email}
                        </p>
                        {student.studentId && (
                          <p className="text-sm text-gray-500 truncate">
                            ID: {student.studentId}
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Send Message Form */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-4">
              Send Message {selectedStudents.length > 0 ? 'to Selected' : 'to All Students'}
            </h2>
            <form onSubmit={handleSendMessage}>
              <div className="mb-4">
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-700"
                >
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  required
                  className="input-field mt-1"
                  value={messageData.subject}
                  onChange={(e) =>
                    setMessageData({ ...messageData, subject: e.target.value })
                  }
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="content"
                  className="block text-sm font-medium text-gray-700"
                >
                  Message
                </label>
                <textarea
                  id="content"
                  rows="5"
                  required
                  className="input-field mt-1"
                  value={messageData.content}
                  onChange={(e) =>
                    setMessageData({ ...messageData, content: e.target.value })
                  }
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSending}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                {isSending
                  ? 'Sending...'
                  : selectedStudents.length > 0
                  ? `Send to ${selectedStudents.length} Selected`
                  : 'Send to All Students'}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
