import Link from "next/link";

const LEADERS = [
  {
    name: "K.V. Ramesh",
    role: "Chairman & Managing Director",
    image: "/media/images/12ramesh.webp",
    bio: "The co-founder of Kairali Ayurvedic Group, K.V. Ramesh brings four decades of experience in Ayurveda. His connection with the tradition began as a teenager, assisting his father, Dr. K.S.V. Vasudevan, before he and Gita Ramesh established Kairali’s first centre in South Delhi. He also brings senior management experience from leading a multinational consortium.",
  },
  {
    name: "Gita Ramesh",
    role: "Managing Director",
    image: "/media/images/10gita.webp",
    bio: "A co-founder and the heart of the group since its inception, Gita Ramesh is a recognised Ayurvedic chef, author and scholar. Her work has helped shape the group’s standards of Ayurvedic knowledge, hospitality and guest care. She received the Safari India National Tourism Award for Best Woman Entrepreneur for Promoting Wellness in 2010.",
  },
  {
    name: "Abhilash K.R.",
    role: "Director",
    image: "/media/images/8abhilash.webp",
    bio: "Representing the fourth generation of the family, Abhilash K.R. has contributed to Kairali’s international growth and marketing. His lifelong exposure to the family’s Ayurvedic enterprise, paired with global business experience, supports the group’s relationships across the international wellness sector.",
  },
  {
    name: "Abishek K.R.",
    role: "Director",
    image: "/media/images/abishek.webp",
    bio: "Abishek K.R. leads operational development and new business set-ups across Kairali’s pharmaceutical, training and centre network. His experience includes the concept, planning and delivery of Ayurvedic spas and treatment centres in India and overseas, with a focus on operations, service standards, brand consistency and corporate strategy.",
  },
] as const;

export default function ProfilePageSections() {
  return (
    <div className="profile-story">
      <section className="profile-history" aria-labelledby="history">
        <div className="profile-section-head">
          <span className="overline">Four generations of Ayurveda</span>
          <h2 id="history">A family tradition, built across generations</h2>
          <p className="lede">Kairali Ayurvedic Group’s directors represent the third and fourth generations of a family of Ayurvedic practitioners. Their complementary experience in care, hospitality, education and enterprise has shaped the group’s international journey.</p>
        </div>
        <div className="profile-history-visuals">
          <figure className="profile-history-main photo">
            <img src="/media/pic/history.webp" width="1000" height="460" alt="Kairali Ayurvedic Group history" loading="lazy" decoding="async" />
          </figure>
          <figure className="profile-history-timeline">
            <img src="/media/pic/yeardetailimage.webp" width="321" height="954" alt="Milestones in Kairali Ayurvedic Group history" loading="lazy" decoding="async" />
          </figure>
        </div>
      </section>

      <section className="profile-founder" aria-labelledby="founder-message">
        <figure className="profile-founder-portrait">
          <img src="/media/pic/director-md-profile.webp" width="327" height="464" alt="K.V. Ramesh and Gita Ramesh, co-founders of Kairali Ayurvedic Group" loading="lazy" decoding="async" />
          <figcaption><strong>K.V. Ramesh and Gita Ramesh</strong><span>Co-founders, Kairali Ayurvedic Group</span></figcaption>
        </figure>
        <div className="profile-founder-copy">
          <span className="overline">From the founder</span>
          <h2 id="founder-message">Ayurveda and hospitality, held to one standard</h2>
          <blockquote>
            <p>“In 1989, my wife and I set out to share what our forefathers had known for generations: that authentic Ayurvedic care, thoughtful hospitality and a peaceful natural setting belong together.</p>
            <p>Our purpose was to make this tradition better understood and accessible across economic classes. The care we provide as hosts is as important as the Ayurvedic programmes and facilities at our destinations. That belief continues to guide how we operate our centres, welcome our guests and raise our standards.</p>
            <p>Our mission is, and will always be, to set a benchmark for Ayurveda and hospitality.”</p>
          </blockquote>
          <p className="profile-signature"><strong>K.V. Ramesh</strong><span>Chairman &amp; Managing Director</span></p>
        </div>
      </section>

      <section className="profile-leadership" aria-labelledby="management-team">
        <div className="profile-section-head">
          <span className="overline">Leadership</span>
          <h2 id="management-team">The people guiding Kairali</h2>
          <p>Kairali’s leadership combines inherited Ayurvedic knowledge with experience in hospitality, operations, education and international business.</p>
        </div>
        <div className="profile-leader-list">
          {LEADERS.map((leader, index) => (
            <article className="profile-leader" key={leader.name}>
              <div className="profile-leader-photo">
                <img src={leader.image} width="400" height="400" alt={leader.name} loading="lazy" decoding="async" />
              </div>
              <div className="profile-leader-copy">
                <span className="profile-leader-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <h3>{leader.name}</h3>
                <p className="profile-role">{leader.role}</p>
                <p>{leader.bio}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="profile-purpose" aria-labelledby="mission-vision">
        <div className="profile-section-head">
          <span className="overline">Purpose</span>
          <h2 id="mission-vision">Mission and vision</h2>
        </div>
        <div className="profile-purpose-grid">
          <article className="profile-purpose-card">
            <img src="/media/pic/mission-kairali.webp" width="481" height="277" alt="Kairali mission" loading="lazy" decoding="async" />
            <div><span className="overline">Our mission</span><h3>Wellbeing in balance</h3><p>Kairali encourages a comprehensive approach to health that understands each person as a complex combination of elements capable of being brought into harmony. The group is committed to enhancing wellbeing for individuals, the environment and the wider community.</p></div>
          </article>
          <article className="profile-purpose-card">
            <img src="/media/pic/vision-kairali.webp" width="481" height="277" alt="Kairali vision" loading="lazy" decoding="async" />
            <div><span className="overline">Our vision</span><h3>Ayurveda shared responsibly</h3><p>Kairali aims to advance Ayurvedic practice through an international community of doctors, therapists, educators, hoteliers and retreat providers, helping more people make informed choices about their wellbeing.</p></div>
          </article>
        </div>
        <p className="profile-centres-link"><Link className="text-link" href="/locations">Explore Kairali centres</Link></p>
      </section>
    </div>
  );
}
