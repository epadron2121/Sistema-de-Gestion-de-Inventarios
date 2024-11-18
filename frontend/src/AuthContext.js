// AuthContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebaseConfig"; // Aquí solo importamos auth y db

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);

      if (currentUser) {
        setUser(currentUser);

        // Recuperar el rol del usuario desde Firestore
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          setRole(userDocSnap.data().role);
        } else {
          setRole("employee"); // Valor por defecto si no se encuentra el rol
        }
      } else {
        setUser(null);
        setRole("");
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [db]);

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setRole("");
  };

  const value = { user, role, loading, logout };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
