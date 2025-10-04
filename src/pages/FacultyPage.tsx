import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";

interface FacultyMember {
  id: string;
  name: string;
  title: string;
  office?: string;
  image_url?: string;
  education?: string;
  specialization?: string;
  contact_info?: string;
  category?: string;
  display_order: number;
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
                      {member.office && (
                        <div className="flex items-start gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <div>
                            <span className="font-medium">Oda:</span> {member.office}
                          </div>
                        </div>
                      )}
                      
                      {member.contact_info && (
                        <div className="text-sm">
                          <span className="font-medium">İletişim:</span>
                          <p className="mt-1 text-muted-foreground">{member.contact_info}</p>
                        </div>
                      )}
                      
                      {member.education && (
                        <div className="text-sm">
                          <span className="font-medium">Eğitim Geçmişi:</span>
                          <p className="mt-1 text-muted-foreground whitespace-pre-line">{member.education}</p>
                        </div>
                      )}
                      
                      {member.specialization && (
                        <div className="text-sm">
                          <span className="font-medium">Uzmanlık Alanı:</span>
                          <p className="mt-1 text-muted-foreground">{member.specialization}</p>
                        </div>
                      )}
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