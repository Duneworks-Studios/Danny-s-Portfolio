'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Camera, 
  Code, 
  Plus, 
  Edit, 
  Trash2, 
  Upload, 
  LogOut, 
  Eye,
  Save,
  X,
  Settings,
  Menu,
  X as CloseIcon,
  CheckCircle,
  AlertCircle,
  Users,
  Sparkles,
  User
} from 'lucide-react';

interface Photo {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  createdAt: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  tech: string[];
  demo: string;
  gradient: string;
  createdAt: string;
}

interface User {
  id: string;
  email: string;
  password: string;
  role?: string;
  createdAt: string;
}

interface Render {
  id: string;
  sceneName: string;
  imageUrl: string;
  createdAt: string;
}

interface ContactData {
  profilePicture: string;
  name: string;
  title: string;
  email: string;
  bio: string;
  socialLinks: {
    discord?: string;
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
  skills: string[];
  updatedAt: string;
}

interface Notification {
  id: string;
  type: 'success' | 'error';
  message: string;
}

const sidebarItems = [
  { id: 'photos', label: 'Photos', icon: Camera },
  { id: 'projects', label: 'Projects', icon: Code },
  { id: 'renders', label: 'Renders', icon: Sparkles },
  { id: 'contact', label: 'Contact Card', icon: User },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState('photos');
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [renders, setRenders] = useState<Render[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [contactData, setContactData] = useState<ContactData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPhotoForm, setShowPhotoForm] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showRenderForm, setShowRenderForm] = useState(false);
  const [showUserForm, setShowUserForm] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingRender, setEditingRender] = useState<Render | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const router = useRouter();

  // Photo form state
  const [photoForm, setPhotoForm] = useState({
    title: '',
    description: '',
    category: 'Automotive',
    imageUrl: ''
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  // Project form state
  const [projectForm, setProjectForm] = useState({
    name: '',
    description: '',
    tech: [] as string[],
    demo: '',
    gradient: 'from-white to-gray-300'
  });

  // User form state
  const [userForm, setUserForm] = useState({
    email: '',
    password: '',
    role: 'user'
  });

  // Contact form state
  const [contactForm, setContactForm] = useState({
    profilePicture: '',
    name: '',
    title: '',
    email: '',
    bio: '',
    socialLinks: {
      discord: '',
      github: '',
      linkedin: '',
      twitter: ''
    },
    skills: [] as string[]
  });
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);

  // Render form state
  const [renderForm, setRenderForm] = useState({
    sceneName: '',
    imageUrl: ''
  });
  const [renderFile, setRenderFile] = useState<File | null>(null);
  const [renderPreview, setRenderPreview] = useState<string | null>(null);

  const [newTech, setNewTech] = useState('');

  useEffect(() => {
    checkAuth();
    loadData();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/verify');
      const data = await response.json();
      
      if (!data.authenticated) {
        router.push('/admin/login');
      }
    } catch (error) {
      router.push('/admin/login');
    }
  };

  const loadData = async () => {
    try {
      const [photosRes, projectsRes, rendersRes, usersRes, contactRes] = await Promise.all([
        fetch('/api/photos'),
        fetch('/api/projects'),
        fetch('/api/renders'),
        fetch('/api/users'),
        fetch('/api/contact')
      ]);

      const photosData = await photosRes.json();
      const projectsData = await projectsRes.json();
      const rendersData = await rendersRes.json();
      const usersData = await usersRes.json();
      const contactData = await contactRes.json();

      setPhotos(photosData);
      setProjects(projectsData);
      setRenders(rendersData);
      setUsers(usersData);
      setContactData(contactData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/login', { method: 'DELETE' });
      localStorage.removeItem('rememberMe');
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const addNotification = (type: 'success' | 'error', message: string) => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  const handlePhotoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let imageUrl = photoForm.imageUrl;

      // Upload file if a new file is selected
      if (photoFile) {
        const uploadFormData = new FormData();
        uploadFormData.append('file', photoFile);
        uploadFormData.append('category', 'photo');

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData
        });

        if (!uploadResponse.ok) {
          addNotification('error', 'Failed to upload image');
          return;
        }

        const uploadData = await uploadResponse.json();
        imageUrl = uploadData.url;
      }

      if (!imageUrl && !editingPhoto) {
        addNotification('error', 'Please upload an image');
        return;
      }

      const method = editingPhoto ? 'PUT' : 'POST';
      const body = editingPhoto 
        ? { id: editingPhoto.id, ...photoForm, imageUrl }
        : { ...photoForm, imageUrl };

      const response = await fetch('/api/photos', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        await loadData();
        setShowPhotoForm(false);
        setEditingPhoto(null);
        setPhotoForm({ title: '', description: '', category: 'Automotive', imageUrl: '' });
        setPhotoFile(null);
        setPhotoPreview(null);
        addNotification('success', editingPhoto ? 'Photo updated successfully!' : 'Photo added successfully!');
      } else {
        addNotification('error', 'Failed to save photo');
      }
    } catch (error) {
      addNotification('error', 'Error saving photo');
    }
  };

  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingProject ? 'PUT' : 'POST';
      const body = editingProject 
        ? { id: editingProject.id, ...projectForm }
        : projectForm;

      const response = await fetch('/api/projects', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        await loadData();
        setShowProjectForm(false);
        setEditingProject(null);
        setProjectForm({ name: '', description: '', tech: [], demo: '', gradient: 'from-white to-gray-300' });
        addNotification('success', editingProject ? 'Project updated successfully!' : 'Project added successfully!');
      } else {
        addNotification('error', 'Failed to save project');
      }
    } catch (error) {
      addNotification('error', 'Error saving project');
    }
  };

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingUser ? 'PUT' : 'POST';
      const body = editingUser 
        ? { id: editingUser.id, ...userForm }
        : userForm;

      const response = await fetch('/api/users', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        await loadData();
        setShowUserForm(false);
        setEditingUser(null);
        setUserForm({ email: '', password: '', role: 'user' });
        addNotification('success', editingUser ? 'User updated successfully!' : 'User added successfully!');
      } else {
        const errorData = await response.json();
        addNotification('error', errorData.error || 'Failed to save user');
      }
    } catch (error) {
      addNotification('error', 'Error saving user');
    }
  };

  const handleRenderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let imageUrl = renderForm.imageUrl;

      // Upload file if a new file is selected
      if (renderFile) {
        const uploadFormData = new FormData();
        uploadFormData.append('file', renderFile);
        uploadFormData.append('category', 'render');

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData
        });

        if (!uploadResponse.ok) {
          addNotification('error', 'Failed to upload image');
          return;
        }

        const uploadData = await uploadResponse.json();
        imageUrl = uploadData.url;
      }

      if (!imageUrl && !editingRender) {
        addNotification('error', 'Please upload an image');
        return;
      }

      const method = editingRender ? 'PUT' : 'POST';
      const body = editingRender 
        ? { id: editingRender.id, ...renderForm, imageUrl }
        : { ...renderForm, imageUrl };

      const response = await fetch('/api/renders', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        await loadData();
        setShowRenderForm(false);
        setEditingRender(null);
        setRenderForm({ sceneName: '', imageUrl: '' });
        setRenderFile(null);
        setRenderPreview(null);
        addNotification('success', editingRender ? 'Render updated successfully!' : 'Render added successfully!');
      } else {
        addNotification('error', 'Failed to save render');
      }
    } catch (error) {
      addNotification('error', 'Error saving render');
    }
  };

  const deletePhoto = async (id: string) => {
    if (!confirm('Are you sure you want to delete this photo?')) return;
    
    try {
      await fetch(`/api/photos?id=${id}`, { method: 'DELETE' });
      await loadData();
      addNotification('success', 'Photo deleted successfully!');
    } catch (error) {
      addNotification('error', 'Error deleting photo');
    }
  };

  const deleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    
    try {
      await fetch(`/api/projects?id=${id}`, { method: 'DELETE' });
      await loadData();
      addNotification('success', 'Project deleted successfully!');
    } catch (error) {
      addNotification('error', 'Error deleting project');
    }
  };

  const deleteUser = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    try {
      await fetch(`/api/users?id=${id}`, { method: 'DELETE' });
      await loadData();
      addNotification('success', 'User deleted successfully!');
    } catch (error) {
      addNotification('error', 'Error deleting user');
    }
  };

  const deleteRender = async (id: string) => {
    if (!confirm('Are you sure you want to delete this render?')) return;
    
    try {
      await fetch(`/api/renders?id=${id}`, { method: 'DELETE' });
      await loadData();
      addNotification('success', 'Render deleted successfully!');
    } catch (error) {
      addNotification('error', 'Error deleting render');
    }
  };

  const editPhoto = (photo: Photo) => {
    setEditingPhoto(photo);
    setPhotoForm({
      title: photo.title,
      description: photo.description,
      category: photo.category,
      imageUrl: photo.imageUrl
    });
    setPhotoFile(null);
    setPhotoPreview(photo.imageUrl);
    setShowPhotoForm(true);
  };

  const editProject = (project: Project) => {
    setEditingProject(project);
    setProjectForm({
      name: project.name,
      description: project.description,
      tech: project.tech,
      demo: project.demo,
      gradient: project.gradient
    });
    setShowProjectForm(true);
  };

  const editUser = (user: User) => {
    setEditingUser(user);
    setUserForm({
      email: user.email,
      password: user.password,
      role: user.role || 'user'
    });
    setShowUserForm(true);
  };

  const editRender = (render: Render) => {
    setEditingRender(render);
    setRenderForm({
      sceneName: render.sceneName,
      imageUrl: render.imageUrl
    });
    setRenderFile(null);
    setRenderPreview(render.imageUrl);
    setShowRenderForm(true);
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let profilePicture = contactForm.profilePicture;

      // Upload file if a new file is selected
      if (profileFile) {
        const uploadFormData = new FormData();
        uploadFormData.append('file', profileFile);
        uploadFormData.append('category', 'profile');

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData
        });

        if (!uploadResponse.ok) {
          addNotification('error', 'Failed to upload profile picture');
          return;
        }

        const uploadData = await uploadResponse.json();
        profilePicture = uploadData.url;
      }

      // Filter out empty skills before submitting
      const cleanedForm = {
        ...contactForm,
        profilePicture,
        skills: contactForm.skills.filter(skill => skill.trim() !== '')
      };

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanedForm)
      });

      if (response.ok) {
        await loadData();
        setShowContactForm(false);
        setProfileFile(null);
        setProfilePreview(null);
        addNotification('success', 'Contact card updated successfully!');
      } else {
        addNotification('error', 'Failed to update contact card');
      }
    } catch (error) {
      addNotification('error', 'Error updating contact card');
    }
  };

  const editContact = () => {
    if (contactData) {
      setContactForm({
        profilePicture: contactData.profilePicture,
        name: contactData.name,
        title: contactData.title,
        email: contactData.email,
        bio: contactData.bio,
        socialLinks: {
          discord: contactData.socialLinks.discord || '',
          github: contactData.socialLinks.github || '',
          linkedin: contactData.socialLinks.linkedin || '',
          twitter: contactData.socialLinks.twitter || ''
        },
        skills: contactData.skills.filter(skill => skill.trim() !== '')
      });
      setProfileFile(null);
      setProfilePreview(contactData.profilePicture);
      setShowContactForm(true);
    }
  };

  const addSkill = () => {
    const skillInput = document.getElementById('skillInput') as HTMLInputElement;
    const skillValue = skillInput?.value?.trim();
    
    if (skillInput && skillValue && skillValue.length > 0 && !contactForm.skills.includes(skillValue)) {
      setContactForm(prev => ({
        ...prev,
        skills: [...prev.skills.filter(skill => skill.trim() !== ''), skillValue]
      }));
      skillInput.value = '';
    }
  };

  const removeSkill = (skill: string) => {
    setContactForm(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const addTech = () => {
    if (newTech.trim() && !projectForm.tech.includes(newTech.trim())) {
      setProjectForm(prev => ({
        ...prev,
        tech: [...prev.tech, newTech.trim()]
      }));
      setNewTech('');
    }
  };

  const removeTech = (tech: string) => {
    setProjectForm(prev => ({
      ...prev,
      tech: prev.tech.filter(t => t !== tech)
    }));
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'photos':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-white">Photo Management</h2>
                <p className="text-gray-300">Manage your photography portfolio</p>
              </div>
              <motion.button
                onClick={() => {
                  setEditingPhoto(null);
                  setPhotoForm({ title: '', description: '', category: 'Automotive', imageUrl: '' });
                  setPhotoFile(null);
                  setPhotoPreview(null);
                  setShowPhotoForm(true);
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="glass-button flex items-center gap-2 px-4 py-2 rounded-xl text-white hover:text-white"
              >
                <Plus size={20} />
                Add Photo
              </motion.button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {photos.map((photo, index) => (
                <motion.div
                  key={photo.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="glass-card p-4 overflow-hidden"
                >
                  <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center mb-4">
                    {photo.imageUrl ? (
                      <img src={photo.imageUrl} alt={photo.title} className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <Camera className="text-gray-400" size={40} />
                    )}
                  </div>
                  <h3 className="font-semibold text-white mb-2">{photo.title}</h3>
                  <p className="text-gray-300 text-sm mb-3 line-clamp-2">{photo.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-1 bg-white/20 text-white text-xs rounded-full">
                      {photo.category}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => editPhoto(photo)}
                        className="glass-button p-2 text-gray-300 hover:text-white rounded-lg"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => deletePhoto(photo.id)}
                        className="glass-button p-2 text-gray-300 hover:text-red-400 rounded-lg"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 'projects':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-white">Project Management</h2>
                <p className="text-gray-300">Manage your development projects</p>
              </div>
              <motion.button
                onClick={() => {
                  setEditingProject(null);
                  setProjectForm({ name: '', description: '', tech: [], demo: '', gradient: 'from-white to-gray-300' });
                  setShowProjectForm(true);
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="glass-button flex items-center gap-2 px-4 py-2 rounded-xl text-white hover:text-white"
              >
                <Plus size={20} />
                Add Project
              </motion.button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="glass-card p-6"
                >
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${project.gradient} flex items-center justify-center mb-4`}>
                    <Code className="text-white" size={24} />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{project.name}</h3>
                  <p className="text-gray-300 text-sm mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tech.map((tech) => (
                      <span key={tech} className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded-lg">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:text-white text-sm font-medium"
                    >
                      View Project →
                    </a>
                    <div className="flex gap-2">
                      <button
                        onClick={() => editProject(project)}
                        className="glass-button p-2 text-gray-300 hover:text-white rounded-lg"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => deleteProject(project.id)}
                        className="glass-button p-2 text-gray-300 hover:text-red-400 rounded-lg"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 'renders':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-white">Render Management</h2>
                <p className="text-gray-300">Manage your 3D renders and visualizations</p>
              </div>
              <motion.button
                onClick={() => {
                  setEditingRender(null);
                  setRenderForm({ sceneName: '', imageUrl: '' });
                  setRenderFile(null);
                  setRenderPreview(null);
                  setShowRenderForm(true);
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="glass-button flex items-center gap-2 px-4 py-2 rounded-xl text-white hover:text-white"
              >
                <Plus size={20} />
                Add Render
              </motion.button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {renders.map((render, index) => (
                <motion.div
                  key={render.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="glass-card p-6"
                >
                  <div className="aspect-square rounded-lg overflow-hidden mb-4">
                    <img
                      src={render.imageUrl}
                      alt={render.sceneName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{render.sceneName}</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Added: {new Date(render.createdAt).toLocaleDateString()}
                  </p>
                  <div className="flex gap-2">
                    <motion.button
                      onClick={() => editRender(render)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
                    >
                      <Edit size={16} />
                      Edit
                    </motion.button>
                    <motion.button
                      onClick={() => deleteRender(render.id)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                      Delete
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 'contact':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-white">Contact Card Management</h2>
                <p className="text-gray-300">Manage your contact information displayed on the homepage</p>
              </div>
              <motion.button
                onClick={editContact}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="glass-button flex items-center gap-2 px-4 py-2 rounded-xl text-white hover:text-white"
              >
                <Edit size={20} />
                Edit Contact Card
              </motion.button>
            </div>

            {contactData && (
              <div className="glass-card p-6">
                <div className="flex items-center gap-6 mb-6">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white/30">
                    <img
                      src={contactData.profilePicture}
                      alt={contactData.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">{contactData.name}</h3>
                    <p className="text-white font-medium">{contactData.title}</p>
                    <p className="text-gray-400 text-sm mt-1">{contactData.email}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3">Contact Information</h4>
                    <div className="space-y-2">
                      <p className="text-gray-300"><span className="text-white">Email:</span> {contactData.email}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3">Social Links</h4>
                    <div className="space-y-2">
                      {Object.entries(contactData.socialLinks).map(([platform, url]) => (
                        url && (
                          <p key={platform} className="text-gray-300">
                            <span className="text-white capitalize">{platform}:</span> {url}
                          </p>
                        )
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h4 className="text-lg font-semibold text-white mb-3">Bio</h4>
                  <p className="text-gray-300 leading-relaxed">{contactData.bio}</p>
                </div>
                
                <div className="mt-6">
                  <h4 className="text-lg font-semibold text-white mb-3">Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {contactData.skills.filter(skill => skill.trim() !== '').map((skill, index) => (
                      <span key={index} className="px-3 py-1 text-sm font-medium rounded-full glass-light text-gray-300">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-white/10">
                  <p className="text-gray-400 text-sm">
                    Last updated: {new Date(contactData.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            )}
          </div>
        );

      case 'users':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-white">User Management</h2>
                <p className="text-gray-300">Manage admin users and access</p>
              </div>
              <motion.button
                onClick={() => {
                  setEditingUser(null);
                  setUserForm({ email: '', password: '', role: 'user' });
                  setShowUserForm(true);
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="glass-button flex items-center gap-2 px-4 py-2 rounded-xl text-white hover:text-white"
              >
                <Plus size={20} />
                Add User
              </motion.button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {users.map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="glass-card p-6"
                >
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-white to-gray-300 flex items-center justify-center mb-4">
                    <Users className="text-white" size={24} />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{user.email}</h3>
                  <p className="text-gray-300 text-sm mb-4">
                    Role: <span className="text-white">{user.role || 'user'}</span>
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-xs">
                      Created: {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => editUser(user)}
                        className="glass-button p-2 text-gray-300 hover:text-white rounded-lg"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => deleteUser(user.id)}
                        className="glass-button p-2 text-gray-300 hover:text-red-400 rounded-lg"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white">Settings</h2>
              <p className="text-gray-300">Manage your account and preferences</p>
            </div>
            
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Account Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    value="Duneworksstudios@gmail.com"
                    disabled
                    className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-800 text-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Role</label>
                  <input
                    type="text"
                    value="Administrator"
                    disabled
                    className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-800 text-gray-400"
                  />
                </div>
              </div>
            </div>

            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Danger Zone</h3>
              <button
                onClick={handleLogout}
                className="glass-button flex items-center gap-2 px-4 py-2 rounded-lg text-red-400 hover:text-red-300"
              >
                <LogOut size={20} />
                Logout
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center glass-admin-bg">
        <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen glass-admin-bg admin-main">
      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        <AnimatePresence>
          {notifications.map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg ${
                notification.type === 'success' 
                  ? 'bg-green-500 text-white' 
                  : 'bg-red-500 text-white'
              }`}
            >
              {notification.type === 'success' ? (
                <CheckCircle size={20} />
              ) : (
                <AlertCircle size={20} />
              )}
              <span className="text-sm font-medium">{notification.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-16 right-4 z-40">
        <button
          onClick={() => setSidebarOpen(true)}
          className="glass-button p-2 text-white hover:text-white rounded-lg"
        >
          <Menu size={24} />
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-40 w-64 glass-sidebar transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="flex flex-col h-full">
            {/* Sidebar Header */}
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold text-white">Admin Panel</h1>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="lg:hidden glass-button p-2 text-white hover:text-white rounded-lg"
                >
                  <CloseIcon size={20} />
                </button>
              </div>
            </div>

            {/* Sidebar Navigation */}
            <nav className="flex-1 p-4 space-y-2">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveSection(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 glass-sidebar-item text-left transition-all ${
                      isActive
                        ? 'bg-white/20 text-white border border-white/30'
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Sidebar Footer */}
            <div className="p-4 border-t border-white/10">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
              >
                <LogOut size={20} />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          <div className="p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, x: 20, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -20, scale: 0.95 }}
                transition={{ 
                  duration: 0.3,
                  ease: [0.4, 0.0, 0.2, 1]
                }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Photo Form Modal */}
      {showPhotoForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">
                {editingPhoto ? 'Edit Photo' : 'Add New Photo'}
              </h3>
              <button
                onClick={() => setShowPhotoForm(false)}
                className="glass-button p-2 text-white hover:text-white rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handlePhotoSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                <input
                  type="text"
                  value={photoForm.title}
                  onChange={(e) => setPhotoForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 glass-button rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-white/50"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea
                  value={photoForm.description}
                  onChange={(e) => setPhotoForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 glass-button rounded-lg text-white placeholder-gray-400 h-24 resize-none focus:ring-2 focus:ring-white/50"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                <select
                  value={photoForm.category}
                  onChange={(e) => setPhotoForm(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 glass-button rounded-lg text-white focus:ring-2 focus:ring-white/50"
                >
                  <option value="Automotive">Automotive</option>
                  <option value="Cinematic">Cinematic</option>
                  <option value="Street">Street</option>
                  <option value="Portrait">Portrait</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setPhotoFile(file);
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setPhotoPreview(reader.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="w-full px-3 py-2 glass-button rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-white/50 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-white/20 file:text-white hover:file:bg-white/30"
                  required={!editingPhoto}
                />
                {photoPreview && (
                  <div className="mt-4">
                    <img 
                      src={photoPreview} 
                      alt="Preview" 
                      className="w-full h-48 object-cover rounded-lg border border-white/10"
                    />
                  </div>
                )}
                {editingPhoto && !photoFile && (
                  <p className="mt-2 text-xs text-gray-400">Leave empty to keep current image, or upload a new one</p>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 py-2 px-4 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors flex items-center justify-center gap-2"
                >
                  <Save size={20} />
                  {editingPhoto ? 'Update Photo' : 'Add Photo'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowPhotoForm(false)}
                  className="px-4 py-2 glass-button text-white rounded-lg hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Project Form Modal */}
      {showProjectForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">
                {editingProject ? 'Edit Project' : 'Add New Project'}
              </h3>
              <button
                onClick={() => setShowProjectForm(false)}
                className="glass-button p-2 text-white hover:text-white rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleProjectSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Project Name</label>
                <input
                  type="text"
                  value={projectForm.name}
                  onChange={(e) => setProjectForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 glass-button rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-white/50"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea
                  value={projectForm.description}
                  onChange={(e) => setProjectForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 glass-button rounded-lg text-white placeholder-gray-400 h-24 resize-none focus:ring-2 focus:ring-white/50"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Demo URL</label>
                <input
                  type="url"
                  value={projectForm.demo}
                  onChange={(e) => setProjectForm(prev => ({ ...prev, demo: e.target.value }))}
                  className="w-full px-3 py-2 glass-button rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-white/50"
                  placeholder="https://example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Gradient Colors</label>
                <select
                  value={projectForm.gradient}
                  onChange={(e) => setProjectForm(prev => ({ ...prev, gradient: e.target.value }))}
                  className="w-full px-3 py-2 glass-button rounded-lg text-white focus:ring-2 focus:ring-white/50"
                >
                  <option value="from-white to-gray-300">White to Gray</option>
                  <option value="from-gray-300 to-white">Gray to White</option>
                  <option value="from-gray-400 to-gray-600">Dark Gray</option>
                  <option value="from-gray-600 to-gray-800">Darker Gray</option>
                  <option value="from-white to-gray-400">White to Dark Gray</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Technologies</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newTech}
                    onChange={(e) => setNewTech(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTech())}
                    className="flex-1 px-3 py-2 glass-button rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-white/50"
                    placeholder="Add technology..."
                  />
                  <button
                    type="button"
                    onClick={addTech}
                    className="px-3 py-2 glass-button text-white rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <Plus size={20} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {projectForm.tech.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-white/20 text-white text-sm rounded-lg flex items-center gap-2"
                    >
                      {tech}
                      <button
                        type="button"
                        onClick={() => removeTech(tech)}
                        className="hover:text-red-400 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 py-2 px-4 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors flex items-center justify-center gap-2"
                >
                  <Save size={20} />
                  {editingProject ? 'Update Project' : 'Add Project'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowProjectForm(false)}
                  className="px-4 py-2 glass-button text-white rounded-lg hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* User Form Modal */}
      {showUserForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-6 w-full max-w-md"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">
                {editingUser ? 'Edit User' : 'Add New User'}
              </h3>
              <button
                onClick={() => setShowUserForm(false)}
                className="glass-button p-2 text-white hover:text-white rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUserSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  value={userForm.email}
                  onChange={(e) => setUserForm(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 glass-button rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-white/50"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                <input
                  type="password"
                  value={userForm.password}
                  onChange={(e) => setUserForm(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full px-3 py-2 glass-button rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-white/50"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Role</label>
                <select
                  value={userForm.role}
                  onChange={(e) => setUserForm(prev => ({ ...prev, role: e.target.value }))}
                  className="w-full px-3 py-2 glass-button rounded-lg text-white focus:ring-2 focus:ring-white/50"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 py-2 px-4 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors flex items-center justify-center gap-2"
                >
                  <Save size={20} />
                  {editingUser ? 'Update User' : 'Add User'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowUserForm(false)}
                  className="px-4 py-2 glass-button text-white rounded-lg hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Render Form Modal */}
      {showRenderForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-6 w-full max-w-md"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">
                {editingRender ? 'Edit Render' : 'Add New Render'}
              </h3>
              <button
                onClick={() => setShowRenderForm(false)}
                className="glass-button p-2 text-white hover:text-white rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleRenderSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Scene Name</label>
                <input
                  type="text"
                  value={renderForm.sceneName}
                  onChange={(e) => setRenderForm(prev => ({ ...prev, sceneName: e.target.value }))}
                  className="w-full px-3 py-2 glass-button rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-white/50"
                  placeholder="Enter scene name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setRenderFile(file);
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setRenderPreview(reader.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="w-full px-3 py-2 glass-button rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-white/50 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-white/20 file:text-white hover:file:bg-white/30"
                  required={!editingRender}
                />
                {renderPreview && (
                  <div className="mt-4">
                    <img 
                      src={renderPreview} 
                      alt="Preview" 
                      className="w-full h-48 object-cover rounded-lg border border-white/10"
                    />
                  </div>
                )}
                {editingRender && !renderFile && (
                  <p className="mt-2 text-xs text-gray-400">Leave empty to keep current image, or upload a new one</p>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 px-4 py-2 bg-white/20 text-white rounded-lg font-medium hover:bg-white/30 transition-all"
                >
                  <Save size={16} className="inline mr-2" />
                  {editingRender ? 'Update Render' : 'Add Render'}
                </motion.button>
                <button
                  type="button"
                  onClick={() => setShowRenderForm(false)}
                  className="px-4 py-2 glass-button text-white rounded-lg hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Edit Contact Card</h3>
              <button
                onClick={() => setShowContactForm(false)}
                className="glass-button p-2 text-white hover:text-white rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleContactSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Profile Picture</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setProfileFile(file);
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setProfilePreview(reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="w-full px-3 py-2 glass-button rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-white/50 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-white/20 file:text-white hover:file:bg-white/30"
                  />
                  {profilePreview && (
                    <div className="mt-4">
                      <img 
                        src={profilePreview} 
                        alt="Preview" 
                        className="w-24 h-24 object-cover rounded-full border-2 border-white/30"
                      />
                    </div>
                  )}
                  {!profileFile && contactForm.profilePicture && (
                    <p className="mt-2 text-xs text-gray-400">Leave empty to keep current profile picture, or upload a new one</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                  <input
                    type="text"
                    value={contactForm.name}
                    onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 glass-button rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-white/50"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                  <input
                    type="text"
                    value={contactForm.title}
                    onChange={(e) => setContactForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 glass-button rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-white/50"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 glass-button rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-white/50"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
                <textarea
                  value={contactForm.bio}
                  onChange={(e) => setContactForm(prev => ({ ...prev, bio: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 glass-button rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-white/50"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Social Links</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Discord</label>
                    <input
                      type="url"
                      value={contactForm.socialLinks.discord}
                      onChange={(e) => setContactForm(prev => ({ 
                        ...prev, 
                        socialLinks: { ...prev.socialLinks, discord: e.target.value }
                      }))}
                      className="w-full px-3 py-2 glass-button rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-white/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">GitHub</label>
                    <input
                      type="url"
                      value={contactForm.socialLinks.github}
                      onChange={(e) => setContactForm(prev => ({ 
                        ...prev, 
                        socialLinks: { ...prev.socialLinks, github: e.target.value }
                      }))}
                      className="w-full px-3 py-2 glass-button rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-white/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">LinkedIn</label>
                    <input
                      type="url"
                      value={contactForm.socialLinks.linkedin}
                      onChange={(e) => setContactForm(prev => ({ 
                        ...prev, 
                        socialLinks: { ...prev.socialLinks, linkedin: e.target.value }
                      }))}
                      className="w-full px-3 py-2 glass-button rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-white/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Twitter</label>
                    <input
                      type="url"
                      value={contactForm.socialLinks.twitter}
                      onChange={(e) => setContactForm(prev => ({ 
                        ...prev, 
                        socialLinks: { ...prev.socialLinks, twitter: e.target.value }
                      }))}
                      className="w-full px-3 py-2 glass-button rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-white/50"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Skills</label>
                <div className="flex gap-2 mb-3">
                  <input
                    id="skillInput"
                    type="text"
                    placeholder="Add a skill..."
                    className="flex-1 px-3 py-2 glass-button rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-white/50"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addSkill();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {contactForm.skills.filter(skill => skill.trim() !== '').map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 text-sm font-medium rounded-full glass-light text-gray-300 flex items-center gap-2"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-white/20 text-white font-semibold rounded-xl hover:bg-white/30 transition-all"
                >
                  <Save className="inline mr-2" size={18} />
                  Update Contact Card
                </button>
                <button
                  type="button"
                  onClick={() => setShowContactForm(false)}
                  className="px-6 py-3 glass-button text-white hover:text-white rounded-xl transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}