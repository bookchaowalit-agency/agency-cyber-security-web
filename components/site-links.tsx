// Shared public links for the hub, agency portfolio, privacy, status and contact.
export const contactHref = 'mailto:bookchaowalit.work@gmail.com';
export const hubHref = 'https://bookchaowalit.com';
export const portfolioHref = 'https://agency.bookchaowalit.com/agencies';

export default function SiteLinks() {
  return (
    <nav className="site-links" aria-label="ลิงก์เว็บไซต์">
      <a href={hubHref} lang="en">bookchaowalit.com</a>
      <a href={portfolioHref}>ดูทั้ง 14 กลุ่มงาน</a>
      <a href="https://bookchaowalit.com/privacy">Privacy</a>
      <a href="https://monitor.bookchaowalit.com/">Status</a>
      <a href={contactHref}>Contact</a>
    </nav>
  );
}
