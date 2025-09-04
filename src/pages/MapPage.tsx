import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Clock, User, Building } from "lucide-react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { Style, Icon } from "ol/style";
import { fromLonLat } from "ol/proj";
import "ol/ol.css";

interface FacultyMember {
  id: string;
  name: string;
  title: string;
  department: string;
  office?: string;
  image_url?: string;
  location_lat?: number;
  location_lon?: number;
}

interface Course {
  id: string;
  course_name: string;
  course_code: string;
  instructor: string;
  room: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  class_level: number;
  location_lat?: number;
  location_lon?: number;
}

interface SelectedItem {
  id: string;
  type: 'faculty' | 'course';
  data: FacultyMember | Course;
}

export default function MapPage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<Map | null>(null);
  const [facultyMembers, setFacultyMembers] = useState<FacultyMember[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null);

  useEffect(() => {
    document.title = "Kampüs Haritası";
    initializeMap();
    fetchData();
  }, []);

  const initializeMap = () => {
    if (!mapRef.current) return;

    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: fromLonLat([27.1815, 38.3850]), // Campus center coordinates
        zoom: 17,
      }),
    });

    mapInstanceRef.current = map;
  };

  const fetchData = async () => {
    try {
      // Fetch faculty members
      const { data: facultyData, error: facultyError } = await supabase
        .rpc("get_public_faculty_members") as { data: FacultyMember[] | null, error: any };

      if (facultyError) throw facultyError;

      // Fetch courses
      const { data: coursesData, error: coursesError } = await supabase
        .from("courses")
        .select("*")
        .order("course_name");

      if (coursesError) throw coursesError;

      setFacultyMembers(facultyData || []);
      setCourses(coursesData || []);
      
      // Add markers to map
      addMarkersToMap(facultyData || [], coursesData || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const addMarkersToMap = (faculty: FacultyMember[], courseList: Course[]) => {
    if (!mapInstanceRef.current) return;

    const vectorSource = new VectorSource();

    // Add faculty markers
    faculty.forEach((member) => {
      if (member.location_lat && member.location_lon) {
        const feature = new Feature({
          geometry: new Point(fromLonLat([member.location_lon, member.location_lat])),
          data: { ...member, type: 'faculty' },
        });

        feature.setStyle(
          new Style({
            image: new Icon({
              anchor: [0.5, 1],
              src: "data:image/svg+xml;base64," + btoa(`
                <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="16" cy="16" r="12" fill="#3b82f6" stroke="white" stroke-width="2"/>
                  <text x="16" y="20" text-anchor="middle" fill="white" font-size="14">👨‍🏫</text>
                </svg>
              `),
            }),
          })
        );

        vectorSource.addFeature(feature);
      }
    });

    // Add course/room markers
    const rooms = new Set<string>();
    courseList.forEach((course) => {
      if (course.location_lat && course.location_lon && !rooms.has(course.room)) {
        rooms.add(course.room);
        
        const feature = new Feature({
          geometry: new Point(fromLonLat([course.location_lon, course.location_lat])),
          data: { ...course, type: 'course' },
        });

        feature.setStyle(
          new Style({
            image: new Icon({
              anchor: [0.5, 1],
              src: "data:image/svg+xml;base64," + btoa(`
                <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="16" cy="16" r="12" fill="#10b981" stroke="white" stroke-width="2"/>
                  <text x="16" y="20" text-anchor="middle" fill="white" font-size="14">🏫</text>
                </svg>
              `),
            }),
          })
        );

        vectorSource.addFeature(feature);
      }
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });

    mapInstanceRef.current.addLayer(vectorLayer);

    // Add click handler
    mapInstanceRef.current.on("click", (event) => {
      const features = mapInstanceRef.current!.getFeaturesAtPixel(event.pixel);
      if (features.length > 0) {
        const feature = features[0];
        const data = feature.get("data");
        setSelectedItem({ id: data.id, type: data.type, data });
      }
    });
  };

  const handleItemClick = (item: FacultyMember | Course, type: 'faculty' | 'course') => {
    setSelectedItem({ id: item.id, type, data: item });
    
    if (item.location_lat && item.location_lon) {
      mapInstanceRef.current?.getView().animate({
        center: fromLonLat([item.location_lon, item.location_lat]),
        zoom: 19,
        duration: 1000,
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Harita yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Map Container */}
      <div className="flex-1 relative">
        <div 
          ref={mapRef} 
          className="w-full h-screen"
          style={{ minHeight: "100vh" }}
        />
        
        {/* Map Title Overlay */}
        <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm rounded-lg p-4 shadow-lg">
          <h1 className="text-2xl font-bold text-primary mb-1">Kampüs Haritası</h1>
          <p className="text-sm text-muted-foreground">
            Öğretim üyeleri ve derslik konumları
          </p>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center text-xs">👨‍🏫</div>
              <span className="text-sm">Öğretim Üyeleri</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center text-xs">🏫</div>
              <span className="text-sm">Derslikler</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-96 bg-background border-l border-border overflow-hidden flex flex-col">
        <div className="p-4 border-b border-border">
          <h2 className="text-lg font-semibold">Konum Bilgileri</h2>
          <p className="text-sm text-muted-foreground">
            Haritadaki öğelerle etkileşim kurun
          </p>
        </div>

        <div className="flex-1 overflow-y-auto">
          <Tabs defaultValue="faculty" className="w-full">
            <TabsList className="grid w-full grid-cols-2 m-4 mb-0">
              <TabsTrigger value="faculty">Öğretim Üyeleri</TabsTrigger>
              <TabsTrigger value="courses">Derslikler</TabsTrigger>
            </TabsList>

            <TabsContent value="faculty" className="p-4 pt-2">
              <div className="space-y-3">
                {facultyMembers.map((member) => (
                  <Card 
                    key={member.id} 
                    className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                      selectedItem?.data.id === member.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => handleItemClick(member, 'faculty')}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start gap-3">
                        {member.image_url && (
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-muted flex-shrink-0">
                            <img
                              src={member.image_url}
                              alt={member.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{member.name}</h4>
                          <p className="text-xs text-muted-foreground truncate">{member.title}</p>
                          <p className="text-xs text-muted-foreground truncate">{member.department}</p>
                          {member.office && (
                            <div className="flex items-center gap-1 mt-1">
                              <MapPin className="w-3 h-3" />
                              <span className="text-xs">{member.office}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="courses" className="p-4 pt-2">
              <div className="space-y-3">
                {Array.from(new Set(courses.map(c => c.room))).map((room) => {
                  const roomCourses = courses.filter(c => c.room === room);
                  const firstCourse = roomCourses[0];
                  
                  return (
                    <Card 
                      key={room}
                      className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                        selectedItem?.type === 'course' && (selectedItem.data as Course).room === room ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => handleItemClick(firstCourse, 'course')}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0">
                            <Building className="w-5 h-5 text-green-600 dark:text-green-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm">{room}</h4>
                            <p className="text-xs text-muted-foreground">
                              {roomCourses.length} ders
                            </p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {roomCourses.slice(0, 2).map((course) => (
                                <Badge key={course.id} variant="secondary" className="text-xs">
                                  {course.course_code}
                                </Badge>
                              ))}
                              {roomCourses.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{roomCourses.length - 2}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Selected Item Details */}
        {selectedItem && (
          <div className="border-t border-border p-4 bg-muted/20">
            <h3 className="font-semibold text-sm mb-2">Seçili Öğe</h3>
            {selectedItem.type === 'faculty' ? (
              <div className="space-y-2">
                <h4 className="font-medium">{(selectedItem.data as FacultyMember).name}</h4>
                <p className="text-sm text-muted-foreground">{(selectedItem.data as FacultyMember).title}</p>
                <p className="text-sm text-muted-foreground">{(selectedItem.data as FacultyMember).department}</p>
                {(selectedItem.data as FacultyMember).office && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{(selectedItem.data as FacultyMember).office}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <h4 className="font-medium">{(selectedItem.data as Course).room}</h4>
                <div className="space-y-1">
                  {courses
                    .filter(c => c.room === (selectedItem.data as Course).room)
                    .slice(0, 3)
                    .map((course) => (
                      <div key={course.id} className="text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Clock className="w-3 h-3" />
                          <span>{course.course_name} - {course.day_of_week} {course.start_time}</span>
                        </div>
                      </div>
                    ))
                  }
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}


