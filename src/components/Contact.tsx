
import { Send, MapPin, Mail, Phone } from 'lucide-react';

interface ContactProps {
    isActive: boolean;
}

const Contact = ({ isActive }: ContactProps) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Info Box */}
            <div className="p-8 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md flex flex-col justify-center space-y-8">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-2">Get in Touch</h2>
                    <p className="text-gray-400">have a project in mind or just want to talk tech? I'm always open to new opportunities.</p>
                </div>

                <div className="space-y-6">
                    <ContactItem icon={<Mail size={20} />} label="Email" value="colbywest10@gmail.com" />
                    <ContactItem icon={<MapPin size={20} />} label="Location" value="Spring Hill, TN" />
                </div>
            </div>

            {/* Form Box */}
            <div className="p-8 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md">
                <form action="https://formspree.io/f/mojakpbz" method="POST" className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm text-gray-400 font-medium ml-1">Full Name</label>
                        <input
                            type="text"
                            name="fullname"
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-green/50 focus:ring-1 focus:ring-neon-green/50 transition-all placeholder:text-gray-600"
                            placeholder="John Doe"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-gray-400 font-medium ml-1">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-green/50 focus:ring-1 focus:ring-neon-green/50 transition-all placeholder:text-gray-600"
                            placeholder="john@example.com"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-gray-400 font-medium ml-1">Message</label>
                        <textarea
                            name="message"
                            required
                            rows={4}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-green/50 focus:ring-1 focus:ring-neon-green/50 transition-all placeholder:text-gray-600 resize-none"
                            placeholder="Tell me about your project..."
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-neon-green text-black font-bold py-4 rounded-xl hover:bg-neon-cyan transition-colors flex items-center justify-center gap-2"
                    >
                        <Send size={18} />
                        Send Message
                    </button>
                </form>
            </div>
        </div>
    );
};

const ContactItem = ({ icon, label, value }: { icon: any, label: string, value: string }) => (
    <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-neon-green border border-white/10">
            {icon}
        </div>
        <div>
            <span className="block text-xs text-gray-500 uppercase tracking-widest">{label}</span>
            <span className="text-white font-medium">{value}</span>
        </div>
    </div>
)

export default Contact;
