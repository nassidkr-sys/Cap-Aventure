import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  runTransaction,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Vehicle, Client, Reservation, ReservationStatus } from '@/types';

// ==========================================
// SERVICES VÉHICILES
// ==========================================

export async function getVehicles(): Promise<Vehicle[]> {
  try {
    const q = query(collection(db, 'vehicles'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const list: Vehicle[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      list.push({
        id: docSnap.id,
        slug: data.slug || '',
        name: data.name || '',
        type: data.type || 'van_amenege',
        description: data.description || '',
        pricePerDay: data.pricePerDay || 0,
        seats: data.seats || 2,
        beds: data.beds || 2,
        features: data.features || [],
        images: data.images || [],
        available: data.available !== false,
        location: data.location || 'Bordeaux',
        owner: data.owner || {
          name: 'Propriétaire',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
          responseTime: 'En moins d\'une heure',
          responseRate: 100
        },
        techSpecs: data.techSpecs || {
          fuel: 'Diesel',
          transmission: 'Manuelle',
          consumption: '8L/100km',
          enginePower: '130 ch'
        },
        rating: data.rating || 5.0,
        reviewCount: data.reviewCount || 0,
        reviews: data.reviews || [],
      });
    });
    
    if (list.length === 0) {
      return MOCK_VEHICLES;
    }
    return list;
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    return MOCK_VEHICLES;
  }
}

export async function getVehicleBySlug(slug: string): Promise<Vehicle | null> {
  try {
    const q = query(collection(db, 'vehicles'), where('slug', '==', slug));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const docSnap = querySnapshot.docs[0];
      const data = docSnap.data();
      return {
        id: docSnap.id,
        slug: data.slug || '',
        name: data.name || '',
        type: data.type || 'van_amenege',
        description: data.description || '',
        pricePerDay: data.pricePerDay || 0,
        seats: data.seats || 2,
        beds: data.beds || 2,
        features: data.features || [],
        images: data.images || [],
        available: data.available !== false,
        location: data.location || 'Bordeaux',
        owner: data.owner || {
          name: 'Propriétaire',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
          responseTime: 'En moins d\'une heure',
          responseRate: 100
        },
        techSpecs: data.techSpecs || {
          fuel: 'Diesel',
          transmission: 'Manuelle',
          consumption: '8L/100km',
          enginePower: '130 ch'
        },
        rating: data.rating || 5.0,
        reviewCount: data.reviewCount || 0,
        reviews: data.reviews || [],
      };
    }
    
    const mockFound = MOCK_VEHICLES.find(v => v.slug === slug);
    return mockFound || null;
  } catch (error) {
    console.error('Error fetching vehicle by slug:', error);
    const mockFound = MOCK_VEHICLES.find(v => v.slug === slug);
    return mockFound || null;
  }
}

