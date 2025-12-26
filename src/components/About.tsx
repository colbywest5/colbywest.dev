
import Image from 'next/image';

interface AboutProps {
    isActive: boolean;
}

const About = ({ isActive }: AboutProps) => {
    return (
        <article className={`about ${isActive ? 'active' : ''}`} data-page="about">
            <header>
                <h2 className="h2 article-title">About me</h2>
            </header>

            <section className="about-text">
                <p>
                    With a strong passion for technology and five years of hands-on experience in the IT industry, I am a
                    dedicated and self-taught professional committed to excellence. Through practical experience and continuous
                    self-education, I have honed my skills in network management, system security, and IT infrastructure design.
                    My expertise and adaptability make me a valuable asset to any team. I am eager to leverage my skills and
                    contribute to innovative projects, and I am open to discussing potential opportunities further.
                </p>
            </section>

            <section className="service">
                <h3 className="h3 service-title">What I'm doing</h3>

                <ul className="service-list">
                    <li className="service-item">
                        <div className="service-icon-box">
                            <Image src="/assets/images/icon-design.svg" alt="design icon" width={40} height={40} />
                        </div>

                        <div className="service-content-box">
                            <h4 className="h4 service-item-title">Network Engineering</h4>
                            <p className="service-item-text">
                                Designing, implementing, and maintaining reliable and secure network infrastructures.
                            </p>
                        </div>
                    </li>

                    <li className="service-item">
                        <div className="service-icon-box">
                            <Image src="/assets/images/icon-dev.svg" alt="Web development icon" width={40} height={40} />
                        </div>

                        <div className="service-content-box">
                            <h4 className="h4 service-item-title">Web Development</h4>
                            <p className="service-item-text">
                                Building responsive, modern websites and applications with a focus on performance and usability.
                            </p>
                        </div>
                    </li>
                </ul>
            </section>
        </article>
    );
};

export default About;
