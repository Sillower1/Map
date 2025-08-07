import { Facebook, Instagram, MessageCircle, Mail, Phone } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="w-full bg-muted">
      <div className="w-full py-6 px-4 md:px-8 lg:px-40">
        {/* Sınır çizgisi grid ile hizalı */}
        <div className="border-t border-border w-full mb-6 md:mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8 items-start w-full">
          {/* Diğer 3 kolon: iletişim, şubeler, hızlı erişim */}
          {/* İletişim Section */}
          <div className="space-y-8">
            <div className="flex items-center space-x-3">
              <a 
                href="https://izmirses.com.tr/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="cursor-pointer hover:opacity-80 transition-opacity"
              >
                <img 
                  src="/izmirses-logo.jpeg" 
                  alt="İzmirses İşitme Cihazları" 
                  className="h-20 object-contain"
                />
              </a>
            </div>
            
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-foreground">İletişim</h3>
              
              <div className="space-y-4 text-base text-muted-foreground">
                <p className="text-lg leading-relaxed">
                  Şair Eşref Bulv. No:82/1 Şair<br />
                  Apt. K1 D1 Alsancak / İzmir
                </p>
                
                <a 
                  href="mailto:mert.arslan@izmirses.com.tr"
                  className="text-primary hover:text-primary-dark transition-colors flex items-center gap-3 text-lg"
                >
                  <Mail className="w-5 h-5" />
                  mert.arslan@izmirses.com.tr
                </a>
                
                <a 
                  href="tel:05050359990"
                  className="text-foreground hover:text-primary transition-colors flex items-center gap-3 text-lg"
                >
                  <Phone className="w-5 h-5" />
                  0 (505) 035 99 90
                </a>
              </div>

              {/* Social Media Icons */}
              <div className="flex space-x-6 pt-4">
                <a
                  href="https://www.instagram.com/izmirsesisitme/#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground hover:bg-primary-dark transition-colors"
                >
                  <Instagram className="w-6 h-6" />
                </a>
                <a
                  href="https://www.facebook.com/izmirsesisitme/?locale=tr_TR"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground hover:bg-primary-dark transition-colors"
                >
                  <Facebook className="w-6 h-6" />
                </a>
                <a
                  href="https://api.whatsapp.com/send/?phone=05050359990&text=Merhabalar+bilgi+almak+istiyorum&type=phone_number&app_absent=0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground hover:bg-primary-dark transition-colors"
                >
                  <img src="/whatsapp_logo.png" alt="WhatsApp" className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>

          {/* Şubelerimiz Section */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-foreground">Şubelerimiz</h3>
            <div className="space-y-4">
              {[
                "Karşıyaka Şube",
                "Gaziemir Şubesi", 
                "Balçova Şubesi",
                "Menderes Şubesi",
                "Alsancak Şubesi",
                "Yeşilyurt Şubesi"
              ].map((branch) => (
                <a
                  key={branch}
                  href="https://izmirses.com.tr/iletisim/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-lg text-muted-foreground hover:text-primary transition-colors"
                >
                  {branch}
                </a>
              ))}
            </div>
          </div>

          {/* Hızlı Erişim Section */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-foreground">Hızlı Erişim</h3>
            <div className="space-y-4">
              <a
                href="https://izmirses.com.tr/"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-lg text-muted-foreground hover:text-primary transition-colors"
              >
                Anasayfa
              </a>
              <a
                href="https://izmirses.com.tr/faydali-bilgiler/"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-lg text-muted-foreground hover:text-primary transition-colors"
              >
                Faydalı Bilgiler
              </a>
              <a
                href="https://izmirses.com.tr/hakkimizda/"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-lg text-muted-foreground hover:text-primary transition-colors"
              >
                Hakkımızda
              </a>
              <a
                href="https://izmirses.com.tr/hizmetlerimiz/"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-lg text-muted-foreground hover:text-primary transition-colors"
              >
                Hizmetlerimiz
              </a>
              <a
                href="https://izmirses.com.tr/kulak-arkasi-isitme-cihazlari/"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-lg text-muted-foreground hover:text-primary transition-colors"
              >
                Kulak Arkası İşitme Cihazları
              </a>
              <a
                href="https://izmirses.com.tr/kulak-ici-isitme-cihazlari/"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-lg text-muted-foreground hover:text-primary transition-colors"
              >
                Kulak İçi İşitme Cihazları
              </a>
              <a
                href="https://izmirses.com.tr/randevu-al/"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-lg text-muted-foreground hover:text-primary transition-colors"
              >
                Randevu Alın
              </a>
              <a
                href="https://izmirses.com.tr/iletisim/"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-lg text-muted-foreground hover:text-primary transition-colors"
              >
                İletişim
              </a>
            </div>
          </div>
          {/* Açıklama yazısı en sağa alınıyor */}
          <div className="md:col-span-1 col-span-full flex items-center justify-center mb-8 md:mb-0">
            <p className="text-base md:text-lg font-bold text-foreground leading-relaxed drop-shadow-sm max-w-xs text-center">
              İzmir Ses, İzmir'de işitme kaybıyla mücadele eden bireylere en iyi işitme çözümlerini sunmaya kendini adamıştır. 20 yılı aşkın deneyime sahip uzman ekibimiz, her bireyin özel ihtiyaçlarını karşılamak için en son teknolojiyi ve en yüksek kaliteli ürünleri kullanmaktadır.
            </p>
          </div>
        </div>
        {/* Copyright */}
        <div className="border-t border-border w-full mt-8"></div>
        <div className="pt-6 text-center">
          <p className="text-base text-muted-foreground">
            © 2025. İzmirses İşitme Cihazları. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  );
};