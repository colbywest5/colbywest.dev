
import Image from 'next/image';
import { ExternalLink, Layers } from 'lucide-react';

interface PortfolioProps {
    isActive: boolean;
}

const Portfolio = ({ isActive }: PortfolioProps) => {
    const projects = [
        { title: 'Finance', category: 'Web App', img: '/assets/images/project-1.jpg' },
        { title: 'Orizon', category: 'Landing Page', img: '/assets/images/project-2.png' },
        { title: 'Fundo', category: 'Design System', img: '/assets/images/project-3.jpg' },
        { title: 'Brawlhalla', category: 'Stats Tracker', img: '/assets/images/project-4.png' },
        { title: 'DSM.', category: 'E-Commerce', img: '/assets/images/project-5.png' },
        { title: 'MetaSpark', category: 'Dashboard', img: '/assets/images/project-6.png' },
        { title: 'Summary', category: 'SaaS', img: '/assets/images/project-7.png' },
        { title: 'Task Manager', category: 'Productivity', img: '/assets/images/project-8.jpg' },
        { title: 'Arrival', category: 'Travel UI', img: '/assets/images/project-9.png' },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
                <div
                    key={index}
                    className="group relative rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md overflow-hidden hover:border-neon-cyan/50 transition-colors"
                >
                    {/* Image */}
                    <div className="aspect-video relative overflow-hidden">
                        <Image
                            src={project.img}
                            alt={project.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <div className="p-3 bg-neon-cyan text-black rounded-full">
                                <ExternalLink size={24} />
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                        <h3 className="text-lg font-bold text-white mb-1">{project.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-neon-green">
                            <Layers size={14} />
                            <span>{project.category}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Portfolio;
