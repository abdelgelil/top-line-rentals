import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { fetchApartmentById } from '../../services/api';
import BookingForm from '../../components/booking/BookingForm';
import { 
  Users, 
  Maximize, 
  Building, 
  Bed, 
  Star, 
  Info, 
  X, 
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Image as ImageIcon,
  MapPin,
  ShieldCheck
} from 'lucide-react';

const ImageLightbox = ({ images, initialIndex, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const nextImage = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevImage = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextImage, prevImage, onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-black/95 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="flex items-center justify-between p-4 text-white z-10">
        <div className="text-sm font-medium bg-white/10 px-3 py-1 rounded-full backdrop-blur-md">
          {currentIndex + 1} / {images.length}
        </div>
        <button 
          onClick={onClose}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-1 relative flex items-center justify-center p-4 sm:p-12">
        <button 
          onClick={prevImage}
          className="absolute left-4 p-3 rounded-full bg-black/30 text-white hover:bg-black/60 transition-all backdrop-blur-sm z-10"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
        
        <img 
          src={images[currentIndex]} 
          alt={`Property view ${currentIndex + 1}`} 
          className="max-w-full max-h-full object-contain rounded-lg shadow-2xl transition-all duration-300"
        />

        <button 
          onClick={nextImage}
          className="absolute right-4 p-3 rounded-full bg-black/30 text-white hover:bg-black/60 transition-all backdrop-blur-sm z-10"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      </div>

      <div className="p-6 flex justify-center gap-3 overflow-x-auto bg-gradient-to-t from-black/50 to-transparent">
        {images.map((img, idx) => (
          <button 
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
              currentIndex === idx ? 'border-amber-500 scale-110' : 'border-transparent opacity-50 hover:opacity-100'
            }`}
          >
            <img src={img} className="w-full h-full object-cover" alt={`Thumb ${idx}`} />
          </button>
        ))}
      </div>
    </div>
  );
};

export function ApartmentDetails({ currentUser: propUser }) {
  const { id } = useParams();
  const { user: clerkUser } = useUser();
  const currentUser = propUser || clerkUser;

  const [apartment, setApartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  useEffect(() => {
    fetchApartmentById(id)
      .then((res) => {
        const fetchedData = res?.data?.data || res?.data || res;
        if (fetchedData && (fetchedData._id || fetchedData.id)) {
          setApartment(fetchedData);
        } else {
          setApartment(null);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch apartment:', err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-500 space-y-4">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
        <p className="font-medium">Loading luxury details...</p>
      </div>
    );
  }

  if (!apartment) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-red-500 space-y-4">
        <Info className="w-12 h-12" />
        <p className="text-xl font-semibold">Apartment not found.</p>
      </div>
    );
  }

  const images = apartment.images || [];
  const currentImg = images[activeImageIndex] || 'https://via.placeholder.com/800x600';

  const openLightbox = (index) => {
    setIsLightboxOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-8 lg:py-16">
        
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <span className="hover:text-amber-600 cursor-pointer transition-colors">Apartments</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-slate-900 dark:text-white font-medium">{apartment.title}</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30 px-3 py-1 rounded-full">
            <ShieldCheck className="w-3 h-3" /> Verified Listing
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          <div className="lg:col-span-2 space-y-12">
            
            {/* Horizontal Image Slider / Carousel */}
            <div className="relative group">
              <div className="relative overflow-hidden rounded-[2.5rem] shadow-2xl ring-1 ring-black/5 bg-slate-200 dark:bg-slate-800">
                <div 
                  className="flex transition-transform duration-500 ease-out" 
                  style={{ transform: `translateX(-${activeImageIndex * 100}%)` }}
                >
                  {images.length > 0 ? (
                    images.map((img, idx) => (
                      <img 
                        key={idx}
                        src={img} 
                        alt={`Property view ${idx + 1}`} 
                        className="w-full h-[400px] sm:h-[550px] object-cover flex-shrink-0"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/800x600?text=No+Image'; }}
                      />
                    ))
                  ) : (
                    <img 
                      src="https://via.placeholder.com/800x600?text=No+Image" 
                      className="w-full h-[400px] sm:h-[550px] object-cover flex-shrink-0" 
                      alt="Placeholder" 
                    />
                  )}
                </div>

                {/* Navigation Arrows */}
                {images.length > 1 && (
                  <>
                    <button 
                      onClick={() => setActiveImageIndex(prev => (prev - 1 + images.length) % images.length)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/80 dark:bg-black/50 text-slate-900 dark:text-white hover:bg-white dark:hover:bg-black transition-all shadow-lg backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button 
                      onClick={() => setActiveImageIndex(prev => (prev + 1) % images.length)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/80 dark:bg-black/50 text-slate-900 dark:text-white hover:bg-white dark:hover:bg-black transition-all shadow-lg backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}

                {/* View All Overlay Button */}
                {images.length > 1 && (
                  <div className="absolute bottom-6 right-6">
                    <button 
                      onClick={() => openLightbox(0)}
                      className="flex items-center gap-2 bg-white/90 dark:bg-black/70 text-slate-900 dark:text-white px-4 py-2 rounded-full text-xs font-bold shadow-xl backdrop-blur-md hover:bg-white dark:hover:bg-black transition-all border border-white/20"
                    >
                      <ImageIcon className="w-4 h-4" />
                      <span>View All {images.length} Photos</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Pagination Dots */}
              {images.length > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                  {images.map((_, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        activeImageIndex === idx ? 'w-8 bg-amber-500' : 'w-1.5 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-sm font-bold uppercase tracking-widest">
                    
                  </div>
                  <h1 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                    {apartment.title}
                  </h1>
                </div>
                <div className="flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-4 py-2 rounded-full text-sm font-bold shadow-sm">
                  <Star className="w-4 h-4 fill-current" />
                  <span>Premium Luxury Listing</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { icon: Building, label: 'Tower', value: apartment.tower || 'Tower 1' },
                  { icon: Users, label: 'Guests', value: `${apartment.guests || 2} Max` },
                  { icon: Maximize, label: 'Area', value: `${apartment.sizeSqM || 'N/A'} m²` },
                  { icon: Bed, label: 'Type', value: 'Luxury Suite' },
                ].map((stat, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400">
                      <stat.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">{stat.label}</p>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{stat.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-12 pt-4">
              <section className="space-y-6">
                <div className="flex items-center gap-3 text-slate-900 dark:text-white font-bold text-2xl">
                  <div className="w-1 h-8 bg-amber-500 rounded-full" />
                  <h2>Property Overview</h2>
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-loose text-lg max-w-4xl">
                  {apartment.description}
                </p>
              </section>

              <section className="grid grid-cols-1 sm:grid-cols-2 gap-12 p-8 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="space-y-6">
                  <h3 className="font-bold text-slate-900 dark:text-white text-xl flex items-center gap-2">
                    <CheckCircle2 className="w-6 h-6 text-amber-500" />
                    Building Amenities
                  </h3>
                  <ul className="grid grid-cols-1 gap-4">
                    {['Infinity Pool', 'Fitness Center', '24/7 Concierge', 'Secure Parking', 'Private Beach Access', 'Spa & Wellness'].map((item) => (
                      <li key={item} className="flex items-center gap-3 text-slate-600 dark:text-slate-400 group cursor-default">
                        <div className="w-2 h-2 rounded-full bg-amber-500 group-hover:scale-150 transition-transform" /> 
                        <span className="text-sm transition-colors group-hover:text-slate-900 dark:group-hover:text-white">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-6">
                  <h3 className="font-bold text-slate-900 dark:text-white text-xl flex items-center gap-2">
                    <CheckCircle2 className="w-6 h-6 text-amber-500" />
                    House Rules
                  </h3>
                  <ul className="grid grid-cols-1 gap-4">
                    {['No Smoking Indoors', 'No Parties', 'Check-in after 2PM', 'Quiet hours 10PM-8AM', 'ID Required for Entry'].map((item) => (
                      <li key={item} className="flex items-center gap-3 text-slate-600 dark:text-slate-400 group cursor-default">
                        <div className="w-2 h-2 rounded-full bg-amber-500 group-hover:scale-150 transition-transform" /> 
                        <span className="text-sm transition-colors group-hover:text-slate-900 dark:group-hover:text-white">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-28 z-10">
              <BookingForm apartment={apartment} currentUser={currentUser} />
            </div>
          </div>
        </div>

        {isLightboxOpen && (
          <ImageLightbox 
            images={images} 
            initialIndex={activeImageIndex} 
            onClose={() => setIsLightboxOpen(false)} 
          />
        )}
      </div>
    </div>
  );
}

export default ApartmentDetails;
