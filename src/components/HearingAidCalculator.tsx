import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calculator, Phone, Mail, CheckCircle, FileText } from "lucide-react";

interface CalculationData {
  beneficiary: "self" | "relative";
  ageGroup: "0-4" | "5-12" | "13-18" | "18+";
  workStatus: "working" | "retired";
  phone: string;
  email: string;
  kvkkConsent: boolean;
}

interface PaymentAmount {
  netPaid: number;
  salaryDeduction: number;
}

const paymentRates: Record<string, Record<string, PaymentAmount>> = {
  "18+": {
    working: { netPaid: 3391.36, salaryDeduction: 0 },
    retired: { netPaid: 4239.20, salaryDeduction: 423.92 }
  },
  "13-18": {
    working: { netPaid: 5087.04, salaryDeduction: 0 },
    retired: { netPaid: 6358.80, salaryDeduction: 635.88 }
  },
  "5-12": {
    working: { netPaid: 5426.17, salaryDeduction: 0 },
    retired: { netPaid: 6782.72, salaryDeduction: 678.27 }
  },
  "0-4": {
    working: { netPaid: 6104.44, salaryDeduction: 0 },
    retired: { netPaid: 7630.56, salaryDeduction: 763.05 }
  }
};

export default function HearingAidCalculator() {
  const [step, setStep] = useState<"contact" | "details" | "results">("contact");
  const [data, setData] = useState<CalculationData>({
    beneficiary: "self",
    ageGroup: "18+",
    workStatus: "working",
    phone: "",
    email: "",
    kvkkConsent: false
  });

  const handleContactSubmit = () => {
    if (data.phone && data.email) {
      setStep("details");
    }
  };

  const handleCalculate = () => {
    if (data.kvkkConsent) {
      setStep("results");
    }
  };

  const calculation = paymentRates[data.ageGroup]?.[data.workStatus];

  const resetCalculator = () => {
    setStep("contact");
    setData({
      beneficiary: "self",
      ageGroup: "18+",
      workStatus: "working",
      phone: "",
      email: "",
      kvkkConsent: false
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background p-4">
      <div className="container mx-auto max-w-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <Calculator className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              İşitme Cihazı Hesaplayıcı
            </h1>
          </div>
          <p className="text-muted-foreground">
            İşitme cihazı ödeme tutarlarınızı kolayca hesaplayın
          </p>
        </div>

        {step === "contact" && (
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-primary" />
                İletişim Bilgileri
              </CardTitle>
              <CardDescription>
                Hesaplama sonuçlarını sizinle paylaşabilmemiz için iletişim bilgilerinizi girin
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Telefon Numarası</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="0555 123 45 67"
                  value={data.phone}
                  onChange={(e) => setData({ ...data, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-posta Adresi</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="ornek@email.com"
                  value={data.email}
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                />
              </div>
              <Button 
                onClick={handleContactSubmit}
                disabled={!data.phone || !data.email}
                className="w-full bg-gradient-primary hover:opacity-90 transition-all"
              >
                Devam Et
              </Button>
            </CardContent>
          </Card>
        )}

        {step === "details" && (
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle>Hesaplama Detayları</CardTitle>
              <CardDescription>
                Ödeme tutarını hesaplayabilmemiz için aşağıdaki bilgileri girin
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>Kimler için hesaplıyorsunuz?</Label>
                <RadioGroup
                  value={data.beneficiary}
                  onValueChange={(value: "self" | "relative") => setData({ ...data, beneficiary: value })}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="self" id="self" />
                    <Label htmlFor="self">Kendim için</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="relative" id="relative" />
                    <Label htmlFor="relative">Yakınım için</Label>
                  </div>
                </RadioGroup>
              </div>

              <Separator />

              <div className="space-y-3">
                <Label>Yaş Grubu</Label>
                <Select value={data.ageGroup} onValueChange={(value: any) => setData({ ...data, ageGroup: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Yaş grubunu seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-4">0-4 Yaş</SelectItem>
                    <SelectItem value="5-12">5-12 Yaş</SelectItem>
                    <SelectItem value="13-18">13-18 Yaş</SelectItem>
                    <SelectItem value="18+">18+ Yaş</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label>Çalışma Durumu</Label>
                <RadioGroup
                  value={data.workStatus}
                  onValueChange={(value: "working" | "retired") => setData({ ...data, workStatus: value })}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="working" id="working" />
                    <Label htmlFor="working">Çalışan</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="retired" id="retired" />
                    <Label htmlFor="retired">Emekli</Label>
                  </div>
                </RadioGroup>
              </div>

              <Separator />

              <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <h3 className="font-semibold flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  İletişim Bilgileriniz
                </h3>
                <p className="text-sm text-muted-foreground">Telefon: {data.phone}</p>
                <p className="text-sm text-muted-foreground">E-posta: {data.email}</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="kvkk"
                    checked={data.kvkkConsent}
                    onCheckedChange={(checked) => setData({ ...data, kvkkConsent: checked as boolean })}
                  />
                  <Label htmlFor="kvkk" className="text-sm">
                    KVKK kapsamında kişisel verilerimin işlenmesini kabul ediyorum
                  </Label>
                </div>
                <div className="ml-6">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="link" className="h-auto p-0 text-xs text-primary">
                        <FileText className="h-3 w-3 mr-1" />
                        KVKK metnini oku
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh]">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <FileText className="h-5 w-5" />
                          Kişisel Verilerin Korunması Kanunu (KVKK)
                        </DialogTitle>
                        <DialogDescription>
                          Aydınlatma Yükümlülüğünün Yerine Getirilmesinde Uyulacak Usul ve Esaslar Hakkında Tebliğ
                        </DialogDescription>
                      </DialogHeader>
                      <ScrollArea className="h-[60vh] mt-4">
                        <div className="space-y-4 text-sm">
                          <div>
                            <h3 className="font-bold text-base mb-2">AYDINLATMA YÜKÜMLÜLÜĞÜNÜN YERİNE GETİRİLMESİNDE UYULACAK USUL VE ESASLAR HAKKINDA TEBLİĞ</h3>
                            
                            <h4 className="font-semibold mt-4 mb-2">Amaç ve kapsam</h4>
                            <p><strong>MADDE 1 –</strong> Bu Tebliğin amacı, 24/3/2016 tarihli ve 6698 sayılı Kişisel Verilerin Korunması Kanununun 10 uncu maddesi uyarınca veri sorumluları veya yetkilendirdiği kişilerce yerine getirilmesi gereken aydınlatma yükümlülüğü kapsamında uyulacak usul ve esasları belirlemektir.</p>
                            
                            <h4 className="font-semibold mt-4 mb-2">Dayanak</h4>
                            <p><strong>MADDE 2 –</strong> Bu Tebliğ, 6698 sayılı Kişisel Verilerin Korunması Kanununun 22 nci maddesinin birinci fıkrasının (e) ve (g) bentlerine dayanılarak hazırlanmıştır.</p>
                            
                            <h4 className="font-semibold mt-4 mb-2">Tanımlar</h4>
                            <p><strong>MADDE 3 –</strong> Bu Tebliğde geçen;</p>
                            <ul className="list-disc ml-6 space-y-1">
                              <li><strong>Alıcı grubu:</strong> Veri sorumlusu tarafından kişisel verilerin aktarıldığı gerçek veya tüzel kişi kategorisini,</li>
                              <li><strong>İlgili kişi:</strong> Kişisel verisi işlenen gerçek kişiyi,</li>
                              <li><strong>Kanun:</strong> 24/3/2016 tarihli ve 6698 sayılı Kişisel Verilerin Korunması Kanununu,</li>
                              <li><strong>Kurul:</strong> Kişisel Verileri Koruma Kurulunu,</li>
                              <li><strong>Kurum:</strong> Kişisel Verileri Koruma Kurumunu,</li>
                              <li><strong>Veri sorumlusu:</strong> Kişisel verilerin işleme amaçlarını ve vasıtalarını belirleyen, veri kayıt sisteminin kurulmasından ve yönetilmesinden sorumlu olan gerçek veya tüzel kişiyi ifade eder.</li>
                            </ul>
                            
                            <h4 className="font-semibold mt-4 mb-2">Aydınlatma yükümlülüğünün kapsamı</h4>
                            <p><strong>MADDE 4 –</strong> Kanunun 10 uncu maddesine göre; kişisel verilerin elde edilmesi sırasında veri sorumluları veya yetkilendirdiği kişilerce, ilgili kişilerin bilgilendirilmesi gerekmektedir. Bu yükümlülük yerine getirilirken asgari olarak aşağıdaki konuları içermesi gerekmektedir:</p>
                            <ul className="list-disc ml-6 space-y-1">
                              <li>Veri sorumlusunun ve varsa temsilcisinin kimliği,</li>
                              <li>Kişisel verilerin hangi amaçla işleneceği,</li>
                              <li>Kişisel verilerin kimlere ve hangi amaçla aktarılabileceği,</li>
                              <li>Kişisel veri toplamanın yöntemi ve hukuki sebebi,</li>
                              <li>İlgili kişinin Kanunun 11 inci maddesinde sayılan diğer hakları.</li>
                            </ul>
                            
                            <h4 className="font-semibold mt-4 mb-2">Usul ve esaslar</h4>
                            <p><strong>MADDE 5 –</strong> Veri sorumlusu ya da yetkilendirdiği kişi tarafından aydınlatma yükümlülüğünün yerine getirilmesi esnasında aşağıda sayılan usul ve esaslara uyulması gerekmektedir:</p>
                            <ul className="list-disc ml-6 space-y-2">
                              <li>İlgili kişinin açık rızasına veya Kanundaki diğer işleme şartlarına bağlı olarak kişisel veri işlendiği her durumda aydınlatma yükümlülüğü yerine getirilmelidir.</li>
                              <li>Kişisel veri işleme amacı değiştiğinde, veri işleme faaliyetinden önce bu amaç için aydınlatma yükümlülüğü ayrıca yerine getirilmelidir.</li>
                              <li>Aydınlatma yükümlülüğünün yerine getirilmesi, ilgili kişinin talebine bağlı değildir.</li>
                              <li>Aydınlatma yükümlülüğünün yerine getirildiğinin ispatı veri sorumlusuna aittir.</li>
                              <li>Aydınlatma yükümlülüğü kapsamında açıklanacak kişisel veri işleme amacının belirli, açık ve meşru olması gerekir.</li>
                              <li>Aydınlatma yükümlülüğü kapsamında ilgili kişiye yapılacak bildirimin anlaşılır, açık ve sade bir dil kullanılarak gerçekleştirilmesi gerekmektedir.</li>
                              <li>Aydınlatma yükümlülüğü yerine getirilirken eksik, ilgili kişileri yanıltıcı ve yanlış bilgilere yer verilmemelidir.</li>
                            </ul>
                            
                            <p className="mt-4 text-xs text-muted-foreground">
                              Kaynak: T.C. Resmî Gazete, 10 Mart 2018, Sayı: 30356
                            </p>
                          </div>
                        </div>
                      </ScrollArea>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep("contact")} className="flex-1">
                  Geri
                </Button>
                <Button 
                  onClick={handleCalculate}
                  disabled={!data.kvkkConsent}
                  className="flex-1 bg-gradient-accent hover:opacity-90 transition-all"
                >
                  Hesapla
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === "results" && calculation && (
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Hesaplama Sonuçları
              </CardTitle>
              <CardDescription>
                {data.ageGroup} yaş grubu - {data.workStatus === "working" ? "Çalışan" : "Emekli"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
                  <h3 className="font-semibold text-primary mb-2">Net Ödenen</h3>
                  <p className="text-2xl font-bold">{calculation.netPaid.toLocaleString('tr-TR')} ₺</p>
                </div>
                <div className="bg-accent/10 p-4 rounded-lg border border-accent/20">
                  <h3 className="font-semibold text-accent mb-2">Maaştan Kesinti</h3>
                  <p className="text-2xl font-bold">{calculation.salaryDeduction.toLocaleString('tr-TR')} ₺</p>
                </div>
              </div>

              <Separator />

              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-semibold mb-3">Hesaplama Detayları</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Faydalanıcı:</span> {data.beneficiary === "self" ? "Kendisi" : "Yakını"}</p>
                  <p><span className="font-medium">Yaş Grubu:</span> {data.ageGroup}</p>
                  <p><span className="font-medium">Çalışma Durumu:</span> {data.workStatus === "working" ? "Çalışan" : "Emekli"}</p>
                  <p><span className="font-medium">Telefon:</span> {data.phone}</p>
                  <p><span className="font-medium">E-posta:</span> {data.email}</p>
                </div>
              </div>

              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-4">
                  PIL 104 ADET/YIL X 5,00 ₺ = 520,00 ₺ + 104,00 (KDV %20) = 624,00 ₺
                </p>
                <Button 
                  onClick={resetCalculator}
                  variant="outline"
                  className="w-full"
                >
                  Yeni Hesaplama Yap
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}