import React from 'react';
import { supabase } from '../lib/supabase';
import { LogIn } from 'lucide-react';

const Auth = () => {
    const handleLogin = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin
            }
        });
        if (error) alert(error.message);
    };

    return (
        <div className="h-screen flex items-center justify-center bg-[#050510] p-4">
            <div className="w-full max-w-md bg-white/5 backdrop-blur-3xl border border-white/10 p-10 rounded-[40px] shadow-2xl text-center flex flex-col items-center gap-8">
                <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-3xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
                    <LogIn size={40} className="text-black" />
                </div>

                <div>
                    <h1 className="text-4xl font-black italic tracking-tighter text-white mb-2">
                        TOON <span className="text-cyan-400">ATTACKS</span>
                    </h1>
                    <p className="text-gray-400 text-sm font-bold uppercase tracking-widest opacity-60">
                        Sign in to save your progress
                    </p>
                </div>

                <button
                    onClick={handleLogin}
                    className="w-full py-5 bg-white hover:bg-cyan-50 text-black font-black italic text-lg rounded-2xl transition-all shadow-xl hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3"
                >
                    <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
                    LOGIN WITH GOOGLE
                </button>

                <p className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.2em]">
                    Powered by Supabase & Socket.io
                </p>
            </div>
        </div>
    );
};

export default Auth;
