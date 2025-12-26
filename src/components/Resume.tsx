
import { BookOpen, Award, Briefcase, Code, Network } from 'lucide-react';

interface ResumeProps {
    isActive: boolean;
}

const Resume = ({ isActive }: ResumeProps) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Education & Certs Column */}
            <div className="space-y-6">
                <Section title="Education" icon={<BookOpen size={20} />}>
                    <TimelineItem
                        title="Columbia State Community College"
                        date="Expected May 2027"
                        desc="Associate of Science in Computer Science"
                    />
                    <TimelineItem
                        title="Lawrence County High School"
                        date="May 2017"
                        desc="High School Diploma"
                    />
                </Section>

                <Section title="Certifications" icon={<Award size={20} />}>
                    <TimelineItem
                        title="Unifi Full Stack Professional"
                        date="Ubiquiti Networks"
                        desc=""
                    />
                    <TimelineItem
                        title="Fiber Optic Fusion Splicing"
                        date="Sumitomo Electric"
                        desc=""
                    />
                </Section>
            </div>

            {/* Experience Column - Spans 2 */}
            <div className="lg:col-span-2 space-y-6">
                <Section title="Experience" icon={<Briefcase size={20} />}>
                    <TimelineItem
                        title="Network Engineer"
                        sub="Covenant Technology, LLC"
                        date="July 2023 - Current"
                        desc="Primary escalation point for complex network/security issues. Managing M365, Entra ID, and Fortinet/Aruba/Meraki stacks."
                    />
                    <TimelineItem
                        title="Help Desk Technician"
                        sub="First Farmers & Merchants Bank"
                        date="Jan 2023 - July 2023"
                        desc="Diagnosed software/WAN issues, managed tickets, and automated routine tasks with PowerShell."
                    />
                    <TimelineItem
                        title="IT Specialist"
                        sub="Huskey Truss & Building Supply"
                        date="July 2022 - Dec 2022"
                        desc="Sole support for 350+ employees. Managed Netgate Firewalls, Dell switches, and deployed KnowBe4 security training."
                    />
                </Section>

                <Section title="Skills" icon={<Code size={20} />}>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <SkillBadge name="Python" />
                        <SkillBadge name="React / Next.js" />
                        <SkillBadge name="TypeScript" />
                        <SkillBadge name="Tailwind CSS" />
                        <SkillBadge name="Cisco Networking" />
                        <SkillBadge name="Powershell" />
                        <SkillBadge name="Linux" />
                        <SkillBadge name="Azure" />
                    </div>
                </Section>
            </div>

        </div>
    );
};

const Section = ({ title, icon, children }: { title: string, icon: any, children: React.ReactNode }) => (
    <div className="p-6 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md">
        <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-white/5 text-neon-green">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-white">{title}</h3>
        </div>
        <div className="space-y-6">
            {children}
        </div>
    </div>
);

const TimelineItem = ({ title, sub, date, desc }: { title: string, sub?: string, date: string, desc: string }) => (
    <div className="relative pl-6 border-l border-white/10 pb-2 last:pb-0">
        <div className="absolute left-[-5px] top-1 w-2.5 h-2.5 rounded-full bg-neon-cyan shadow-[0_0_8px_#00e5ff]" />
        <h4 className="text-lg font-semibold text-white">{title}</h4>
        {sub && <span className="text-sm font-medium text-neon-green block mb-1">{sub}</span>}
        <span className="text-xs text-gray-500 uppercase tracking-widest mb-2 block">{date}</span>
        {desc && <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>}
    </div>
);

const SkillBadge = ({ name }: { name: string }) => (
    <div className="px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-sm text-center text-gray-300 hover:border-neon-green/30 hover:bg-neon-green/5 transition-colors">
        {name}
    </div>
)

export default Resume;
