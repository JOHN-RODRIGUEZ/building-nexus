import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Trash2, Edit, X } from 'lucide-react';
import { useEnvironmentStore, Environment } from '@/stores/environmentStore';
import { EnvironmentCard } from '@/components/EnvironmentCard';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

export default function EnvironmentsManagement() {
  const { environments, fetchEnvironments, addEnvironment, updateEnvironment, deleteEnvironment, isLoading } = useEnvironmentStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEnv, setEditingEnv] = useState<Environment | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'available' as 'available' | 'rented',
    rentalPrice: 0,
    area: 0,
    floor: 1,
    photos: [''],
  });

  useEffect(() => {
    fetchEnvironments();
  }, [fetchEnvironments]);

  const filteredEnvironments = environments.filter(env =>
    env.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    env.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenModal = (env?: Environment) => {
    if (env) {
      setEditingEnv(env);
      setFormData({
        name: env.name,
        description: env.description,
        status: env.status,
        rentalPrice: env.rentalPrice,
        area: env.area,
        floor: env.floor,
        photos: env.photos.length > 0 ? env.photos : [''],
      });
    } else {
      setEditingEnv(null);
      setFormData({
        name: '',
        description: '',
        status: 'available',
        rentalPrice: 0,
        area: 0,
        floor: 1,
        photos: [''],
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const envData = {
      ...formData,
      photos: formData.photos.filter(p => p.trim() !== ''),
    };

    if (editingEnv) {
      updateEnvironment(editingEnv.id, envData);
      toast.success('Environment updated successfully');
    } else {
      addEnvironment(envData);
      toast.success('Environment created successfully');
    }
    
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    deleteEnvironment(id);
    toast.success('Environment deleted');
  };

  const addPhotoField = () => {
    setFormData(prev => ({
      ...prev,
      photos: [...prev.photos, ''],
    }));
  };

  const updatePhoto = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.map((p, i) => i === index ? value : p),
    }));
  };

  const removePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Environments</h1>
            <p className="text-muted-foreground">Manage your building spaces and galleries</p>
          </div>
          <Button onClick={() => handleOpenModal()} className="rounded-xl gap-2">
            <Plus className="h-5 w-5" />
            Add Environment
          </Button>
        </div>
      </motion.div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search environments..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input-futuristic w-full pl-12"
        />
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="card-elevated h-80 animate-pulse bg-muted" />
          ))}
        </div>
      ) : filteredEnvironments.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-lg">No environments found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEnvironments.map((env) => (
            <div key={env.id} className="relative group">
              <EnvironmentCard environment={env} />
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="icon"
                  variant="secondary"
                  className="rounded-lg h-9 w-9"
                  onClick={() => handleOpenModal(env)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="destructive"
                  className="rounded-lg h-9 w-9"
                  onClick={() => handleDelete(env.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingEnv ? 'Edit Environment' : 'New Environment'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="input-futuristic w-full"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="input-futuristic w-full min-h-[100px] py-3"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'available' | 'rented' }))}
                  className="input-futuristic w-full"
                >
                  <option value="available">Available</option>
                  <option value="rented">Rented</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Rental Price ($/mo)</label>
                <input
                  type="number"
                  value={formData.rentalPrice}
                  onChange={(e) => setFormData(prev => ({ ...prev, rentalPrice: Number(e.target.value) }))}
                  className="input-futuristic w-full"
                  required
                  min="0"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Area (m²)</label>
                <input
                  type="number"
                  value={formData.area}
                  onChange={(e) => setFormData(prev => ({ ...prev, area: Number(e.target.value) }))}
                  className="input-futuristic w-full"
                  required
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Floor</label>
                <input
                  type="number"
                  value={formData.floor}
                  onChange={(e) => setFormData(prev => ({ ...prev, floor: Number(e.target.value) }))}
                  className="input-futuristic w-full"
                  required
                  min="1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Photo URLs</label>
                <Button type="button" variant="ghost" size="sm" onClick={addPhotoField}>
                  <Plus className="h-4 w-4 mr-1" /> Add Photo
                </Button>
              </div>
              {formData.photos.map((photo, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="url"
                    value={photo}
                    onChange={(e) => updatePhoto(index, e.target.value)}
                    placeholder="https://..."
                    className="input-futuristic w-full"
                  />
                  {formData.photos.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removePhoto(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" className="flex-1 rounded-xl" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="flex-1 rounded-xl">
                {editingEnv ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
