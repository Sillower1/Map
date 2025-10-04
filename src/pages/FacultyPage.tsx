import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";

interface FacultyMember {
  id: string;
  name: string;
  title: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  office?: string;
  image_url?: string;
  education?: string;
  specialization?: string;
  category?: string;
  display_order: number;
  email_display_order?: number;
  phone_display_order?: number;
  linkedin_display_order?: number;
  office_display_order?: number;
  education_display_order?: number;
  specialization_display_order?: number;
}

const FacultyPage = () => {
  const [facultyMembers, setFacultyMembers] = useState<FacultyMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Öğretim Üyeleri";
    fetchFacultyMembers();
  }, []);

  const fetchFacultyMembers = async () => {
    try {
      // Use the security function to get only public faculty information
      const { data, error } = await supabase
        .rpc("get_public_faculty_members") as { data: FacultyMember[] | null, error: any };

      if (error) throw error;
      setFacultyMembers(data || []);
    } catch (error) {
      console.error("Error fetching faculty members:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Yükleniyor...</div>
      </div>
    );
  }

  // Group faculty members by category
  const groupedMembers = facultyMembers.reduce((acc, member) => {
    const category = member.category || "Diğer";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(member);
    return acc;
  }, {} as Record<string, FacultyMember[]>);

  const categories = Object.keys(groupedMembers).sort();

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Öğretim Üyeleri</h1>
        <p className="text-muted-foreground">Fakültemizin değerli öğretim üyelerini tanıyın</p>
      </header>

      <main className="space-y-12">
        {categories.map((category) => (
          <section key={category}>
            <h2 className="text-2xl font-semibold text-foreground mb-6 pb-2 border-b">
              {category}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groupedMembers[category].map((member) => (
                <Card key={member.id} className="overflow-hidden">
                  <CardHeader className="pb-4">
                    {member.image_url && (
                      <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden bg-muted">
                        <img
                          src={member.image_url}
                          alt={`${member.name} fotoğrafı`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardTitle className="text-center text-lg">{member.name}</CardTitle>
                    <p className="text-center text-sm text-muted-foreground">{member.title}</p>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      {(() => {
                        const fields = [
                          { key: 'office', label: 'Oda', value: member.office, order: member.office_display_order || 0, icon: MapPin },
                          { key: 'email', label: 'E-posta', value: member.email, order: member.email_display_order || 0 },
                          { key: 'phone', label: 'Telefon', value: member.phone, order: member.phone_display_order || 0 },
                          { key: 'linkedin', label: 'LinkedIn', value: member.linkedin, order: member.linkedin_display_order || 0, isLink: true },
                          { key: 'education', label: 'Eğitim Geçmişi', value: member.education, order: member.education_display_order || 0 },
                          { key: 'specialization', label: 'Uzmanlık Alanı', value: member.specialization, order: member.specialization_display_order || 0 },
                        ];

                        return fields
                          .filter(field => field.value)
                          .sort((a, b) => a.order - b.order)
                          .map(field => {
                            const Icon = field.icon;
                            return (
                              <div key={field.key} className="text-sm">
                                <div className="flex items-start gap-2">
                                  {Icon && <Icon className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />}
                                  <div className="flex-1">
                                    <span className="font-medium">{field.label}:</span>
                                    {field.isLink ? (
                                      <a 
                                        href={field.value} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="ml-1 text-primary hover:underline"
                                      >
                                        Profili Görüntüle
                                      </a>
                                    ) : (
                                      <p className="mt-1 text-muted-foreground whitespace-pre-line">{field.value}</p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          });
                      })()}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        ))}

        {facultyMembers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Henüz öğretim üyesi bilgisi bulunmamaktadır.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default FacultyPage;