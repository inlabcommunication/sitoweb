import { getAuth } from 'firebase/auth';
import { app, isFirebaseConfigured } from './firebase';

// Auth serve solo al pannello admin: tenuta separata così non finisce nel bundle del sito pubblico.
export const auth = isFirebaseConfigured() ? getAuth(app) : null;
