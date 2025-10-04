import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Plus, Edit, Trash2 } from "lucide-react";

interface FacultyMember {
  id: string;
  name: string;
  title: string;
  department: string;
  email: string | null;
  phone: string | null;
  linkedin: string | null;
  office: string | null;
  image_url: string | null;
  education: string | null;
  specialization: string | null;
  category: string | null;
  display_order: number;
  email_display_order: number | null;
  phone_display_order: number | null;
  linkedin_display_order: number | null;
  office_display_order: number | null;
  education_display_order: number | null;
  specialization_display_order: number | null;
}

export const FacultyManager = () => {
  const [facultyMembers, setFacultyMembers] = useState<FacultyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    department: "",
    email: "",
    phone: "",
    linkedin: "",
    office: "",
    image_url: "",
    education: "",
    specialization: "",
    category: "",
    display_order: 0,
    email_display_order: 0,
    phone_display_order: 0,
    linkedin_display_order: 0,
    office_display_order: 0,
    education_display_order: 0,
    specialization_display_order: 0,
  });

  useEffect(() => {
    fetchFacultyMembers();
  }, []);

  const fetchFacultyMembers = async () => {
    try {
      const { data, error } = await supabase
        .from("faculty_members")
        .select("*")
        .order("display_order", { ascending: true })
        .order("name", { ascending: true });

      if (error) throw error;
      setFacultyMembers((data || []) as any);
    } catch (error: any) {
      toast.error("Öğretim üyeleri yüklenemedi: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const memberData = {
        name: formData.name,
        title: formData.title,
        department: formData.department,
        email: formData.email || null,
        phone: formData.phone || null,
        linkedin: formData.linkedin || null,
        office: formData.office || null,
        image_url: formData.image_url || null,
        education: formData.education || null,
        specialization: formData.specialization || null,
        category: formData.category || null,
        display_order: formData.display_order || 0,
        email_display_order: formData.email_display_order || 0,
        phone_display_order: formData.phone_display_order || 0,
        linkedin_display_order: formData.linkedin_display_order || 0,
        office_display_order: formData.office_display_order || 0,
        education_display_order: formData.education_display_order || 0,
        specialization_display_order: formData.specialization_display_order || 0,
      };

      if (editingId) {
        const { error } = await supabase
          .from("faculty_members")
          .update(memberData)
          .eq("id", editingId);

        if (error) throw error;
        toast.success("Öğretim üyesi güncellendi");
      } else {
        const { error } = await supabase
          .from("faculty_members")
          .insert(memberData);

        if (error) throw error;
        toast.success("Öğretim üyesi eklendi");
      }

      setIsDialogOpen(false);
      resetForm();
      fetchFacultyMembers();
    } catch (error: any) {
      toast.error("İşlem başarısız: " + error.message);
    }
  };

  const handleEdit = (member: FacultyMember) => {
    setEditingId(member.id);
    setFormData({
      name: member.name,
      title: member.title,
      department: member.department,
      email: member.email || "",
      phone: member.phone || "",
      linkedin: member.linkedin || "",
      office: member.office || "",
      image_url: member.image_url || "",
      education: member.education || "",
      specialization: member.specialization || "",
      category: member.category || "",
      display_order: member.display_order || 0,
      email_display_order: member.email_display_order || 0,
      phone_display_order: member.phone_display_order || 0,
      linkedin_display_order: member.linkedin_display_order || 0,
      office_display_order: member.office_display_order || 0,
      education_display_order: member.education_display_order || 0,
      specialization_display_order: member.specialization_display_order || 0,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu öğretim üyesini silmek istediğinizden emin misiniz?")) return;

    try {
      const { error } = await supabase
        .from("faculty_members")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Öğretim üyesi silindi");
      fetchFacultyMembers();
    } catch (error: any) {
      toast.error("Silme işlemi başarısız: " + error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      title: "",
      department: "",
      email: "",
      phone: "",
      linkedin: "",
      office: "",
      image_url: "",
      education: "",
      specialization: "",
      category: "",
      display_order: 0,
      email_display_order: 0,
      phone_display_order: 0,
      linkedin_display_order: 0,
      office_display_order: 0,
      education_display_order: 0,
      specialization_display_order: 0,
    });
    setEditingId(null);
  };

  if (loading) {
    return <div className="text-center py-4">Yükleniyor...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Öğretim Üyeleri ({facultyMembers.length})</h3>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Yeni Öğretim Üyesi
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Öğretim Üyesi Düzenle" : "Yeni Öğretim Üyesi Ekle"}
              </DialogTitle>
              <DialogDescription>
                Öğretim üyesi bilgilerini girin ve kaydedin
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Ad Soyad *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="title">Unvan *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Prof. Dr., Doç. Dr., Dr. Öğr. Üyesi..."
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Kategori</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="Profesörler, Doçentler, vb."
                  />
                </div>
                <div>
                  <Label htmlFor="display_order">Sıralama</Label>
                  <Input
                    id="display_order"
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="department">Bölüm (iç kayıt için)</Label>
                <Input
                  id="department"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  placeholder="Yönetim Bilişim Sistemleri"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="office">Oda</Label>
                  <Input
                    id="office"
                    value={formData.office}
                    onChange={(e) => setFormData({ ...formData, office: e.target.value })}
                    placeholder="A-201"
                  />
                </div>
                <div>
                  <Label htmlFor="office_display_order">Oda Sıralama</Label>
                  <Input
                    id="office_display_order"
                    type="number"
                    value={formData.office_display_order}
                    onChange={(e) => setFormData({ ...formData, office_display_order: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">E-posta</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="ornek@universitesi.edu.tr"
                  />
                </div>
                <div>
                  <Label htmlFor="email_display_order">E-posta Sıralama</Label>
                  <Input
                    id="email_display_order"
                    type="number"
                    value={formData.email_display_order}
                    onChange={(e) => setFormData({ ...formData, email_display_order: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Telefon</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+90 XXX XXX XX XX"
                  />
                </div>
                <div>
                  <Label htmlFor="phone_display_order">Telefon Sıralama</Label>
                  <Input
                    id="phone_display_order"
                    type="number"
                    value={formData.phone_display_order}
                    onChange={(e) => setFormData({ ...formData, phone_display_order: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    type="url"
                    value={formData.linkedin}
                    onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>
                <div>
                  <Label htmlFor="linkedin_display_order">LinkedIn Sıralama</Label>
                  <Input
                    id="linkedin_display_order"
                    type="number"
                    value={formData.linkedin_display_order}
                    onChange={(e) => setFormData({ ...formData, linkedin_display_order: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="education">Eğitim Geçmişi</Label>
                  <Input
                    id="education"
                    value={formData.education}
                    onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                    placeholder="Lisans - Üniversite Adı (Yıl)"
                  />
                </div>
                <div>
                  <Label htmlFor="education_display_order">Eğitim Sıralama</Label>
                  <Input
                    id="education_display_order"
                    type="number"
                    value={formData.education_display_order}
                    onChange={(e) => setFormData({ ...formData, education_display_order: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="specialization">Uzmanlık Alanı</Label>
                  <Input
                    id="specialization"
                    value={formData.specialization}
                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    placeholder="Veri Bilimi, Yapay Zeka, vb."
                  />
                </div>
                <div>
                  <Label htmlFor="specialization_display_order">Uzmanlık Sıralama</Label>
                  <Input
                    id="specialization_display_order"
                    type="number"
                    value={formData.specialization_display_order}
                    onChange={(e) => setFormData({ ...formData, specialization_display_order: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="image_url">Fotoğraf URL</Label>
                <Input
                  id="image_url"
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              <Button type="submit" className="w-full">
                {editingId ? "Güncelle" : "Ekle"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ad Soyad</TableHead>
              <TableHead>Unvan</TableHead>
              <TableHead>Bölüm</TableHead>
              <TableHead>E-posta</TableHead>
              <TableHead>Telefon</TableHead>
              <TableHead>Ofis</TableHead>
              <TableHead>İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {facultyMembers.map((member) => (
              <TableRow key={member.id}>
                <TableCell className="font-medium">{member.name}</TableCell>
                <TableCell>{member.title}</TableCell>
                <TableCell>{member.department}</TableCell>
                <TableCell>{member.email || "-"}</TableCell>
                <TableCell>{member.phone || "-"}</TableCell>
                <TableCell>{member.office || "-"}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(member)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(member.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};