/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from './types';
import { auth, db } from './firebase';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut,
  User
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from './lib/firestoreUtils';

interface AuthContextType {
  user: UserProfile | null;
  firebaseUser: User | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<UserProfile>) => Promise<void>;
  register: (data: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fUser) => {
      setFirebaseUser(fUser);
      if (fUser) {
        const path = `users/${fUser.uid}`;
        try {
          const userDoc = await getDoc(doc(db, 'users', fUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data() as UserProfile;
            if (fUser.email === 'ahmedjama15.aj@gmail.com' && data.role !== 'admin') {
              data.role = 'admin';
              try {
                await updateDoc(doc(db, 'users', fUser.uid), { role: 'admin' });
              } catch (e) {
                console.error("Failed to update admin role", e);
              }
            }
            setUser(data);
          } else {
            // Create initial profile if it doesn't exist
            const newUser: UserProfile = {
              uid: fUser.uid,
              email: fUser.email || '',
              displayName: fUser.displayName || 'User',
              role: (fUser.email === 'ahmedjama15.aj@gmail.com') ? 'admin' : 'customer',
              photoURL: fUser.photoURL || undefined,
              createdAt: new Date().toISOString()
            };
            await setDoc(doc(db, 'users', fUser.uid), newUser);
            setUser(newUser);
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, path);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed:", error);
      alert("Failed to login with Google.");
    }
  };

  const register = async (data: any) => {
    // This is used for practitioner registration which adds extra fields
    if (user) {
      const path = `users/${user.uid}`;
      try {
        const updatedUser = { ...user, ...data, role: data.role || 'practitioner' };
        await setDoc(doc(db, 'users', user.uid), updatedUser);
        setUser(updatedUser);
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, path);
      }
    }
  };

  const updateUser = async (data: Partial<UserProfile>) => {
    if (user) {
      const path = `users/${user.uid}`;
      try {
        await updateDoc(doc(db, 'users', user.uid), data);
        setUser({ ...user, ...data });
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, path);
      }
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, firebaseUser, loading, login, logout, updateUser, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
