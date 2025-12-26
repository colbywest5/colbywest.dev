import Image from 'next/image';

interface SidebarProps {
    isActive: boolean;
    toggleSidebar: () => void;
}

const Sidebar = ({ isActive, toggleSidebar }: SidebarProps) => {
    const IonIcon = 'ion-icon' as any;

    return (
        <aside className={`sidebar ${isActive ? 'active' : ''}`} data-sidebar>
            <div className="sidebar-info">
                <figure className="avatar-box">
                    <Image
                        src="/assets/images/my-avatar.png"
                        alt="Colby West"
                        width={80}
                        height={80}
                        className="rounded-[20px]"
                    />
                </figure>

                <div className="info-content">
                    <h1 className="name" title="Colby West">Colby West</h1>
                    <p className="title">Network Engineer</p>
                    <p className="title">Web Developer</p>
                </div>

                <button className="info_more-btn" data-sidebar-btn onClick={toggleSidebar}>
                    <span>Show Contacts</span>
                    <IonIcon name="chevron-down"></IonIcon>
                </button>
            </div>

            <div className="sidebar-info_more">
                <div className="separator"></div>

                <ul className="contacts-list">
                    <li className="contact-item">
                        <div className="icon-box">
                            <IonIcon name="mail-outline"></IonIcon>
                        </div>
                        <div className="contact-info">
                            <p className="contact-title">Email</p>
                            <a href="mailto:colbywest5@gmail.com" className="contact-link">colbywest5@gmail.com</a>
                        </div>
                    </li>

                    <li className="contact-item">
                        <div className="icon-box">
                            <IonIcon name="phone-portrait-outline"></IonIcon>
                        </div>
                        <div className="contact-info">
                            <p className="contact-title">Phone</p>
                            <a href="tel:+19312424929" className="contact-link">(931) 242-4929</a>
                        </div>
                    </li>

                    <li className="contact-item">
                        <div className="icon-box">
                            <IonIcon name="location-outline"></IonIcon>
                        </div>
                        <div className="contact-info">
                            <p className="contact-title">Location</p>
                            <address>Spring Hill, Tennessee, USA</address>
                        </div>
                    </li>
                </ul>
            </div>
        </aside>
    );
};

export default Sidebar;