export async function addVehicle(vehicle: Omit<Vehicle, 'id'>): Promise<string> {
  const docRef = await addDoc(collection(db, 'vehicles'), {
    ...vehicle,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateVehicle(id: string, vehicle: Partial<Vehicle>): Promise<void> {
  const docRef = doc(db, 'vehicles', id);
  await updateDoc(docRef, vehicle);
}

export async function deleteVehicle(id: string): Promise<void> {
  const docRef = doc(db, 'vehicles', id);
  await deleteDoc(docRef);
}

// ==========================================
// SERVICES RÉSERVATIONS & CLIENTS
// ==========================================

export async function createReservation(
  reservationInput: Omit<Reservation, 'id' | 'clientId' | 'clientName'>,
  clientInput: Omit<Client, 'id'>
): Promise<string> {
  try {
    const reservationId = await runTransaction(db, async (transaction) => {
      const clientsRef = collection(db, 'clients');
      const q = query(clientsRef, where('email', '==', clientInput.email));
      const clientQuerySnap = await getDocs(q);
      
      let clientId = '';
      if (!clientQuerySnap.empty) {
        clientId = clientQuerySnap.docs[0].id;
        const clientDocRef = doc(db, 'clients', clientId);
        transaction.update(clientDocRef, {
          lastName: clientInput.lastName,
          firstName: clientInput.firstName,
          phone: clientInput.phone,
          drivingLicenseNumber: clientInput.drivingLicenseNumber,
        });
      } else {
        const newClientDocRef = doc(collection(db, 'clients'));
        clientId = newClientDocRef.id;
        transaction.set(newClientDocRef, {
          ...clientInput,
          createdAt: Timestamp.now(),
        });
      }

      const newResDocRef = doc(collection(db, 'reservations'));
      transaction.set(newResDocRef, {
        ...reservationInput,
        clientId,
        clientName: `${clientInput.firstName} ${clientInput.lastName}`,
        createdAt: Timestamp.now(),
      });

      return newResDocRef.id;
    });

    return reservationId;
  } catch (error) {
    console.error('Error in createReservation transaction:', error);
    throw error;
  }
}

export async function getReservations(): Promise<Reservation[]> {
  try {
    const q = query(collection(db, 'reservations'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const list: Reservation[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      list.push({
        id: docSnap.id,
        vehicleId: data.vehicleId || '',
        vehicleName: data.vehicleName || '',
        clientId: data.clientId || '',
        clientName: data.clientName || '',
        startDate: data.startDate || '',
        endDate: data.endDate || '',
        totalDays: data.totalDays || 0,
        totalPrice: data.totalPrice || 0,
        status: data.status || 'EN_ATTENTE',
        specificDetails: data.specificDetails || {},
      });
    });
    return list;
  } catch (error) {
    console.error('Error fetching reservations:', error);
    return [];
  }
}

export async function updateReservationStatus(id: string, status: ReservationStatus): Promise<void> {
  const docRef = doc(db, 'reservations', id);
  await updateDoc(docRef, { status });
}

export async function getClients(): Promise<Client[]> {
  try {
    const q = query(collection(db, 'clients'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const list: Client[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      list.push({
        id: docSnap.id,
        lastName: data.lastName || '',
        firstName: data.firstName || '',
        email: data.email || '',
        phone: data.phone || '',
        drivingLicenseNumber: data.drivingLicenseNumber || '',
      });
    });
    return list;
  } catch (error) {
    console.error('Error fetching clients:', error);
    return [];
  }
}

// ==========================================
// DONNÉES DE DÉMO (MOCK STYLE YESCAPA)
// ==========================================

export const MOCK_VEHICLES: Vehicle[] = [
  {
    id: 'van-1',
    slug: 'california-coast',
    name: 'Volkswagen California Coast T6.1',
    type: 'van_amenege',
    description: 'Le compagnon d\'aventure historique et moderne à la fois. Prise en main facile, gabarit compact (hauteur < 2m pour les parkings et barrières de plages). Cuisine intégrée avec feux de cuisson, évier et réfrigérateur, toit relevable électrique avec couchage à lattes de pin et couchages confortables pour 4 personnes. Parfait pour les escapades sauvages en amoureux ou en petite famille.',
    pricePerDay: 120,
    seats: 4,
    beds: 4,
    features: ['Cuisine intégrée', 'Réfrigérateur 42L', 'Toit Relevable Électrique', 'Chauffage stationnaire diesel', 'Douchette extérieure', 'Régulateur de vitesse', 'Apple CarPlay'],
    images: [
      'https://images.unsplash.com/photo-1537243912151-1d5be8ad7fa0?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=800&q=80'
    ],
    available: true,
    location: 'Bordeaux',
    owner: {
      name: 'Marc',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      responseTime: 'En moins d\'une heure',
      responseRate: 98
    },
    techSpecs: {
      fuel: 'Diesel',
      transmission: 'Manuelle',
      consumption: '7.5L/100km',
      enginePower: '150 ch'
    },
    rating: 4.9,
    reviewCount: 14,
    reviews: [
      {
        id: 'rev-1',
        author: 'Sophie L.',
        date: '2026-05-15',
        rating: 5,
        comment: 'Superbe expérience ! Le van de Marc était d\'une propreté irréprochable et hyper maniable. Marc a pris le temps de tout nous expliquer au départ. On recommande les yeux fermés !'
      },
      {
        id: 'rev-2',
        author: 'Thomas B.',
        date: '2026-06-02',
        rating: 4.8,
        comment: 'Très bon séjour à bord de ce California. Tout l\'équipement nécessaire est présent et de grande qualité. Hâte de repartir sur les routes.'
      }
    ]
  },
  {
    id: 'cc-profile-1',
    slug: 'challenger-260',
    name: 'Challenger 260 Graphite Edition',
    type: 'camping_car_profile',
    description: 'Le profilé de luxe compact par excellence. Offre un espace de vie gigantesque avec son salon face-face (Smart Lounge) et son grand lit de pavillon escamotable électriquement (160x200cm). Une salle d\'eau moderne transversale arrière complète avec une immense penderie et un accès direct au garage à vélos chauffé.',
    pricePerDay: 150,
    seats: 4,
    beds: 4,
    features: ['Cuisine Équipée 3 feux', 'Grand Réfrigérateur 167L', 'Douche Séparée', 'Lit Pavillon Électrique', 'Porte-Vélos x3', 'Store extérieur', 'Chauffage sur carburant'],
    images: [
      'https://images.unsplash.com/photo-1513313778780-9ae4807465f2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?auto=format&fit=crop&w=800&q=80'
    ],
    available: true,
    location: 'Paris',
    owner: {
      name: 'Estelle',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      responseTime: 'En 2 heures',
      responseRate: 95
    },
    techSpecs: {
      fuel: 'Diesel',
      transmission: 'Automatique',
      consumption: '9.2L/100km',
      enginePower: '170 ch'
    },
    rating: 4.8,
    reviewCount: 9,
    reviews: [
      {
        id: 'rev-3',
        author: 'Julien M.',
        date: '2026-04-20',
        rating: 5,
        comment: 'Camping-car d\'un confort exceptionnel. Le salon est gigantesque et le lit pavillon très confortable. Estelle est très gentille et arrangeante. Nous avons adoré nos vacances.'
      }
    ]
  },
  {
    id: 'cc-integral-1',
    slug: 'hymer-b-class',
    name: 'Hymer B-Class MasterLine I 780',
    type: 'camping_car_integral',
    description: 'L\'expérience ultime du voyage en hôtel 5 étoiles roulant. Volume intérieur exceptionnel, pare-brise panoramique pour une visibilité totale de la route. Isolation thermique et acoustique suprême d\'Hymer. Finitions haut de gamme en cuir et bois précieux, grand lit central arrière et lit pavillon cabine.',
    pricePerDay: 220,
    seats: 4,
    beds: 5,
    features: ['Chauffage Central Alde', 'Double Plancher isolé', 'Four à Gaz intégré', 'Douche Indépendante Deluxe', 'Caméra de Recul 360°', 'Panneaux solaires 200W', 'Climatisation cellule'],
    images: [
      'https://images.unsplash.com/photo-1522030299830-16b8d3d049fe?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=800&q=80'
    ],
    available: true,
    location: 'Lyon',
    owner: {
      name: 'Jean-Pierre',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
      responseTime: 'En moins de 12 heures',
      responseRate: 90
    },
    techSpecs: {
      fuel: 'Diesel',
      transmission: 'Automatique',
      consumption: '11.5L/100km',
      enginePower: '180 ch'
    },
    rating: 5.0,
    reviewCount: 5,
    reviews: [
      {
        id: 'rev-4',
        author: 'Guillaume P.',
        date: '2026-05-30',
        rating: 5,
        comment: 'Le grand luxe ! Ce Hymer est un véritable palace roulant. Idéal pour un long roadtrip en famille dans les Alpes. Propriétaire très pro et pointilleux sur la sécurité.'
      }
    ]
  },
  {
    id: 'fourgon-1',
    slug: 'adria-twin-sports',
    name: 'Adria Twin Sports 600 SPB',
    type: 'fourgon_amenege',
    description: 'L\'équilibre parfait entre le confort d\'un camping-car et la maniabilité d\'un van. Son toit relevable exclusif offre une chambre supplémentaire suspendue dans les arbres. Grand lit transversal arrière repliable pour libérer une soute immense pour vos vélos ou vos planches de surf.',
    pricePerDay: 135,
    seats: 4,
    beds: 4,
    features: ['Cabinet de Toilette Duplex', 'Toit Relevable avec couchage', 'Soute Sportive Modulaire', 'Panneau Solaire 120W', 'Porte-Vélos pivotant', 'Store extérieur', 'GPS spécial camping-car'],
    images: [
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=800&q=80'
    ],
    available: true,
    location: 'Toulouse',
    owner: {
      name: 'Adrien',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      responseTime: 'En 1 heure',
      responseRate: 100
    },
    techSpecs: {
      fuel: 'Diesel',
      transmission: 'Manuelle',
      consumption: '8.4L/100km',
      enginePower: '140 ch'
    },
    rating: 4.7,
    reviewCount: 11,
    reviews: [
      {
        id: 'rev-5',
        author: 'Lucie D.',
        date: '2026-06-10',
        rating: 4.5,
        comment: 'Parfait pour notre séjour de surf dans les Landes. La soute est très grande pour loger nos planches et le toit relevable offre une superbe vue au réveil. Adrien a été très accueillant.'
      }
    ]
  }
];
