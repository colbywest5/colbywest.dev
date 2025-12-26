
import { Home, FileText, Briefcase, Mail } from 'lucide-react';

interface NavbarProps {
    activePage: string;
    setActivePage: (page: string) => void;
}

const Navbar = ({ activePage, setActivePage }: NavbarProps) => {
    const navItems = [
        { id: 'home', label: 'Home', icon: <Home size={20} /> },
        { id: 'resume', label: 'Resume', icon: <FileText size={20} /> },
        { id: 'portfolio', label: 'Portfolio', icon: <Briefcase size={20} /> },
        { id: 'contact', label: 'Contact', icon: <Mail size={20} /> },
    ];

    return (
        <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-black/50 backdrop-blur-2xl border border-white/10 rounded-full px-4 py-2 shadow-2xl shadow-neon-green/5">
            <ul className="flex items-center gap-2">
                {navItems.map((item) => (
                    <li key={item.id}>
                        <button
                            onClick={() => setActivePage(item.id)}
                            className={`relative px-4 py-2 rounded-full flex items-center gap-2 transition-all duration-300 ${activePage === item.id
                                    ? 'bg-white/10 text-white'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <span className={activePage === item.id ? 'text-neon-green' : ''}>
                                {item.icon}
                            </span>
                            <span className={`text-sm font-medium ${activePage === item.id ? 'translate-x-0 opacity-100' : 'hidden md:block'}`}>
                                {item.label}
                            </span>

                            {activePage === item.id && (
                                <span className="absolute inset-0 rounded-full ring-1 ring-white/10 shadow-[0_0_15px_rgba(0,255,157,0.1)] pointer-events-none" />
                            )}
                        </button>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default Navbar;
