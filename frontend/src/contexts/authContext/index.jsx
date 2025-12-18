import React, { useContext, createContext, useEffect, useState } from "react";
import { auth } from "../../firebase/firebase";
import { 
    GoogleAuthProvider, 
    signInWithPopup, 
    signInWithRedirect, 
    signOut, 
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile
} from "firebase/auth";

const AuthContext = createContext();

export function AuthProvider({children}) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Email/Password signup
    function signup(email, password, displayName) {
        return createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                if (displayName) {
                    return updateProfile(userCredential.user, {
                        displayName: displayName
                    });
                }
                return userCredential;
            });
    }

    // Email/Password login
    function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password);
    }

    // Google Popup login
    function loginWithGooglePopup() {
        const provider = new GoogleAuthProvider();
        return signInWithPopup(auth, provider);
    }

    // Google Redirect login
    function loginWithGoogleRedirect() {
        const provider = new GoogleAuthProvider();
        return signInWithRedirect(auth, provider);
    }

    // Logout
    function logout() {
        return signOut(auth);
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        signup,
        login,
        loginWithGooglePopup,
        loginWithGoogleRedirect,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}